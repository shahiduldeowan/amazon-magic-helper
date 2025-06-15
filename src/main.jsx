import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import dom from "./lib/dom.js";

dom.injectReactComponent(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root"),
  {
    isRoot: true,
  }
);
