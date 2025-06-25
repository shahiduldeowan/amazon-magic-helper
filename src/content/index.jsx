import { StrictMode } from "react";
import ContentPage from "./ContentPage";
import { CREATED_ENTITY } from "../constants/selectors";
import "../index.css";
import "../initLogger";
import { DomUtils } from "../utils";

DomUtils.injectReactComponent(
  <StrictMode>
    <ContentPage />
  </StrictMode>,
  document.body,
  {
    id: CREATED_ENTITY.ROOT_ID,
  }
);
