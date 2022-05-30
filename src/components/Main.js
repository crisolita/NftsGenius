import React, { useState, useEffect } from "react";
import { SearchIcon, HeartIcon } from "../assets";
import MyNFTs from "./MyNFTs";
const Main = () => {
  const [nfts, setNfts] = useState([
    {
      img: "./images/user1.png",
      name: "Lorem ipsum dolor sit amet",
      price: "$ 5",
      slug: "",
    },
    {
      img: "./images/user1.png",
      name: "Lorem ipsum dolor sit amet",
      price: "$ 5",
      slug: "",
    },
    {
      img: "./images/user2.png",
      name: "Lorem ipsum dolor sit amet",
      price: "$ 5",
      slug: "",
    },
    {
      img: "./images/user1.png",
      name: "Lorem ipsum dolor sit amet",
      price: "$ 5",
      slug: "",
    },
    {
      img: "./images/user1.png",
      name: "Lorem ipsum dolor sit amet",
      price: "$ 5",
      slug: "",
    },
    {
      img: "./images/user2.png",
      name: "Lorem ipsum dolor sit amet",
      price: "$ 5",
      slug: "",
    },
  ]);
  return (
    <div className="home-page flex flex-col">
      <div className="home-sec flex aic">
        <div className="left flex flex-col  jc">
          <div className="meta flex flex-col">
            <div className="slugen1">DESCUBRE EL UNIVERSO</div>
            <div className="slugen2">DEL ARTE A TRAVÉS DE LOS NFTS</div>
          </div>
          <div className="actions flex aic">
            <div className="btn button">LOREM IPSUM</div>
            <div className="btn button">LOREM IPSUM</div>
          </div>
        </div>
        <div className="rigth flex aic jc">
          <img src="./images/home-bg.svg" className="img" />
        </div>
      </div>
      <div className="disco-nfts flex flex-col">
        <div className=" wrap flex flex-col">
          <div className="disco-tag flex jc">
            DESCUBRE <div className="lbl-b">NUESTROS NFTs</div>
          </div>
          <div className="sarch-tab flex align-center justify-end">
            <div className="search-box flex aic">
              <div className="icon">
                <SearchIcon />
              </div>
              <input
                type="text"
                className="txt cleanbtn"
                placeholder="Search"
              />
            </div>
          </div>
          <MyNFTs />
          {/* <div className="dico-block">
            {nfts.map((item, index) => (
              <div className="card flex flex-col">
                <div
                  className="img-blk flex"
                  style={{ backgroundImage: `url(${item.img})` }}
                >
                  <div className="likes flex justify-end">
                    <div className="ico">
                      <HeartIcon />
                    </div>
                    <div className="numb">40</div>
                  </div>
                </div>
                <div className="about-nft flex flex-col">
                  <div className="nft-name">{item.name}</div>
                  <div className="nft-price flex justify-between aic">
                    <div className="price-lbl">Price</div>
                    <div className="price-numb">{item.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Main;
