import { createRoot } from "react-dom/client";
import "./index.css";
import { StrictMode } from "react";
import ContentPage from "./content/ContentPage";
import { CREATED_SELECTORS } from "./constants/selectors";

const root = document.createElement("div");
root.id = CREATED_SELECTORS.ROOT;
document.body.append(root);

createRoot(root).render(
    <StrictMode>
        <ContentPage />
    </StrictMode>
);