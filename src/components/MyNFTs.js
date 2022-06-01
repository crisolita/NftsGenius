import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Spinner, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import arrowLeft from "../assets/png/NFT Solidario-08.png";
import arrowRight from "../assets/png/NFT Solidario-09.png";
import Dropzone from "react-dropzone";
import { client, GET_ERC1155_NEWS, GET_SALES } from "../querys/subgraph";

import {
  categorias,
  marketplace_abi,
  marketplace_address,
  NFT1155_abi,
  NFT1155_address,
} from "../utils/constants";
import ipfs from "../utils/ipfs";
import axios from "axios";
import ItemCard from "./ItemCard";
import { EtherscanProvider } from "@ethersproject/providers";
import { EventEmitter } from "stream";

export const MyNFTs = () => {
  const DEPLOY_BLOCK = 19473866;
  const { account, library } = useWeb3React();
  const [NFTcontract, setNFTcontract] = useState();
  const [MRKTcontract, setMRKTcontract] = useState();
  const [allNFTs, setAllNFTs] = useState([]);
  const [carrouselNFTs, setCarrouselNFTs] = useState([]);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    if (library) {
      setNFTcontract(
        new Contract(NFT1155_address, NFT1155_abi, library.getSigner())
      );
      setMRKTcontract(
        new Contract(marketplace_address, marketplace_abi, library.getSigner())
      );
    }
  }, [library]);

  const loadNFTs = async () => {
    let allEvents = [];
    const { tokens } = await client.request(GET_ERC1155_NEWS());
    const { sales } = await client.request(GET_SALES());

    console.log(tokens, "los NFTs");
    console.log(sales, "las ventas");

    const events = await NFTcontract.queryFilter(
      NFTcontract.filters.newNFT(),
      19648435,
      19648490
    );

    for (const element of events) {
      let x = await NFTcontract.uri(element.args.id);
      let resp = await axios.get(
        `https://ipfs.infura.io/ipfs/${x.split("ipfs://").join("")}`
      );
      let isVideo = false;
      let cat = "";
      resp.data.attributes.forEach((element) => {
        if (element.trait_type === "Video") {
          isVideo = element.value;
        }
        if (element.trait_type === "Category") {
          cat = element.value;
        }
      });
      resp.data.image = `https://ipfs.infura.io/ipfs/${resp.data.image
        .split("ipfs://")
        .join("")}`;
      allEvents.push({
        ...element,
        isVideo,
        id: element.args.id.toString(),
        data: resp.data,
        price: "",
        category: cat,
      });
    }
    // let sellOrders = await MRKTcontract.queryFilter(
    //   MRKTcontract.filters.Sell(),
    //   19566631,
    //   19566631
    // );
    // let lowerPrice = 0;
    // console.log(sellOrders);
    // for (const element2 of sellOrders) {
    //   const order = element2.returnValues;
    //   if (String(order.tokenId) === String(element.returnValues.id)) {
    //     const details = await MRKTcontract.orders(order.orderId).call();
    //     if (details.active) {
    //       let x = {};
    //       x.seller = details.seller;
    //       x.amount = Number(details.amount);
    //       x.price = ethers.utils.parseUnits(String(details.price), "wei");
    //       if (lowerPrice === 0) lowerPrice = parseFloat(x.price);
    //       if (parseFloat(x.price) < lowerPrice)
    //         lowerPrice = parseFloat(x.price);
    //     }
    //   }

    setAllNFTs(allEvents);
  };

  useEffect(() => {
    if (library && NFTcontract) {
      loadNFTs();
    }
  }, [library, NFTcontract]);

  useEffect(() => {
    setChanging(false);
  }, [changing]);

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    let perPage = 0;
    if (window.innerWidth < 768) perPage = 1;
    else if (window.innerWidth < 1100) perPage = 2;
    else perPage = 3;

    let ordered = JSON.parse(JSON.stringify(allNFTs));
    ordered.sort((a, b) => {
      if (a.price < b.price) return 1;
      else return -1;
    });
    ordered = ordered.slice(0, 9);

    setCarrouselNFTs(
      ordered?.reduce((all, one, i) => {
        const ch = Math.floor(i / perPage);
        all[ch] = [].concat(all[ch] || [], one);
        return all;
      }, [])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allNFTs]);

  return (
    <div className="mynfts-container">
      {carrouselNFTs[0]?.map((o) => {
        console.log(o);
        return (
          <Link
            to={`/item/${o.id}`}
            className="nft--card--container"
            key={o.id}
          >
            <div className="nft--card--details">
              <div
                // href={`https://etherscan.io/address/${o.address}`}
                // target="_blank"
                className="nft--card--details-price"
                // rel="noreferrer"
                // style={{ color: "revert" }}
              >
                {o?.address.substring(0, 6) +
                  "..." +
                  o?.address.substring(38, 42)}
              </div>
            </div>
            <div className="nft--card--image">
              {o.isVideo ? (
                <iframe
                  title="Video"
                  style={{ height: "100%", width: "100%" }}
                  src={o.data.image}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={o.data.image}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>

            <div className="nft--card--name">{o.data.name}</div>
            <div className="nft--card--details">
              <div className="nft--card--details-price">
                {o?.price ? o.price + " BNB" : "420.69 BNB"}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
export default MyNFTs;
