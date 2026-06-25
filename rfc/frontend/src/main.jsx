import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext"; // 👈 Ye import add karein

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider> {/* 👈 App ko is se wrap karein */}
      <App />
    </CartProvider>
  </React.StrictMode>
);
