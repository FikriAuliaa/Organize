import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom"; // Alias Link
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Impor komponen-komponen dari MUI
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper, // Untuk membungkus Table
  Button, // Untuk tombol kembali
} from "@mui/material";
import { ArrowBack, Group } from "@mui/icons-material"; // Ikon untuk kembali dan daftar pendaftar

const ParticipantListPage = () => {
  const { id: eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchRegistrations = async () => {
      // Pastikan userInfo ada dan memiliki token sebelum mencoba mengambil data
      if (!userInfo || !userInfo.token) {
        setLoading(false);
        setError("Anda perlu login untuk melihat daftar pendaftar.");
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        // Ambil detail acara untuk mendapatkan nama
        const eventRes = await axios.get(
          `http://localhost:5000/api/events/${eventId}`
        );
        setEventName(eventRes.data.title);

        // Ambil daftar pendaftar
        const { data } = await axios.get(
          `http://localhost:5000/api/events/${eventId}/registrations`,
          config
        );
        setRegistrations(data);
      } catch (err) {
        // Cek jika error 403 (Forbidden)
        if (err.response && err.response.status === 403) {
          setError(
            "Anda tidak memiliki izin untuk melihat daftar pendaftar acara ini. Hanya organizer yang dapat melihatnya."
          );
        } else {
          setError("Gagal memuat data pendaftar.");
        }
        console.error("Error fetching registrations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [eventId, userInfo]); // Dependensi eventId dan userInfo

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Tombol Kembali */}
      <Button
        component={RouterLink}
        to="/my-events"
        startIcon={<ArrowBack />}
        variant="outlined"
        sx={{ mb: 4 }}
      >
        Kembali ke Acara Saya
      </Button>

      {/* Header Halaman */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Group sx={{ fontSize: { xs: 28, md: 32 }, color: "primary.main" }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Daftar Pendaftar untuk: {eventName}
        </Typography>
      </Box>

      {/* Indikator Loading, Error, atau Konten */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : registrations.length === 0 ? (
        <Alert severity="info">Belum ada pendaftar untuk acara ini.</Alert>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Nama Peserta</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Jawaban Kustom
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow
                  key={reg._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {reg.participant.name}
                  </TableCell>
                  <TableCell>{reg.participant.email}</TableCell>
                  <TableCell>
                    {reg.customAnswers.length > 0 ? (
                      reg.customAnswers.map((ans) => (
                        <Box key={ans._id} sx={{ mb: 0.5 }}>
                          <Typography
                            variant="body2"
                            component="strong"
                            sx={{ fontWeight: 600 }}
                          >
                            {ans.fieldLabel}:
                          </Typography>{" "}
                          <Typography variant="body2" component="span">
                            {ans.answer}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Tidak ada jawaban kustom
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ParticipantListPage;
