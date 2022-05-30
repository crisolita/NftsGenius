import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import { Row, Col, Spinner, Button, Modal, Form } from "react-bootstrap";
import "../css/Item.css";

// COMPONENTS
import ItemLogic from "./ItemLogic";
const Item = () => {
  const { account, library, active } = useWeb3React();
  const {
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
          <Row
            className="item-container my-4"
            style={{ minHeight: "60vh", justifyContent: "space-around" }}
          >
            <Col sm={12} md={4} className="item-card p-0">
              <div className="mx-auto item-card-photo">
                {item.isVideo ? (
                  <div style={{ borderRadius: "12px", minHeight: "40vh" }}>
                    <iframe
                      title="Video"
                      style={{
                        maxWidth: "100%",
                        width: "100%",
                        height: "40vh",
                        borderTopRightRadius: "12px",
                        borderTopLeftRadius: "12px",
                      }}
                      src={item?.data?.image}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div style={{ borderRadius: "12px" }}>
                    <img
                      src={item?.data?.image}
                      alt=""
                      style={{
                        borderTopRightRadius: "12px",
                        borderTopLeftRadius: "12px",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="px-4 py-2">
                  <p style={{ fontSize: "0.8rem" }}>
                    Creado por:
                    <a
                      href={`https://etherscan.io/address/${item?.creator}`}
                      target="_blank"
                      className="account-link ml-2"
                      rel="noreferrer"
                    >
                      {item?.creator.substring(0, 6) +
                        "..." +
                        item?.creator.substring(38, 42)}
                    </a>
                  </p>
                  {/* <p><b>Descripción</b></p>
                  <p style={{fontSize: '0.8rem'}}>{item?.data?.description.split("Metadata JSON:")[0]}</p> */}
                  <p>
                    <b>Detalles</b>
                  </p>
                  {item?.data?.attributes?.map(
                    (element, key) =>
                      element.trait_type !== "Video" && (
                        <Row
                          key={key}
                          style={{
                            justifyContent: "space-between",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            fontSize: "0.8rem",
                            marginBottom: "5px",
                          }}
                        >
                          <span>{element.trait_type}:</span>
                          <span>{element.value}</span>
                        </Row>
                      )
                  )}
                </div>
                <hr style={{}} />
                <div className="px-4">
                  <p>
                    <b>Extra Info</b>
                  </p>
                  <p style={{ fontSize: "0.8rem" }}>
                    <a
                      href={item?.data?.description.split("Metadata JSON:")[1]}
                      target="_blank"
                      className="account-link ml-2"
                      rel="noreferrer"
                    >
                      Click Here
                    </a>
                  </p>
                </div>
              </div>
            </Col>
            <Col sm={12} md={7}>
              <Row>
                <Col sm={12} className="item-card p-3">
                  <div className="p-3">
                    <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                      {item?.data?.name}
                    </p>
                    <p style={{ fontSize: "1rem", color: "grey" }}>
                      {item?.data?.description.split("Metadata JSON:")[0]}
                    </p>
                  </div>
                  <hr />
                  <Row
                    className="p-3 m-0"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div style={{ width: "fit-content" }}>
                      <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        Precio actual
                      </p>
                      <p style={{ fontSize: "1.2rem", color: "#00c84b" }}>
                        {itemPrice} ETH
                      </p>
                    </div>
                    {isItemOwner && (
                      <div
                        className="super-center"
                        style={{ width: "fit-content" }}
                      >
                        <button
                          className="item-button mx-2"
                          onClick={() => setShowModal(true)}
                          disabled={loadingSell}
                        >
                          {loadingSell ? (
                            <Spinner
                              size="sm"
                              animation="grow"
                              variant="light"
                            />
                          ) : (
                            "Vender"
                          )}
                        </button>
                        <button
                          className="item-button mx-2"
                          onClick={() => setShowModalTransfer(true)}
                          disabled={loadingSell}
                        >
                          {loadingSell ? (
                            <Spinner
                              size="sm"
                              animation="grow"
                              variant="light"
                            />
                          ) : (
                            "Transferir"
                          )}
                        </button>
                      </div>
                    )}
                  </Row>
                </Col>
                <Col sm={12} className="item-card p-3">
                  <div className="p-3">
                    <p
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        marginBottom: 0,
                      }}
                    >
                      Ofertas
                    </p>
                  </div>
                  {/* <hr /> */}
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ textAlign: "center" }} scope="col">
                            Precio unitario
                          </th>
                          <th style={{ textAlign: "center" }} scope="col">
                            Cantidad
                          </th>
                          <th style={{ textAlign: "center" }} scope="col">
                            Precio Total
                          </th>
                          <th style={{ textAlign: "center" }} scope="col">
                            Usuario
                          </th>
                          <th style={{ textAlign: "center" }} scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellOffers?.map((element, key) => (
                          <tr key={key}>
                            <td style={{ textAlign: "center" }}>
                              {parseFloat(
                                (element.price / element.amount).toFixed(3)
                              )}{" "}
                              ETH
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {element.amount}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {element.price} ETH
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <a
                                href={`https://etherscan.io/address/${element.seller}`}
                                target="_blank"
                                className="account-link ml-2"
                                rel="noreferrer"
                              >
                                {element.seller.substring(0, 4) +
                                  "..." +
                                  element.seller.substring(40, 42)}
                              </a>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {(!account ||
                                element.seller.toLowerCase() !==
                                  account.toLowerCase()) && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => buy(element)}
                                  disabled={loadingBuy}
                                  style={{ borderRadius: "20px" }}
                                >
                                  {loadingBuy ? (
                                    <Spinner
                                      size="sm"
                                      animation="grow"
                                      variant="light"
                                    />
                                  ) : (
                                    "Comprar"
                                  )}
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
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
