import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Impor komponen-komponen dari MUI
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
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  // State untuk form utama
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState(0);
  const [quota, setQuota] = useState(50);
  const [image, setImage] = useState("");

  // State untuk form kustom dan upload
  const [customFormFields, setCustomFormFields] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data } = await axios.get(`/api/events/${id}`);
        setTitle(data.title);
        setDescription(data.description);
        setDate(new Date(data.date).toISOString().slice(0, 16));
        setPrice(data.price);
        setQuota(data.quota);
        setImage(data.imageUrl || "");
        setCustomFormFields(data.customFormFields || []);
      } catch (err) {
        setError("Gagal memuat data acara.");
      }
    };
    fetchEventDetails();
  }, [id]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data.secure_url);
    } catch (error) {
      setError("Gagal mengupload gambar.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(
        `/api/events/${id}`,
        {
          title,
          description,
          date,
          price,
          quota,
          imageUrl: image,
          customFormFields,
        },
        config
      );
      alert("Acara berhasil diperbarui!");
      navigate(`/event/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui acara!");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengelola field kustom (sama seperti di CreateEventPage)
  const addField = () =>
    setCustomFormFields([
      ...customFormFields,
      { label: "", fieldType: "text", isRequired: false },
    ]);
  const handleFieldChange = (index, event) => {
    const values = [...customFormFields];
    values[index][event.target.name] =
      event.target.name === "isRequired"
        ? event.target.checked
        : event.target.value;
    setCustomFormFields(values);
  };
  const removeField = (index) => {
    const values = [...customFormFields];
    values.splice(index, 1);
    setCustomFormFields(values);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Edit Acara
        </Typography>
        <Box component="form" onSubmit={handleUpdateEvent} noValidate>
          <Grid container spacing={3}>
            {/* ... (semua TextField untuk detail acara seperti di CreateEventPage) ... */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Judul Acara"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Deskripsi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tanggal & Waktu"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Harga (Rp)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Kuota"
                type="number"
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL Gambar"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                InputProps={{ readOnly: true }}
              />
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 1 }}
              >
                Upload Poster Baru
                <input type="file" hidden onChange={uploadFileHandler} />
              </Button>
              {uploading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Form Pendaftaran Kustom</Divider>
            </Grid>

            {/* Form Builder (sama seperti di CreateEventPage) */}
            {customFormFields.map((field, index) => (
              <Grid item xs={12} key={index}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
                >
                  <TextField
                    fullWidth
                    name="label"
                    label={`Pertanyaan #${index + 1}`}
                    value={field.label}
                    onChange={(event) => handleFieldChange(index, event)}
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Tipe</InputLabel>
                    <Select
                      name="fieldType"
                      value={field.fieldType}
                      label="Tipe"
                      onChange={(event) => handleFieldChange(index, event)}
                    >
                      <MenuItem value="text">Teks</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="number">Angka</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isRequired"
                        checked={field.isRequired}
                        onChange={(event) => handleFieldChange(index, event)}
                      />
                    }
                    label="Wajib"
                  />
                  <IconButton onClick={() => removeField(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={addField} startIcon={<AddIcon />} variant="text">
                Tambah Pertanyaan
              </Button>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Perbarui Acara"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditEventPage;
