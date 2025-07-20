import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import EventCard from "../components/EventCard";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Skeleton,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack,
  Link,
  Pagination,
} from "@mui/material";
import { CalendarToday, Search } from "@mui/icons-material";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("semua");

  // Fungsi untuk mengambil semua data (acara dan organizer)
  const fetchAllData = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("keyword", searchTerm);
      if (priceFilter !== "semua") params.append("price", priceFilter);
      params.append("pageNumber", currentPage);

      const [eventsRes, organizersRes] = await Promise.all([
        axios.get(`/api/events?${params.toString()}`),
        axios.get("/api/users/organizers"),
      ]);

      setEvents(eventsRes.data.events);
      setPages(eventsRes.data.pages);
      setPage(eventsRes.data.page);
      setOrganizers(organizersRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(page);
  }, [page]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAllData(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* Hero Section dengan Search Bar */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #041C32 0%, #042940 100%)",
          color: "white",
          py: { xs: 6, md: 8 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 800 }}
          >
            Temukan Acara Menarik Berikutnya
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
            Jelajahi workshop, seminar, dan kompetisi di seluruh Indonesia.
          </Typography>
          <Paper
            component="form"
            onSubmit={handleFilterSubmit}
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              maxWidth: 800,
              mx: "auto",
              borderRadius: 4,
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Masukkan kata kunci"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ bgcolor: "white", borderRadius: 1 }}
            />
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "white", borderRadius: 1 }}
            >
              <InputLabel>Harga</InputLabel>
              <Select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                label="Harga"
              >
                <MenuItem value="semua">Semua</MenuItem>
                <MenuItem value="gratis">Gratis</MenuItem>
                <MenuItem value="berbayar">Berbayar</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Search />}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              Cari
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* Konten Utama Dua Kolom */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* KOLOM KIRI (DAFTAR ACARA) */}
          <Box sx={{ flex: "1 1 66%", minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <CalendarToday
                sx={{ fontSize: { xs: 28, md: 32 }, color: "primary.main" }}
              />
              <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
                Acara Mendatang
              </Typography>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              {loading ? (
                Array.from(new Array(4)).map((_, index) => (
                  <Grid xs={12} sm={6} key={index}>
                    <Skeleton
                      variant="rectangular"
                      height={300}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                ))
              ) : events.length === 0 ? (
                <Grid xs={12}>
                  <Alert severity="info">Tidak ada acara yang ditemukan.</Alert>
                </Grid>
              ) : (
                events.map((event) => (
                  <Grid xs={12} sm={6} key={event._id}>
                    <EventCard event={event} />
                  </Grid>
                ))
              )}
            </Grid>
            {!loading && pages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </Box>

          {/* KOLOM KANAN (DAFTAR ORGANIZER) */}
          <Box sx={{ flex: "1 1 33%", minWidth: 280 }}>
            <Box
              sx={{
                position: "sticky",
                top: "20px",
                backgroundColor: "background.paper",
                p: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Organizer Teratas
              </Typography>

              {loading ? (
                <Stack spacing={2}>
                  {Array.from(new Array(5)).map((_, index) => (
                    <Skeleton
                      variant="rectangular"
                      height={80}
                      key={index}
                      sx={{ borderRadius: 2 }}
                    />
                  ))}
                </Stack>
              ) : organizers.length === 0 ? (
                <Alert severity="info">
                  Tidak ada organizer yang tersedia.
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {organizers.slice(0, 5).map((org) => (
                    <Link
                      to={`/organizer/${org._id}`}
                      key={org._id}
                      component={RouterLink}
                      sx={{ textDecoration: "none" }}
                    >
                      <Card
                        variant="outlined"
                        sx={{
                          minHeight: 80,
                          "&:hover": {
                            boxShadow: 3,
                            borderColor: "primary.main",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="body1" fontWeight="bold" noWrap>
                            {org.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {org.companyName || "Individu"}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
