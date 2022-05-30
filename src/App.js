/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./css/App.scss";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import { Route, Routes } from "react-router-dom";
import CreateNFT from "./components/CreateNFT";
import MyNFTs from "./components/MyNFTs";
import Item from "./components/Item";

function App() {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className="App">
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

      <Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/CreateNFT" element={<CreateNFT />} />
        <Route exact path="/MyNFTs" element={<MyNFTs />} />
        <Route exact path="/item/:id" element={<Item />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
