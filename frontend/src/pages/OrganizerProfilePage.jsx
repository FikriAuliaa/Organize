import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventCard from "../components/EventCard";
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Skeleton,
  Avatar,
} from "@mui/material";

const OrganizerProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await axios.get(`/api/users/organizers/${id}`);
        setProfile(data);
      } catch (err) {
        setError("Gagal memuat profil organizer.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile)
    return <Alert severity="info">Organizer tidak ditemukan.</Alert>;

  const { organizer, events } = profile;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: "primary.main",
            fontSize: "2.5rem",
          }}
        >
          {organizer.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {organizer.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {organizer.companyName || "Individu"}
          </Typography>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Acara yang Diadakan
      </Typography>
      <Grid container spacing={3}>
        {events.length === 0 ? (
          <Grid item xs={12}>
            <Typography>
              Organizer ini belum mengadakan acara apapun.
            </Typography>
          </Grid>
        ) : (
          events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <EventCard event={event} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default OrganizerProfilePage;
