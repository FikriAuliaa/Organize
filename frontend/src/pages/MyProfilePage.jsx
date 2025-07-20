import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  TextField,
  Stack,
} from "@mui/material";

const MyProfilePage = () => {
  const { userInfo, login } = useAuth();

  // State untuk mode edit
  const [editMode, setEditMode] = useState(false);

  // State untuk menampung nilai form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    companyName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        password: "",
        confirmPassword: "",
        phoneNumber: userInfo.phoneNumber || "",
        address: userInfo.address || "",
        companyName: userInfo.companyName || "",
      });
    }
  }, [userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          companyName: formData.companyName,
        },
        config
      );

      login(data); // Perbarui state global dan localStorage
      setSuccess("Profil berhasil diperbarui!");
      setEditMode(false); // Kembali ke mode tampilan
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Profil Saya
          </Typography>
          {!editMode && (
            <Button variant="outlined" onClick={() => setEditMode(true)}>
              Edit Profil
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {editMode ? (
          // === MODE EDIT ===
          <Box component="form" onSubmit={handleUpdateProfile}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nama Lengkap"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Alamat Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              {userInfo?.role === "organizer" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nomor HP"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nama Perusahaan"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Alamat"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Ubah Password (kosongkan jika tidak ingin diubah)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password Baru"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="Konfirmasi Password Baru"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </Button>
                  <Button variant="text" onClick={() => setEditMode(false)}>
                    Batal
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        ) : (
          // === MODE TAMPILAN ===
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Nama:</strong> {userInfo?.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Email:</strong> {userInfo?.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Peran:</strong> {userInfo?.role}
                </Typography>
              </Grid>
              {userInfo?.role === "organizer" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Nomor HP:</strong> {userInfo?.phoneNumber || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Perusahaan:</strong>{" "}
                      {userInfo?.companyName || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Alamat:</strong> {userInfo?.address || "-"}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default MyProfilePage;
