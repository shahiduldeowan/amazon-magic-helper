import { StrictMode } from "react";
import dom from "../lib/dom";
import ContentPage from "./ContentPage";
import { CREATED_ENTITY } from "../constants/selectors";
import "../index.css";

dom.injectReactComponent(
  <StrictMode>
    <ContentPage />
  </StrictMode>,
  document.body,
  {
    id: CREATED_ENTITY.ROOT_ID,
  }
);
