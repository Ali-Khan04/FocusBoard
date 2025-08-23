import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./CSS/index.css";
import GlobalProvider from "./context/GlobalProvider.jsx";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <GlobalProvider>
    <App />
  </GlobalProvider>
);
