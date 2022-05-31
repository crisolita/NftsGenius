import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import {
  marketplace_abi,
  marketplace_address,
  DEFAULT_ADMIN,
} from "../utils/constants";
import { Contract, ethers } from "ethers";
const CHAIN_ID_BSC = 56;
const CHAIN_ID_BSC_TESTNET = 97;
const injected = new InjectedConnector({
  supportedChainIds: [CHAIN_ID_BSC, CHAIN_ID_BSC_TESTNET],
});
// import { MenuIcon } from "../../assets";

const Header = ({ openSidebar, setOpenSidebar }) => {
  const { library, active, account, activate } = useWeb3React();
  const [MRKTcontract, setMRKTcontract] = useState();
  const [list, setList] = useState([
    { lbl: "Home", slug: "/" },
    { lbl: "Catalogo", slug: "/" },
    { lbl: "Secciones  ", slug: "/" },
  ]);
  const [isAdmin, setIsAdmin] = useState(false);
  async function handleConnect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }
  async function handleAdmin(account) {
    try {
      let thisAccount = await MRKTcontract.hasRole(DEFAULT_ADMIN, account);
      console.log(thisAccount);
      setIsAdmin(thisAccount);
      console.log(isAdmin);
    } catch (ex) {
      console.log(ex);
    }
  }
  useEffect(() => {
    if (library) {
      setMRKTcontract(
        new Contract(marketplace_address, marketplace_abi, library.getSigner())
      );
    }
    if (library && MRKTcontract && account) {
      handleAdmin(account);
    }
  }, [library, MRKTcontract, account]);

  return (
    <div className="header-camp flex">
      <div className="wrapWidth wrap flex aic">
        <div className="left flex aic">
          <Link to="/">
            <img src="./images/logo.svg" className="logo-img" />
          </Link>
        </div>
        <div className="right flex aic">
          <div className="items flex aic">
            {list.map((item, index) => (
              <div className="item" key={index}>
                {item.lbl}
              </div>
            ))}
          </div>
          <div
            className="manue-icon cursor-pointer"
            onClick={(e) => {
              setOpenSidebar(!openSidebar);
              e.stopPropagation();
            }}
          >
            {/* <MenuIcon /> */}
          </div>
        </div>
        <button className="btn button" margin-left="20px">
          <Link to="/MyNFTs">{"My NFTs"}</Link>
        </button>
        {isAdmin ? (
          <button className="btn button" margin-left="20px">
            <Link to="/CreateNFT">{"Crear NFT"}</Link>
          </button>
        ) : (
          <></>
        )}

        <div className="actions flex aic">
          <button
            className="btn button"
            margin-left="20px"
            onClick={handleConnect}
          >
            {active ? "Conectado" : "Conectar Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
