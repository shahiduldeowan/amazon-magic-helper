import { StrictMode } from "react";
import "./index.css";
import "./initLogger.js";
import App from "./App.jsx";
import { DomUtils } from "./utils/domUtils.js";

DomUtils.injectReactComponent(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root"),
  {
    isRoot: true,
  }
);
