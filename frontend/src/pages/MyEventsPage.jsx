import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import EventCard from "../components/EventCard";

// Impor komponen-komponen dari MUI
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import { Add } from "@mui/icons-material";

const MyEventsPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!userInfo) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get("/api/events/myevents", config);
        setMyEvents(data);
      } catch (err) {
        setError("Gagal memuat data acara Anda.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, [userInfo]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Acara Saya
        </Typography>
        <Button
          component={RouterLink}
          to="/create-event"
          variant="contained"
          startIcon={<Add />}
        >
          Buat Acara Baru
        </Button>
      </Box>

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={4}>
          {loading ? (
            Array.from(new Array(3)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={250}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))
          ) : myEvents.length === 0 ? (
            <Grid item xs={12}>
              <Typography>Anda belum membuat acara apapun.</Typography>
            </Grid>
          ) : (
            myEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <EventCard event={event} />
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Container>
  );
};

export default MyEventsPage;
