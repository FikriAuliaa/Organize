import React, { useState } from "react";
import axios from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";

// Impor komponen-komponen dari MUI
import {
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });
      login(response.data);
      login(response.data);
      Swal.fire({
        title: "Berhasil!",
        text: "Anda berhasil login.",
        icon: "success",
        timer: 2000, // Notifikasi akan hilang setelah 2 detik
        showConfirmButton: false,
      });
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login Gagal!");
      Swal.fire({
        title: "Gagal!",
        text: err.response?.data?.message || "Terjadi kesalahan saat login.",
        icon: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            marginTop: 8,
            marginBottom: 8,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
            Login
          </Typography>
          <Typography component="p" color="text.secondary" sx={{ mb: 3 }}>
            Selamat datang kembali!
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ width: "100%" }}
          >
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                id="email"
                label="Alamat Email"
                name="email"
                autoComplete="email"
                autoFocus
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
                autoComplete="current-password"
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
                  "Login"
                )}
              </Button>
            </Stack>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            Belum punya akun?{" "}
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              fontWeight="bold"
            >
              Daftar di sini
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
