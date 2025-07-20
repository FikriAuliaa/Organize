import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";

// Impor komponen-komponen dari MUI
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";

const CreateEventPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState(0);
  const [quota, setQuota] = useState(50);
  const [customFormFields, setCustomFormFields] = useState([]);
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const addField = () => {
    setCustomFormFields([
      ...customFormFields,
      { label: "", fieldType: "text", isRequired: false },
    ]);
  };

  const handleFieldChange = (index, event) => {
    const values = [...customFormFields];
    if (event.target.name === "isRequired") {
      values[index][event.target.name] = event.target.checked;
    } else {
      values[index][event.target.name] = event.target.value;
    }
    setCustomFormFields(values);
  };

  const removeField = (index) => {
    const values = [...customFormFields];
    values.splice(index, 1);
    setCustomFormFields(values);
  };

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
      Swal.fire({
        title: "Upload Berhasil!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Upload Gagal",
        text: "Gagal mengupload gambar.",
        icon: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateEvent = async (e) => {
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
      const { data } = await axios.post(
        "/api/events",
        {
          title,
          description,
          date,
          price,
          quota,
          customFormFields,
          imageUrl: image,
        },
        config
      );
      await Swal.fire({
        title: "Berhasil!",
        text: "Acara baru berhasil dibuat.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(`/event/${data._id}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal membuat acara!";
      setError(errorMessage);
      Swal.fire({ title: "Gagal!", text: errorMessage, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Buat Acara Baru
        </Typography>
        <Box component="form" onSubmit={handleCreateEvent} noValidate>
          {/* Gunakan Stack untuk layout vertikal */}
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Judul Acara"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Deskripsi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Tanggal & Waktu"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Harga (Rp)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextField
              fullWidth
              label="Kuota"
              type="number"
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              required
            />

            {/* Input file upload */}
            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                disabled={uploading}
              >
                {uploading ? "Mengupload..." : "Upload Poster"}
                <input type="file" hidden onChange={uploadFileHandler} />
              </Button>
              {image && (
                <Typography variant="caption" sx={{ ml: 2 }}>
                  Gambar terpilih: {image.substring(image.lastIndexOf("/") + 1)}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }}>
              <Typography>Form Pendaftaran Kustom</Typography>
            </Divider>

            {/* Form Builder */}
            {customFormFields.map((field, index) => (
              <Paper
                key={index}
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
            ))}
            <Button
              onClick={addField}
              startIcon={<AddIcon />}
              variant="text"
              sx={{ alignSelf: "flex-start" }}
            >
              Tambah Pertanyaan
            </Button>

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Buat Acara"
              )}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateEventPage;
