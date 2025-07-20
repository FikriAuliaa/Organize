import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";

// Impor komponen-komponen dari MUI
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
} from "@mui/material";
import { ConfirmationNumber, Payment } from "@mui/icons-material";

const MyTicketsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchMyRegistrations = async () => {
      if (!userInfo) {
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get("/api/users/myregistrations", config);
        setRegistrations(data.filter((reg) => reg.event));
      } catch (err) {
        setError("Gagal memuat data pendaftaran Anda.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyRegistrations();
  }, [userInfo]);

  // Fungsi baru untuk menangani pembayaran ulang
  const handleRepayment = async (registrationId) => {
    try {
      // 1. Dapatkan token pembayaran dari endpoint backend yang sudah ada
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(
        `/api/events/registrations/${registrationId}/repay`,
        {},
        config
      );

      // 2. Gunakan token tersebut untuk membuka jendela pembayaran Midtrans
      if (data.paymentToken) {
        window.snap.pay(data.paymentToken, {
          onSuccess: function (result) {
            Swal.fire("Pembayaran Berhasil!", "", "success").then(() =>
              window.location.reload()
            );
          },
          onPending: function (result) {
            Swal.fire("Menunggu Pembayaran", "", "info");
          },
          onError: function (result) {
            Swal.fire("Pembayaran Gagal", "", "error");
          },
        });
      }
    } catch (err) {
      Swal.fire("Error", "Gagal membuat transaksi pembayaran.", "error");
    }
  };

  const getStatusChip = (status) => {
    if (status === "paid") {
      return <Chip label="Lunas" color="success" size="small" />;
    }
    if (status === "pending") {
      return <Chip label="Menunggu Pembayaran" color="warning" size="small" />;
    }
    return <Chip label="Dibatalkan" color="error" size="small" />;
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <ConfirmationNumber
          sx={{ fontSize: { xs: 28, md: 32 }, color: "primary.main" }}
        />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Tiket Saya
        </Typography>
      </Box>

      {registrations.length === 0 ? (
        <Alert severity="info">Anda belum terdaftar di acara manapun.</Alert>
      ) : (
        <Grid container spacing={3}>
          {registrations.map((reg) => (
            <Grid item xs={12} md={6} key={reg._id}>
              <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 600 }}
                    >
                      {reg.event.title}
                    </Typography>
                    {getStatusChip(reg.status)}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Tanggal Acara:{" "}
                    {new Date(reg.event.date).toLocaleDateString("id-ID")}
                  </Typography>

                  {reg.status === "paid" ? (
                    <Box
                      sx={{
                        bgcolor: "grey.100",
                        p: 1.5,
                        borderRadius: 1,
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        component="strong"
                        sx={{ fontWeight: 600 }}
                      >
                        Kode Tiket Anda:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ fontWeight: 700, color: "primary.dark" }}
                      >
                        {reg.uniqueTicketCode}
                      </Typography>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<Payment />}
                      onClick={() => handleRepayment(reg._id, reg.event.price)}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Lanjutkan Pembayaran
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyTicketsPage;
