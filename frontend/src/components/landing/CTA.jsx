import React from "react";
import { Box, Container, Typography, Button, Chip } from "@mui/material";
import { ArrowForward, AutoAwesome } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const CTA = () => {
  return (
    <Box
      sx={{
        py: 10,
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #0881b7 0%, #4fb0e0 50%, #0881b7 100%)",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
        <Box
          sx={{
            maxWidth: "800px",
            mx: "auto",
            textAlign: "center",
            color: "white",
          }}
        >
          <Chip
            icon={<AutoAwesome />}
            label="Mulai Perjalanan Anda Hari Ini"
            sx={{
              mb: 4,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              backdropFilter: "blur(10px)",
              fontWeight: 600,
            }}
          />
          <Typography
            variant="h2"
            component="h2"
            sx={{
              mb: 3,
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: "bold",
            }}
          >
            Siap Menemukan Acara{" "}
            <Typography
              component="span"
              variant="h2"
              sx={{
                display: "block",
                color: "#FFD700",
                fontSize: "inherit",
                fontWeight: "inherit",
              }}
            >
              Impian Anda?
            </Typography>
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 5, opacity: 0.9, maxWidth: "600px", mx: "auto" }}
          >
            Bergabunglah dengan ribuan peserta lainnya dan mulai jelajahi dunia
            acara yang tak terbatas bersama Organize.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              fontSize: "1.1rem",
              px: 4,
              py: 2,
              bgcolor: "white",
              color: "primary.main",
              fontWeight: 600,
            }}
          >
            Daftar Sebagai Organizer
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
export default CTA;
