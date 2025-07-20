import React from "react";
import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import {
  CalendarToday,
  Group,
  Public,
  Security,
  FlashOn,
  Favorite,
} from "@mui/icons-material";

// URL Gambar Stok untuk Features Section
const organizerImageUrl =
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80";
const workshopImageUrl =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80";

const features = [
  {
    icon: CalendarToday,
    title: "Mudah Menemukan Acara",
    description:
      "Jelajahi berbagai acara menarik dengan sistem pencarian yang canggih.",
  },
  {
    icon: Group,
    title: "Networking Berkualitas",
    description:
      "Bertemu dengan profesional dan peserta lain yang memiliki minat sama.",
  },
  {
    icon: Public,
    title: "Acara di Seluruh Indonesia",
    description:
      "Temukan acara di kota Anda atau jelajahi peluang di berbagai daerah.",
  },
  {
    icon: Security,
    title: "Organizer Terpercaya",
    description:
      "Semua organizer diverifikasi untuk memastikan kualitas dan kredibilitas acara.",
  },
  {
    icon: FlashOn,
    title: "Pendaftaran Instan",
    description:
      "Daftar acara dengan cepat dan mudah, serta dapatkan konfirmasi langsung.",
  },
  {
    icon: Favorite,
    title: "Pengalaman Personal",
    description:
      "Rekomendasi acara yang disesuaikan dengan minat dan preferensi Anda.",
  },
];

const Features = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            Mengapa Memilih Organize?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "800px", mx: "auto" }}
          >
            Platform terdepan untuk memberikan pengalaman terbaik bagi peserta
            dan organizer.
          </Typography>
        </Box>

        {/* Features Grid Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
            mb: 10, // Margin bawah setelah grid fitur
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "primary.main",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                    background:
                      "linear-gradient(135deg, #0881b7 0%, #4fb0e0 100%)",
                  }}
                >
                  <feature.icon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* --- IMAGE SHOWCASE SECTION --- */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 6,
            alignItems: "center",
            mb: 10,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              component="h3"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Bergabung dengan Komunitas Organizer
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, fontSize: "1.1rem" }}
            >
              Menjadi bagian dari jaringan organizer profesional dan dapatkan
              akses ke tools terbaik untuk mengelola acara Anda.
            </Typography>
          </Box>
          <Box
            component="img"
            src={organizerImageUrl}
            alt="Event organizers at work"
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 6,
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={workshopImageUrl}
            alt="Workshop and seminar participants"
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              order: { xs: 2, lg: 1 }, // Ubah urutan di layar kecil
            }}
          />
          <Box sx={{ pl: { lg: 4 }, order: { xs: 1, lg: 2 } }}>
            <Typography
              variant="h3"
              component="h3"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Pengalaman Peserta yang Luar Biasa
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, fontSize: "1.1rem" }}
            >
              Nikmati pengalaman mengikuti acara yang tak terlupakan dengan
              fitur-fitur canggih dan interface yang user-friendly.
            </Typography>
          </Box>
        </Box>
        {/* ----------------------------- */}
      </Container>
    </Box>
  );
};

export default Features;
