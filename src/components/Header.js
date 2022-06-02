import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import {
  marketplace_abi,
  marketplace_address,
  DEFAULT_ADMIN,
} from "../utils/constants";
// import { MenuIcon } from "../../assets";
import { Contract, ethers } from "ethers";
const CHAIN_ID_BSC = 56;
const CHAIN_ID_BSC_TESTNET = 97;
const injected = new InjectedConnector({
  supportedChainIds: [CHAIN_ID_BSC, CHAIN_ID_BSC_TESTNET],
});

const Header = ({ openSidebar, setOpenSidebar }) => {
  const { library, active, deactivate, activate, account } = useWeb3React();
  const [MRKTcontract, setMRKTcontract] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  async function handleConnect() {
    try {
      await activate(injected);
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
  }, [library]);
  useEffect(() => {
    if (MRKTcontract && account) {
      handleAdmin(account);
    }
  }, [MRKTcontract, account]);
  const handleAdmin = async (account) => {
    try {
      let thisAccount = await MRKTcontract.hasRole(DEFAULT_ADMIN, account);
      setIsAdmin(thisAccount);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div className="header-camp flex">
      <div className="wrapWidth wrap flex aic">
        <div className="left flex aic">
          <Link to="/">
            <img src="/images/logo.svg" className="logo-img" />
          </Link>
        </div>
        <div className="right flex aic">
          <div className="items flex aic">
            <Link className="item" to="/">
              Home
            </Link>
            <Link className="item" to="/catalogo">
              Catalogo
            </Link>
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
        {isAdmin && (
          <>
            <button className="btn button" margin-left="20px">
              <Link to="/CreateNFT">Crear NFT</Link>
            </button>
          </>
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
