import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ThemeProvider } from "@mui/material/styles"; // Impor ThemeProvider
import CssBaseline from "@mui/material/CssBaseline"; // Impor CssBaseline
import theme from "./theme/theme.js"; // Impor tema Anda
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {" "}
      {/* Bungkus dengan ThemeProvider */}
      <CssBaseline /> {/* Reset CSS bawaan browser */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
