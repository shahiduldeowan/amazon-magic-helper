import { createRoot } from "react-dom/client";
import "./index.css";
import { StrictMode } from "react";
import ContentPage from "./content/ContentPage";

const root = document.createElement("div");
root.id = "__amazon-magic-helper-container";
document.body.append(root);

createRoot(root).render(
    <StrictMode>
        <ContentPage />
    </StrictMode>
);