import React, { useState, useEffect } from "react";
import {
  useParams,
  Link as RouterLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2"; // <-- 1. Impor SweetAlert2

// Impor komponen-komponen dari MUI
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  TextField,
  Paper,
  Stack,
  Link,
} from "@mui/material";

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError(`Gagal memuat data acara: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleAnswerChange = (fieldLabel, value) => {
    setAnswers((prev) => ({ ...prev, [fieldLabel]: value }));
  };

  const handleRegister = async () => {
    if (!userInfo) {
      navigate("/login", { state: { from: location } });
      return;
    }

    // Validasi form
    for (const field of event.customFormFields) {
      if (field.isRequired && !answers[field.label]) {
        setRegisterError(`Pertanyaan "${field.label}" wajib diisi.`);
        return;
      }
    }

    setRegisterLoading(true);
    setRegisterError("");

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const customAnswersPayload = Object.entries(answers).map(
        ([key, value]) => ({
          fieldLabel: key,
          answer: value,
        })
      );

      console.log("Sending registration request...");

      const { data } = await axios.post(
        `/api/events/${id}/register`,
        { customAnswers: customAnswersPayload },
        config
      );

      console.log("Registration response:", data);

      // Untuk acara gratis
      if (!data.paymentToken) {
        Swal.fire({
          title: "Pendaftaran Berhasil!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/my-tickets");
        return;
      }

      // Untuk acara berbayar
      console.log("Payment token received:", data.paymentToken);

      // Cek apakah window.snap tersedia
      if (!window.snap) {
        throw new Error(
          "Midtrans Snap tidak ter-load. Pastikan script Midtrans sudah di-include."
        );
      }

      // Buka modal pembayaran Midtrans
      window.snap.pay(data.paymentToken, {
        onSuccess: function (result) {
          console.log("Payment success:", result);
          Swal.fire("Pembayaran Berhasil!", "", "success");
          navigate("/my-tickets");
        },
        onPending: function (result) {
          console.log("Payment pending:", result);
          Swal.fire(
            "Menunggu Pembayaran",
            "Selesaikan pembayaran Anda.",
            "info"
          );
        },
        onError: function (result) {
          console.error("Payment error:", result);
          Swal.fire(
            "Pembayaran Gagal",
            result.status_message || "Terjadi kesalahan",
            "error"
          );
        },
        onClose: function () {
          console.log("Payment modal closed");
          Swal.fire(
            "Pembayaran Dibatalkan",
            "Anda dapat melanjutkan pembayaran nanti",
            "info"
          );
        },
      });
    } catch (err) {
      console.error("Registration error:", err);

      const errorMessage =
        err.response?.data?.message || err.message || "Pendaftaran gagal.";
      setRegisterError(errorMessage);

      Swal.fire({
        title: "Gagal Mendaftar",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setRegisterLoading(false);
    }
  };
  const handleDelete = async () => {
    // --- Ganti konfirmasi dengan Swal.fire ---
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Acara yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          };
          await axios.delete(`/api/events/${id}`, config);

          Swal.fire("Dihapus!", "Acara telah berhasil dihapus.", "success");
          navigate("/home");
        } catch (err) {
          Swal.fire("Gagal!", "Gagal menghapus acara.", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!event) return <Alert severity="warning">Acara tidak ditemukan.</Alert>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          {event.title}
        </Typography>

        {event.organizer ? (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Diselenggarakan oleh:{" "}
            <Link
              component={RouterLink}
              to={`/organizer/${event.organizer._id}`}
              fontWeight="bold"
            >
              {event.organizer.name}
            </Link>
          </Typography>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Diselenggarakan oleh: Organizer tidak diketahui
          </Typography>
        )}

        <Box sx={{ my: 4, borderRadius: 2, overflow: "hidden" }}>
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "400px",
              objectFit: "cover",
            }}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 2, color: "text.secondary" }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              <strong>Tanggal:</strong>{" "}
              {new Date(event.date).toLocaleString("id-ID", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              <strong>Harga:</strong> Rp {event.price.toLocaleString("id-ID")}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              <strong>Kuota:</strong> {event.quota} peserta
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {event.description}
        </Typography>

        {/* Panel Khusus Organizer */}
        {userInfo && userInfo._id === event.organizer?._id && (
          <Box sx={{ my: 4, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Panel Organizer
            </Typography>
            <Button
              component={RouterLink}
              to={`/event/${event._id}/edit`}
              variant="contained"
              color="warning"
              sx={{ mr: 1 }}
            >
              Edit Acara
            </Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Hapus Acara
            </Button>
          </Box>
        )}

        {/* Form Pendaftaran */}
        {userInfo?._id !== event.organizer?._id && (
          <Box sx={{ my: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Form Pendaftaran
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
              }}
            >
              <Stack spacing={2}>
                {userInfo &&
                event.customFormFields &&
                event.customFormFields.length > 0
                  ? event.customFormFields.map((field) => (
                      <TextField
                        key={field._id}
                        label={field.label}
                        type={field.fieldType}
                        required={field.isRequired}
                        fullWidth
                        variant="outlined"
                        onChange={(e) =>
                          handleAnswerChange(field.label, e.target.value)
                        }
                      />
                    ))
                  : !userInfo &&
                    event.customFormFields &&
                    event.customFormFields.length > 0 && (
                      <Alert severity="info">
                        Silakan login untuk mengisi form pendaftaran.
                      </Alert>
                    )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={registerLoading}
                  size="large"
                >
                  {registerLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Daftar Acara Ini"
                  )}
                </Button>
                {registerError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {registerError}
                  </Alert>
                )}
              </Stack>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default EventDetailPage;
