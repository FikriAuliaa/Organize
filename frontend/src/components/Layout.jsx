import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./landing/Footer";
import { Box } from "@mui/material";

const Layout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet /> {/* Ini merender halaman seperti HomePage */}
      </Box>
      <Footer /> {/* <-- 2. Tambahkan Footer di sini */}
    </Box>
  );
};

export default Layout;
