import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Spinner, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Contract } from "ethers";

import Dropzone from "react-dropzone";
import { categorias, NFT1155_abi, NFT1155_address } from "../utils/constants";
import ipfs from "../utils/ipfs";

// COMPONENTS

const CreateNFT = () => {
  const { account, library } = useWeb3React();
  const [NFTcontract, setNFTcontract] = useState();
  useEffect(() => {
    if (library) {
      setNFTcontract(
        new Contract(NFT1155_address, NFT1155_abi, library.getSigner())
      );
    }
  }, [library]);

  // Component State
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [tokenAmount, setTokenAmount] = useState(1);
  const [isVideo, setIsVideo] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categorias[0]);
  const [royalty, setRoyalty] = useState("");
  const [ownerContent, setOwnerContent] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [attributes, setAttributes] = useState([{ type: "", value: "" }]);
  const [changing, setChanging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [error, setError] = useState("");

  // Load File and convert to Buffer
  const loadFile = (_file) => {
    if (_file.size > 100000000) {
      Swal.fire("File size is bigger than 100MB", "", "error");
      return;
    }
    let ext = _file.name.split(".");
    ext = ext[ext.length - 1];
    if (
      ext !== "jpg" &&
      ext !== "JPG" &&
      ext !== "jpeg" &&
      ext !== "JPEG" &&
      ext !== "png" &&
      ext !== "PNG" &&
      ext !== "mp4" &&
      ext !== "MP4"
    ) {
      Swal.fire("Invalid file type", "", "error");
      return;
    }
    if (ext === "mp4" || ext === "MP4") setIsVideo(true);
    else setIsVideo(false);
    setFileName(URL.createObjectURL(_file));
    var reader = new FileReader();
    reader.readAsArrayBuffer(_file);
    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };
  };

  const onDropDoc = (files) => {
    if (files.length === 1) {
      if (files[0].size > 100000000) {
        Swal.fire("File size is bigger than 100MB", "", "error");
        return;
      }
      let ext = files[0].name.split(".");
      ext = ext[ext.length - 1];
      if (
        ext !== "jpg" &&
        ext !== "JPG" &&
        ext !== "jpeg" &&
        ext !== "JPEG" &&
        ext !== "png" &&
        ext !== "PNG" &&
        ext !== "mp4" &&
        ext !== "MP4"
      ) {
        Swal.fire("Invalid file type", "", "error");
        return;
      }
      if (ext === "mp4" || ext === "MP4") setIsVideo(true);
      else setIsVideo(false);
      setFileName(URL.createObjectURL(files[0]));
      var reader = new FileReader();
      reader.readAsArrayBuffer(files[0]);
      reader.onloadend = () => {
        setFile(Buffer(reader.result));
      };
    }
  };

  // Add content to IPFS and return HASH
  const addToIpfs = async (content) => {
    console.log("adding to IPFS...");
    const added = await ipfs.add(content, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    return added.cid.toString();
  };

  const checkMint = () => {
    if (
      !file ||
      tokenAmount === "" ||
      royalty === "" ||
      externalUrl === "" ||
      name === "" ||
      description === "" ||
      category === ""
    ) {
      if (tokenAmount === 0) setError("Token amount is empty");
      if (!file) setError("No file uploaded");
      if (name === "") setError("Title is empty");
      if (description === "") setError("Description is empty");
      if (category === "") setError("Category is empty");
      if (royalty === "") setError("Royalty is empty");
      if (externalUrl === "") setError("External Url is empty");
      setShowModalError(true);
      Swal.fire("Empty field", "", "error");
      return;
    } else {
      let error = false;
      for (const element of attributes) {
        if (element.type === "" || element.value === "") {
          if (element.type === "") setError("Property type is empty");
          if (element.value === "") setError("Property value is empty");

          setShowModalError(true);
          // Swal.fire(
          //   'Empty property',
          //   '',
          //   'error'
          // )
          error = true;
          return;
        }
      }
      if (!error) setShowModal(true);
    }
  };

  // Request Loan to Blockchain Smart Contract
  const createToken = async () => {
    if (account) {
      setLoading(true);
      const ipfsHash = await addToIpfs(file);
      let loadAttributes = [];
      loadAttributes.push({
        trait_type: "Category",
        value: category,
      });
      loadAttributes.push({
        trait_type: "Token amount",
        value: tokenAmount,
      });
      loadAttributes.push({
        trait_type: "Video",
        value: isVideo,
      });
      loadAttributes.push({
        trait_type: "Royalty %",
        value: royalty,
      });
      loadAttributes.push({
        trait_type: "External URL",
        value: externalUrl,
      });

      for (const element of attributes) {
        if (element.type !== "" && element.value !== "") {
          loadAttributes.push({
            trait_type: element.type,
            value: element.value,
          });
        } else {
          setShowModalError(true);
          Swal.fire("Empty property", "", "error");
          return;
        }
      }

      let schema = {
        name,
        description,
        image: "ipfs://" + ipfsHash,
        attributes: loadAttributes,
      };
      let schemaHash = await addToIpfs(JSON.stringify(schema));
      schema.description += `
      \n
      Metadata JSON: 
      https://ipfs.io/ipfs/${schemaHash}
      `;
      schemaHash = await addToIpfs(JSON.stringify(schema));

      // Trigger Tx to smart contract
      try {
        setOwnerContent(account);

        await NFTcontract.mintNew(
          tokenAmount,
          royalty,
          ownerContent,
          schemaHash
        );
        // const idCreated = await mintToken(tokenAmount, royalty, ownerContent, schemaHash);
        // setSuccessUrl(`https://${CURRENT_NETWORK!=="Mainnet"?"testnets.":''}opensea.io/assets/${CONTRACT_ADDRESS}/${idCreated}`);

        setLoading(false);
        setShowModalSuccess(true);
      } catch (error) {
        console.log(error);
        setLoading(false);
        if (
          error.message ===
          "MetaMask Tx Signature: User denied transaction signature."
        ) {
          setShowModalError(true);
        } else {
          setShowModalError(true);
        }
      }
    } else {
      setShowModalError(true);
    }
  };

  const addNew = () => {
    setChanging(true);
    let x = attributes;
    x.push({ type: "", value: "" });
    setAttributes(x);
  };

  const deleteProp = (index) => {
    setChanging(true);
    let x = attributes;
    x.splice(index, 1);
    setAttributes(x);
  };

  const setNewAttribute = (e, index) => {
    let x = attributes;
    x[index][e.target.name] = e.target.value;
    setAttributes(x);
  };

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

  return (
    <div className="container-app">
      <Row
        className="m-0 p-0 main-section"
        style={{ overflow: "auto", minHeight: "92vh" }}
      >
        <Col sm={6} className="super-center">
          <Col sm={11} className="ml-auto create-cards">
            <Row className="m-0 p-0 h-100">
              <Col
                sm={10}
                className="mx-auto h-100 p-0"
                style={{
                  backgroundColor: "#F8F9FA",
                  border: "1px solid grey",
                  borderRadius: "4px",
                }}
              >
                <Dropzone onDrop={(acceptedFiles) => onDropDoc(acceptedFiles)}>
                  {({ getRootProps, getInputProps }) => (
                    <Row
                      className="super-center"
                      style={{
                        height: "60%",
                        width: "90%",
                        margin: "5%",
                        backgroundColor: "white",
                        border: "1px dashed grey",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      {!file && (
                        <>
                          {/* <Col sm={12} className="super-center mt-auto">
                            <img
                              src={upload}
                              alt=""
                              style={{ width: "30%", height: "30%" }}
                            />
                          </Col> */}
                          <Col sm={12} className="super-center">
                            {window.innerWidth < 768
                              ? "Touch for upload file"
                              : "Drag & Drop your file"}
                          </Col>
                        </>
                      )}
                      {fileName &&
                        (isVideo ? (
                          <iframe
                            title="video"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            src={fileName}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          // <label htmlFor="file" className="mb-5">
                          //   <strong>File Uploaded: </strong>
                          //   {fileName}
                          // </label>
                          <img
                            src={fileName}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ))}
                    </Row>
                  )}
                </Dropzone>
                <p
                  className="m-auto text-center mb-0"
                  style={{ fontSize: "0.9rem", width: "90%" }}
                >
                  JPG, PNG, or MP4 videos accepted. 100MB limit
                </p>
                <div
                  className="super-center"
                  style={{ height: "25%", width: "90%", margin: "5%" }}
                >
                  <div id="upload-container">
                    <div id="fileUpload">
                      <input
                        id="file"
                        type="file"
                        name="file"
                        className="inputfile"
                        onChange={(e) => loadFile(e.target.files[0])}
                      />
                      <label htmlFor="file" id="fileLabel">
                        <p>Upload your file</p>
                      </label>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Col>
        <Col sm={6} className="">
          <Col sm={11} className="mr-auto">
            <Form className="my-5">
              {/* Token Name */}
              <Form.Group as={Row}>
                <Form.Label column sm="12">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      lineHeight: "1.5",
                    }}
                  >
                    Title
                  </span>
                </Form.Label>
                <Col sm="12" className="align-self-center">
                  <Form.Control
                    type="text"
                    style={{
                      backgroundColor: "#F8F9FA",
                      height: "48px",
                      borderRadius: "4px",
                    }}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Col>
              </Form.Group>

              {/* Token Description */}
              <Form.Group as={Row}>
                <Form.Label column sm="12">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      lineHeight: "1.5",
                    }}
                  >
                    Description
                  </span>
                </Form.Label>
                <Col sm="12" className="align-self-center">
                  <textarea
                    className="form-control"
                    style={{ height: "180px", backgroundColor: "#F8F9FA" }}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </Col>
              </Form.Group>

              {/* Category */}
              <Form.Group as={Row}>
                <Form.Label column sm="12">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      lineHeight: "1.5",
                    }}
                  >
                    Category
                  </span>
                </Form.Label>
                <Col sm="12" className="align-self-center">
                  <select
                    className="form-control"
                    style={{
                      backgroundColor: "#F8F9FA",
                      height: "48px",
                      borderRadius: "4px",
                    }}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categorias?.map((cat, index) => (
                      <option key={index}>{cat}</option>
                    ))}
                  </select>
                </Col>
              </Form.Group>

              {/* Royalty */}
              <Form.Group as={Row}>
                <Form.Label column sm="12">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      lineHeight: "1.5",
                    }}
                  >
                    Royalty %
                  </span>
                </Form.Label>
                <Col sm="12" className="align-self-center">
                  <Form.Control
                    type="number"
                    style={{
                      backgroundColor: "#F8F9FA",
                      height: "48px",
                      borderRadius: "4px",
                    }}
                    onChange={(e) => setRoyalty(e.target.value)}
                  />
                </Col>
              </Form.Group>

              {/* Token Amount */}
              <Form.Group as={Row}>
                <Form.Label column sm="12">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      lineHeight: "1.5",
                    }}
                  >
                    External URL
                  </span>
                </Form.Label>
                <Col sm="12" className="align-self-center">
                  <Form.Control
                    type="text"
                    style={{
                      backgroundColor: "#F8F9FA",
                      height: "48px",
                      borderRadius: "4px",
                    }}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                </Col>
              </Form.Group>

              {/* Owner Content */}
              {/* <Form.Group as={Row}>
                <Form.Label column sm="12">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      lineHeight: "1.5",
                    }}
                  >
                    Owner Content
                  </span>
                </Form.Label>
                <Col sm="12" className="align-self-center">
                  <Form.Control
                    type="text"
                    style={{
                      backgroundColor: "#F8F9FA",
                      height: "48px",
                      borderRadius: "4px",
                    }}
                    onChange={(e) => setOwnerContent(e.target.value)}
                  />
                </Col>
              </Form.Group> */}

              <Form.Group as={Row} className="mb-0">
                <Form.Label
                  column
                  sm="12"
                  style={{ justifyContent: "space-between", display: "flex" }}
                >
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      lineHeight: "1.5",
                    }}
                  >
                    Properties
                  </span>
                  <span
                    style={{
                      fontSize: "1rem",
                      lineHeight: "1.5",
                      cursor: "pointer",
                    }}
                    onClick={addNew}
                  >
                    +add new
                  </span>
                </Form.Label>
              </Form.Group>
              {!changing &&
                attributes.map((element, index) => (
                  <Form.Group as={Row} key={`attri${index}`}>
                    <Form.Label column sm="5" style={{ width: "45%" }}>
                      <Form.Control
                        type="text"
                        name="type"
                        placeholder="Property"
                        style={{
                          backgroundColor: "#F8F9FA",
                          height: "48px",
                          borderRadius: "4px",
                        }}
                        defaultValue={element.type}
                        onChange={(e) => setNewAttribute(e, index)}
                      />
                    </Form.Label>
                    <Col
                      sm="5"
                      className="align-self-center"
                      style={{ width: "45%" }}
                    >
                      <Form.Control
                        type="text"
                        name="value"
                        placeholder="Value"
                        style={{
                          backgroundColor: "#F8F9FA",
                          height: "48px",
                          borderRadius: "4px",
                        }}
                        defaultValue={element.value}
                        onChange={(e) => setNewAttribute(e, index)}
                      />
                    </Col>
                    {index !== 0 && (
                      <Col
                        sm={2}
                        className="super-center"
                        style={{ width: "10%" }}
                      >
                        <i
                          className="far fa-trash-alt"
                          onClick={() => deleteProp(index)}
                          style={{ fontSize: "1.2rem", cursor: "pointer" }}
                        ></i>
                      </Col>
                    )}
                  </Form.Group>
                ))}

              {/* Token Amount */}
              <Form.Group as={Row}>
                <Form.Label column sm="12">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      lineHeight: "1.5",
                    }}
                  >
                    Quantity
                  </span>
                </Form.Label>
                <div className="create-quantity-left">
                  <div
                    className="super-center ml-auto"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "100px",
                      backgroundColor: "#212529",
                      color: "white",
                      fontSize: "2rem",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setTokenAmount(tokenAmount - 1 >= 0 ? tokenAmount - 1 : 0)
                    }
                  >
                    -
                  </div>
                </div>
                <div className="create-quantity-center">
                  <Form.Control
                    type="number"
                    min="0"
                    style={{
                      border: "none",
                      textAlign: "center",
                      fontSize: "40px",
                      height: "48px",
                      borderRadius: "4px",
                      fontWeight: 700,
                    }}
                    value={tokenAmount}
                    onChange={(e) =>
                      setTokenAmount(
                        parseInt(e.target.value.split("-").join(""))
                      )
                    }
                  />
                </div>
                <div className="create-quantity-right">
                  <div
                    className="super-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "100px",
                      backgroundColor: "#212529",
                      color: "white",
                      fontSize: "2rem",
                      cursor: "pointer",
                    }}
                    onClick={() => setTokenAmount(tokenAmount + 1)}
                  >
                    +
                  </div>
                </div>
              </Form.Group>
            </Form>
          </Col>
        </Col>
        <Col sm={12} className="p-0 mt-auto" style={{ height: "fit-content" }}>
          {/* <div className="m-0 super-center footer" style={{position: 'absolute', top: '95vh', width: '100%'}}> */}
          <div className="m-0 super-center footer">
            <button
              className="platform-button-green mx-5"
              onClick={checkMint}
              style={{ zIndex: 10 }}
            >
              {loading ? (
                <>
                  <Spinner
                    animation="grow"
                    variant="light"
                    size="sm"
                    style={{ marginRight: "0.5rem" }}
                  />
                  Creating...
                </>
              ) : (
                "Mint your NFT"
              )}
            </button>
          </div>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="md"
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
          <Row style={{ width: "90%", margin: "0px 5%" }}>
            <p style={{ fontSize: "0.9rem", textAlign: "center" }}>
              Once your NFT is minted on the Ethereum mainnet blockchain, you
              will not be able to edit or update any of its information.
            </p>
            <p style={{ fontSize: "0.9rem", textAlign: "center" }}>
              Confirm the information provided for the NFT is the final one.
            </p>
          </Row>
          <Row style={{ width: "90%", margin: "10px 5%" }}>
            <button
              className="platform-button mx-auto"
              onClick={createToken}
              disabled={loading}
              style={{ backgroundColor: "#35FFD4", border: "none" }}
            >
              {loading ? (
                <Spinner size="sm" animation="grow" variant="dark" />
              ) : (
                "Yes, Mint!"
              )}
            </button>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        size="md"
        centered
      >
        <Modal.Body>
          {/* <Row style={{ height: "100px" }}>
             <img
              alt=""
              style={{ margin: "auto", width: "40px", height: "40px" }}
            /> 
          </Row>  */}
          <Row style={{ width: "90%", margin: "0px 5%" }}>
            <p
              style={{ fontSize: "2.5rem", textAlign: "center", width: "100%" }}
            >
              NFT Created
            </p>
          </Row>
          <Row style={{ width: "90%", margin: "20px 5%" }}>
            <Link to="/" className="mx-auto">
              <button
                className="platform-button mx-auto"
                style={{ backgroundColor: "#35FFD4", border: "none" }}
              >
                Ok
              </button>
            </Link>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModalError}
        onHide={() => setShowModalError(false)}
        size="md"
        centered
      >
        <Modal.Body>
          {/* <Row style={{ height: "100px" }}>
             <img
              alt=""
              style={{ margin: "auto", width: "40px", height: "40px" }}
            /> 
          </Row> */}
          <Row style={{ width: "90%", margin: "0px 5%" }}>
            <p style={{ fontSize: "2rem", textAlign: "center", width: "100%" }}>
              Error
            </p>
            {error !== "" ? (
              <p
                style={{ fontSize: "1rem", textAlign: "center", width: "100%" }}
              >
                {error}
              </p>
            ) : (
              <p
                style={{ fontSize: "1rem", textAlign: "center", width: "100%" }}
              >
                There was a problem creating your NFT
              </p>
            )}
          </Row>
          <Row style={{ width: "90%", margin: "10px 5%" }}>
            <button
              className="platform-button mx-auto"
              onClick={() => setShowModalError(false)}
              style={{ backgroundColor: "#35FFD4", border: "none" }}
            >
              Ok
            </button>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateNFT;
