import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { Row, Spinner, Modal, Form } from "react-bootstrap";
import "../css/Item.css";
import { client, GET_SALES } from "../querys/subgraph";

// COMPONENTS
import ItemLogic from "./ItemLogic";
const Item = () => {
  const [isNftBuyable, setisNftBuyable] = useState(false);
  const {
    id,
    buy,
    sell,
    setSellAmount,
    setSellPrice,
    setShowModal,
    setShowModalTransfer,
    setTransferTo,
    setTransferAmount,
    showModalTransfer,
    transfer,
    transferTo,
    transferAmount,
    isItemOwner,
    showModal,
    loadingBuy,
    loadingSell,
    loading,
    item,
    sellOffers,
    sellPrice,
    sellAmount,
    loadingTransfer,
    itemPrice,
    isOwnerAmount,
    // ownerContent,
    // amountOwn
  } = ItemLogic();

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    isBuyableNftHandler();
  }, []);

  const isBuyableNftHandler = async () => {
    const { sales } = await client.request(GET_SALES());
    sales.map((o) => {
      if (parseInt(o.tokenID) === parseInt(id)) return setisNftBuyable(o);
    });
  };
  const BuyToken = () => {
    buy({
      orderId: isNftBuyable.id,
      price: isNftBuyable.price,
    });
  };

  return (
    <div className="container-app">
      <Row
        className="m-0 p-0 main-section"
        style={{ backgroundColor: "#f0f0f0" }}
      >
        {loading ? (
          <Row className="item-container" style={{ minHeight: "70vh" }}>
            <div className="p-4 m-auto">
              <Spinner
                animation="grow"
                variant="success"
                style={{ marginRight: "0.5rem" }}
              />
            </div>
          </Row>
        ) : (
          <div className="nft-detail-container">
            <div className="nft-detail-img">
              {item.isVideo ? (
                <iframe
                  title="Video"
                  src={item?.data?.image}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={item?.data?.image}
                  loading="lazy"
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <div className="nft-detail-info">
              <div className="nft-detail-info-name">{item.data.name}</div>
              <div className="nft-detail-info-creator">
                <div className="nft-detail-info-creator-title">
                  creado por :
                </div>
                <a
                  href={`https://etherscan.io/address/${item?.creator}`}
                  target="_blank"
                  rel="noreferrer"
                  className="nft-detail-info-creator-title-address"
                >
                  {item?.creator.substring(0, 6) +
                    "..." +
                    item?.creator.substring(38, 42)}
                </a>
              </div>
              <div className="nft-detail-info-divider" />
              <div className="nft-detail-info-creator">
                <div className="nft-detail-info-creator-title">
                  Precio Actual
                </div>
                {itemPrice} BNB
              </div>
              <div className="nft-detail-info-divider" />
              <div className="nft-detail-info-description">
                {item?.data?.description.split("Metadata JSON:")[0]}
              </div>
              <div className="nft-detail-info-divider" />

              <div className="nft-detail-info-creator">
                <div className="nft-detail-info-creator-title">Categoria</div>
                {item.data?.attributes[0]?.category}
              </div>
              <div className="nft-detail-info-creator">
                <div className="nft-detail-info-creator-title">Monto</div>
                {item.data?.attributes[1]?.amount}
              </div>
              <div className="nft-detail-info-creator">
                <div className="nft-detail-info-creator-title">Royalty</div>
                {item.data?.attributes[2]?.royalty}
              </div>
              <div className="nft-detail-info-creator">
                <div className="nft-detail-info-creator-title">URL externo</div>
                {item.data?.attributes[3]?.externalUrl}
              </div>

              {/* <div className="nft-detail-info-divider" /> */}
              {console.log(isNftBuyable)}
              {!!isNftBuyable && (
                <>
                  <div className="nft-detail-info-stats">
                    <div className="nft-detail-info-stats-option">
                      <div className="nft-detail-info-stats-option-title">
                        {isNftBuyable.amount}
                      </div>
                      <div className="nft-detail-info-stats-option-value">
                        Cantidad
                      </div>
                    </div>
                    <div className="nft-detail-info-stats-option">
                      <div className="nft-detail-info-stats-option-title">
                        {isNftBuyable.price / 1_000_000_000_000_000_000} BNB
                      </div>
                      <div className="nft-detail-info-stats-option-value">
                        Precio Total
                      </div>
                    </div>
                  </div>
                </>
              )}

              {isOwnerAmount > 0 ? (
                <div className="nft-detail-info-container-button-double">
                  <button
                    disabled={loadingTransfer}
                    type="button"
                    onClick={() => setShowModalTransfer(true)}
                    className="nft-detail-info-button"
                  >
                    Transferir
                  </button>
                  <button
                    disabled={loadingBuy}
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="nft-detail-info-button"
                  >
                    Vender
                  </button>
                </div>
              ) : (
                <div className="nft-detail-info-container-button">
                  {!!isNftBuyable && (
                    <button
                      disabled={loadingBuy}
                      onClick={() => BuyToken()}
                      type="button"
                      className="nft-detail-info-button"
                    >
                      {loadingBuy ? (
                        <Spinner animation="grow" variant="success" />
                      ) : (
                        "Comprar"
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="sm"
        centered
      >
        <Modal.Body>
          <Row style={{ height: "50px" }}>
            <div
              onClick={() => setShowModal(false)}
              style={{
                fontSize: "1.6rem",
                cursor: "pointer",
                marginLeft: "auto",
                marginRight: "1rem",
              }}
            >
              <i className="far fa-times-circle"></i>
            </div>
          </Row>
          <Form.Group>
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => setSellPrice(e.target.value)}
              style={{ backgroundColor: "#F8F9FA" }}
              value={sellPrice}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => setSellAmount(e.target.value)}
              style={{ backgroundColor: "#F8F9FA" }}
              value={sellAmount}
            />
          </Form.Group>
          <div className="text-center">
            <button
              className="platform-button mx-2"
              onClick={() => sell()}
              disabled={loadingSell}
              style={{
                backgroundColor: "#00c84b",
                color: "white",
                border: "none",
              }}
            >
              {loadingSell ? (
                <Spinner size="sm" animation="grow" variant="light" />
              ) : (
                "Sell"
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModalTransfer}
        onHide={() => setShowModalTransfer(false)}
        size="sm"
        centered
      >
        <Modal.Body>
          <Row style={{ height: "50px" }}>
            <div
              onClick={() => setShowModalTransfer(false)}
              style={{
                fontSize: "1.6rem",
                cursor: "pointer",
                marginLeft: "auto",
                marginRight: "1rem",
              }}
            >
              <i className="far fa-times-circle"></i>
            </div>
          </Row>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setTransferTo(e.target.value)}
              style={{ backgroundColor: "#F8F9FA" }}
              value={transferTo}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => setTransferAmount(e.target.value)}
              style={{ backgroundColor: "#F8F9FA" }}
              value={transferAmount}
            />
          </Form.Group>
          <div className="text-center">
            <button
              className="platform-button mx-2"
              onClick={transfer}
              disabled={loadingTransfer}
              style={{
                backgroundColor: "#00c84b",
                color: "white",
                border: "none",
              }}
            >
              {loadingTransfer ? (
                <Spinner size="sm" animation="grow" variant="light" />
              ) : (
                "Transfer"
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Item;
