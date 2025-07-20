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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 300, // Tambahkan minimum height untuk konsistensi
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Chip
            label={event.category || "Umum"}
            color={isEventFinished ? "default" : "primary"}
            size="small"
          />
          {event.price > 0 ? (
            <Chip
              label={`Rp ${event.price.toLocaleString("id-ID")}`}
              variant="outlined"
              size="small"
              color="primary"
            />
          ) : (
            <Chip
              label="Gratis"
              variant="outlined"
              size="small"
              sx={{ color: "success.main", borderColor: "success.main" }}
            />
          )}
        </Box>

        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "3rem", // Pastikan judul memiliki ruang yang konsisten
          }}
        >
          {event.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flexGrow: 1, // Biarkan deskripsi mengambil ruang yang tersisa
          }}
        >
          {event.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, mt: "auto" }}>
        <Box sx={{ width: "100%" }}>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1.5 }}>
            <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {eventDate.toLocaleDateString("id-ID")}
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to={`/event/${event._id}`}
            variant="contained"
            fullWidth
            disabled={isEventFinished}
          >
            {isEventFinished ? "Acara Selesai" : "Lihat Detail"}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default EventCard;
