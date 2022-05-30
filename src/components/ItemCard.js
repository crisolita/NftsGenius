import React from "react";
import { Row, Col } from "react-bootstrap";
// import {Link} from "react-router-dom";
import "../index.css";

export default function ItemCard({ item, key }) {
  return (
    <>
      <div className="dashboard-item-card-picture">
        {item.isVideo ? (
          <iframe
            title="Video"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              width: "100%",
              height: "100%",
            }}
            src={item.data.image}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <img
            src={item.data.image}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              border: "1px solid lightgrey",
              objectFit: "contain",
            }}
          />
        )}
      </div>
      <Row className="dashboard-item-card-body m-0">
        <p
          className="p-0 m-0 mt-2"
          style={{
            color: "#212529",
            fontSize: "1rem",
            width: "100%",
            height: "20%",
          }}
        >
          <b>{item.data.name}</b>
        </p>
        <p
          className="p-0 m-0"
          style={{
            fontSize: "0.8rem",
            color: "#777",
            width: "100%",
            height: "40%",
          }}
        >
          {item.data.description}
        </p>
        <hr style={{ width: "100%", borderTop: "1px solid black" }} />
        <Col sm={12} className="m-0 p-0 mt-auto">
          <Row className="m-0 p-0">
            <Col sm={6} className="m-0 p-0 text-left">
              <p
                className="p-0 m-0"
                style={{ color: "#212529", fontSize: "0.8rem" }}
              >
                Amount: {item.amount}
              </p>
            </Col>
            <Col sm={6} className="m-0 p-0 text-right">
              <p
                className="p-0 m-0"
                style={{ color: "#00c84b", fontSize: "0.8rem" }}
              >
                {item.price} ETH
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
