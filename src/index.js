import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { createRoot } from "react-dom/client";

import App from "./App";
function getLibrary(provider) {
  return new Web3Provider(provider);
}
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Web3ReactProvider>
);
