import React, { useState } from "react";
import axios from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // <-- 1. Impor SweetAlert2

// Impor komponen-komponen dari MUI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper, Stack } from "@mui/material";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/users/register", { name, email, password });

      // --- 2. Ganti alert dengan Swal.fire ---
      await Swal.fire({
        title: "Registrasi Berhasil!",
        text: "Anda akan diarahkan ke halaman login.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registrasi Gagal!";
      setError(errorMessage);

      // Tampilkan notifikasi error dengan Swal
      Swal.fire({
        title: "Registrasi Gagal",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
            Buat Akun Baru
          </Typography>
          <Box
            component="form"
            onSubmit={handleRegister}
            noValidate
            sx={{ mt: 3, width: "100%" }}
          >
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                id="name"
                label="Nama Lengkap"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                required
                fullWidth
                id="email"
                label="Alamat Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Alert severity="error" variant="outlined">
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </Button>
            </Stack>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            Sudah punya akun?{" "}
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              fontWeight="bold"
            >
              Login di sini
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
