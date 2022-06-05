import React from "react";
import MyNFTs from "./MyNFTs";
import { Link } from "react-router-dom";
const Main = () => {
  return (
    <div className="home-page flex flex-col">
      <div className="home-sec flex aic">
        <div className="left flex flex-col  jc">
          <div className="meta flex flex-col">
            <div className="slugen1" style={{ fontWeight: "bold" }}>
              108 NFT colección GENIUS
            </div>
            <div className="slugen2">
              Acceso al Club de empresarios de Miquel Baixas
            </div>
          </div>
          <div className="actions flex aic">
            <Link
              to="/catalogo"
              className="btn button"
              style={{ fontFamily: "Sofia Pro Black" }}
            >
              Acceso a la colección
            </Link>
          </div>
        </div>
        <div className="rigth flex aic jc">
          <img
            src="./images/geniusNftGif.gif"
            style={{ maxWidth: "600px", objectFit: "contain" }}
            className="img"
          />
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
