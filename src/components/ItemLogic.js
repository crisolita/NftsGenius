import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
// import Swal from 'sweetalert2'
import {
  marketplace_abi,
  marketplace_address,
  NFT1155_abi,
  NFT1155_address,
} from "../utils/constants";
import Swal from "sweetalert2";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";

const ItemLogic = () => {
  const { account, library, active } = useWeb3React();
  const [NFTcontract, setNFTcontract] = useState();
  const [MRKTcontract, setMRKTcontract] = useState();
  const [allNFTs, setAllNFTs] = useState([]);
  const [carrouselNFTs, setCarrouselNFTs] = useState([]);
  const { id } = useParams();

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
  //state
  const [item, setItem] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalTransfer, setShowModalTransfer] = useState(false);
  const [isItemOwner, setIsItemOwner] = useState(false);
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState("");
  const [sellOffers, setSellOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingSell, setLoadingSell] = useState(false);
  const [loadingTransfer, setLoadingTransfer] = useState(false);
  const [metadata, setMetadata] = useState("");
  const [ownerContent, setOwnerContent] = useState("");
  const [amountOwn, setAmountOwn] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [isOwnerAmount, setisOwnerAmount] = useState(false);

  const getData = async () => {
    if (library && NFTcontract) {
      let x = await NFTcontract.uri(id);
      setMetadata(
        `\n Metadata JSON: https://ipfs.io/ipfs/${x.split("ipfs://").join("")}`
      );
      console.log(x);
      let resp = await axios.get(
        `https://ipfs.io/ipfs/${x.split("ipfs://").join("")}`
      );
      resp.data.image = `https://ipfs.io/ipfs/${resp.data.image
        .split("ipfs://")
        .join("")}`;
      let isVideo = false;
      resp.data.attributes.forEach((element) => {
        if (element.trait_type === "Video") {
          isVideo = element.value;
        }
      });

      const itemData = await NFTcontract.tokenDatas(id);
      setItem({
        // ...resp.returnValues,
        data: resp.data,
        isVideo,
        creator: itemData.creator,
      });
      getOrders();
      setLoading(false);
      if (account && NFTcontract) {
        let own = await NFTcontract.balanceOf(account, id);
        setAmountOwn(own);
      }
    }
  };
  const transferItem = async (toAddress, id, amount) => {
    await NFTcontract.safeTransferFrom(account, toAddress, id, amount, "0x", {
      from: account,
    });
  };
  const getOrders = async () => {
    try {
      //   if (library) {
      //     let sellOrders = await contracts.marketplace.getPastEvents("Sell", {
      //       fromBlock: DEPLOY_BLOCK,
      //       toBlock: "latest",
      //     });
      //     let toOrder = [];
      //     let lowerPrice = 0;
      //     for (const element of sellOrders) {
      //       const order = element.returnValues;
      //       if (order.tokenId === id) {
      //         const details = await contracts.marketplace.methods
      //           .orders(order.orderId);
      //         if (details.active) {
      //           let x = {};
      //           x.orderId = details.orderId;
      //           x.seller = details.seller;
      //           x.amount = Number(details.amount);
      //           x.price = web3.utils.fromWei(String(details.price));
      //           if (lowerPrice === 0) lowerPrice = parseFloat(x.price);
      //           if (parseFloat(x.price) < lowerPrice)
      //             lowerPrice = parseFloat(x.price);
      //           toOrder.push(x);
      //         }
      //       }
      //     }
      //     setSellOffers(toOrder);
      //     setItemPrice(lowerPrice);
      //   }
    } catch (error) {
      console.log(`error`, error);
    }
  };
  const buy = async (order) => {
    if (account) {
      setLoadingBuy(true);
      console.log(order);
      let response = await MRKTcontract.buy(order.orderId, {
        from: account,
        value: order.price,
      });
      console.log(response);
      setLoadingBuy(false);
      getData();
    } else {
    }
  };
  const sell = async () => {
    try {
      if (account) {
        setLoadingSell(true);
        let approved = await NFTcontract.isApprovedForAll(
          account,
          marketplace_address
        );

        if (!approved) {
          await NFTcontract.setApprovalForAll(marketplace_address, true, {
            from: account,
          });
        }

        await MRKTcontract.sell(
          id,
          sellAmount,
          ethers.utils.parseUnits(String(sellPrice), "ether"),
          { from: account }
        );
        setSellPrice("");
        setLoadingSell(false);
        setShowModal(false);
        setSellAmount("");
        getData();
      }
    } catch (error) {
      console.log(`error`, error);
      Swal.fire("Unknown error", "", "error");
      setLoadingSell(false);
    }
  };

  const transfer = async () => {
    if (account) {
      setLoadingTransfer(true);
      let x = await transferItem(transferTo, id, transferAmount);
      console.log(x);
      setTransferTo("");
      setTransferAmount("");
      setLoadingTransfer(false);
      setShowModalTransfer(false);
    }
  };
  const itemOwner = async () => {
    if (account && NFTcontract) {
      let amount = await NFTcontract.balanceOf(account, id);
      setisOwnerAmount(parseInt(amount.toString()));
    }
  };

  const showOwnerContent = async () => {
    if (account && NFTcontract) {
      let content = await NFTcontract.getOwnerContent(id, {
        from: account,
      });
      return content;
    }
  };
  useEffect(() => {
    getData();
    showOwnerContent().then((data) => {
      setOwnerContent(data);
    });
    itemOwner().then((resp) => {
      setIsItemOwner(resp);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, NFTcontract]);

  return {
    id,
    buy,
    sell,
    setSellPrice,
    setShowModal,
    setShowModalTransfer,
    setTransferTo,
    setTransferAmount,
    transfer,
    showModalTransfer,
    transferTo,
    transferAmount,
    showModal,
    loadingBuy,
    loadingSell,
    loading,
    isItemOwner,
    item,
    sellOffers,
    sellPrice,
    loadingTransfer,
    itemPrice,
    metadata,
    ownerContent,
    amountOwn,
    setSellAmount,
    sellAmount,
    isOwnerAmount,
  };
};

export default ItemLogic;
