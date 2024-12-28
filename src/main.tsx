import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./types/database.types.ts";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>,
);
