import React from "react";
import { Box, Container, Typography, IconButton, Link } from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  Email,
  LocationOn,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "text.primary", color: "white" }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            gap: 4,
          }}
        >
          <Box>
            {" "}
            {/* Info Perusahaan */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Organize
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}
            >
              Platform terdepan untuk menemukan dan mengelola acara terbaik di
              Indonesia.
            </Typography>
            <Box>
              <IconButton sx={{ color: "white" }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: "white" }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: "white" }}>
                <Instagram />
              </IconButton>
            </Box>
          </Box>
          <Box>
            {" "}
            {/* Tautan Cepat */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Tautan Cepat
            </Typography>
            <Link
              component={RouterLink}
              to="/home"
              display="block"
              color="inherit"
              sx={{ mb: 1, textDecoration: "none" }}
            >
              Jelajahi Acara
            </Link>
            <Link
              component={RouterLink}
              to="/login"
              display="block"
              color="inherit"
              sx={{ mb: 1, textDecoration: "none" }}
            >
              Login
            </Link>
            <Link
              component={RouterLink}
              to="/register"
              display="block"
              color="inherit"
              sx={{ mb: 1, textDecoration: "none" }}
            >
              Register
            </Link>
          </Box>
          <Box>
            {" "}
            {/* Layanan */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Layanan
            </Typography>
            <Typography
              variant="body2"
              display="block"
              color="inherit"
              sx={{ mb: 1 }}
            >
              Manajemen Acara
            </Typography>
            <Typography
              variant="body2"
              display="block"
              color="inherit"
              sx={{ mb: 1 }}
            >
              Pendaftaran Online
            </Typography>
          </Box>
          <Box>
            {" "}
            {/* Kontak */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Kontak Kami
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Email />
              <Typography variant="body2">info@organize.id</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn />
              <Typography variant="body2">Jakarta, Indonesia</Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.2)",
            mt: 6,
            pt: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
            © 2025 Organize. Dibuat untuk Capstone Project.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
export default Footer;
