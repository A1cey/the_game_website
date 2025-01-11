import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import { BrowserRouter } from "react-router-dom";
import "@/types/database.types.ts";
import "@/i18n.ts";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
