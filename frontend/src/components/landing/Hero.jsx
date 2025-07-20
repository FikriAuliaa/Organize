import React from "react";
import { Box, Container, Typography, Button, keyframes } from "@mui/material";
import {
  ArrowForward,
  CalendarToday,
  Group,
  VerifiedUser,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

// Keyframes untuk animasi
const fadeInUp = keyframes`0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); }`;
const float = keyframes`0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); }`;

const heroImageUrl =
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1920&q=80";

// Komponen Statistik terpisah agar lebih rapi
const Stats = () => (
  <Box
    sx={{
      position: "absolute",
      bottom: { xs: 20, md: 40 },
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 32px)",
      maxWidth: "800px",
      bgcolor: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      borderRadius: 3,
      p: { xs: 2, sm: 3 },
      zIndex: 10,
      display: "flex",
      justifyContent: "space-around",
      animation: `${fadeInUp} 1s ease-out 0.5s backwards`,
    }}
  >
    {[
      { icon: <CalendarToday />, value: "500+", label: "Acara Tersedia" },
      { icon: <Group />, value: "10K+", label: "Peserta Aktif" },
      { icon: <VerifiedUser />, value: "100+", label: "Organizer Terpercaya" },
    ].map((stat, index) => (
      <Box key={index} sx={{ textAlign: "center", color: "white" }}>
        {stat.icon}
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {stat.value}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {stat.label}
        </Typography>
      </Box>
    ))}
  </Box>
);

const Hero = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundImage: `url(${heroImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(4, 28, 50, 0.8) 0%, rgba(4, 41, 64, 0.7) 100%)",
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          color: "white",
          animation: `${fadeInUp} 0.8s ease-out`,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: "3rem", md: "5rem" },
            fontWeight: 800,
            mb: 2,
            lineHeight: 1.1,
          }}
        >
          Organize
          <Box
            component="span"
            sx={{ color: "primary.light", display: "block" }}
          >
            Your Events
          </Box>
        </Typography>

        <Typography
          variant="h5"
          sx={{ mb: 4, opacity: 0.9, maxWidth: "700px", mx: "auto" }}
        >
          Temukan dan kelola acara terbaik di Indonesia. Dari{" "}
          <Box component="span" sx={{ color: "#FFD700", fontWeight: "bold" }}>
            workshop
          </Box>{" "}
          hingga{" "}
          <Box component="span" sx={{ color: "#FFD700", fontWeight: "bold" }}>
            seminar
          </Box>
          , semua dalam satu platform.
        </Typography>

        <Button
          component={RouterLink}
          to="/home"
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          sx={{
            fontSize: "1.1rem",
            px: 5,
            py: 1.5,
            bgcolor: "white",
            color: "primary.dark",
            fontWeight: "bold",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "white",
              transform: "scale(1.05)",
            },
          }}
        >
          Mulai Jelajahi
        </Button>
      </Container>
      <Stats /> {/* Tambahkan komponen statistik di sini */}
    </Box>
  );
};

export default Hero;
