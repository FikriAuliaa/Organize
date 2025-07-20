import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Toolbar>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 1,
              background: "linear-gradient(45deg, #0881b7 30%, #4fb0e0 90%)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              O
            </Typography>
          </Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Organize
          </Typography>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button component={RouterLink} to="/login" variant="outlined">
            Masuk
          </Button>
          <Button component={RouterLink} to="/register" variant="contained">
            Daftar Sekarang
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
