import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { CalendarToday, People } from "@mui/icons-material";

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const isEventFinished = eventDate < new Date();

  return (
    <Card
      sx={{
        height: "100%", // Kembali ke height auto tapi konsisten
        width: "100%", // Memastikan card mengambil lebar penuh dari container
        display: "flex",
        flexDirection: "column",
        minHeight: 300, // Minimum height untuk konsistensi
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          pb: 0,
        }}
      >
        {/* Header dengan kategori dan harga */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Chip
            label={event.category || "Umum"}
            color={isEventFinished ? "default" : "primary"}
            size="small"
            sx={{ maxWidth: "60%" }}
          />
          {event.price > 0 ? (
            <Chip
              label={`Rp ${event.price.toLocaleString("id-ID")}`}
              variant="outlined"
              size="small"
              color="primary"
              sx={{ maxWidth: "40%" }}
            />
          ) : (
            <Chip
              label="Gratis"
              variant="outlined"
              size="small"
              sx={{
                color: "success.main",
                borderColor: "success.main",
                maxWidth: "40%",
              }}
            />
          )}
        </Box>

        {/* Judul dengan tinggi tetap */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            height: "3.5rem", // Fixed height untuk judul
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.3,
          }}
        >
          {event.title}
        </Typography>

        {/* Deskripsi dengan tinggi tetap */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            height: "4.5rem", // Fixed height untuk deskripsi
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.4,
            mb: 2,
          }}
        >
          {event.description}
        </Typography>

        {/* Spacer untuk mendorong content ke bawah */}
        <Box sx={{ flexGrow: 1 }} />
      </CardContent>

      {/* Footer dengan tanggal dan tombol */}
      <CardActions sx={{ p: 2, pt: 1, mt: "auto" }}>
        <Box sx={{ width: "100%" }}>
          <Divider sx={{ mb: 1.5 }} />

          {/* Tanggal */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {eventDate.toLocaleDateString("id-ID", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Typography>
          </Box>

          {/* Tombol */}
          <Button
            component={RouterLink}
            to={`/event/${event._id}`}
            variant="contained"
            fullWidth
            disabled={isEventFinished}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {isEventFinished ? "Acara Selesai" : "Lihat Detail"}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default EventCard;
