import React from "react";
import MyNFTs from "./MyNFTs";
import { Link } from "react-router-dom";
const Main = () => {
  return (
    <div className="home-page flex flex-col">
      <div className="home-sec flex aic">
        <div className="left flex flex-col  jc">
          <div className="meta flex flex-col">
            <div className="slugen1">Descubre GENIUS </div>
            <div className="slugen2">
              la colección de 108 NFT que te da acceso al Club de empresarios de
              Miquel Baixas
            </div>
          </div>
          <div className="actions flex aic">
            <Link to="/catalogo" className="btn button">
              Acceso a la colección
            </Link>
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

          <MyNFTs />
        </div>
      </div>
    </div>
  );
};

export default Main;
