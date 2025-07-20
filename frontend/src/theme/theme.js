import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0881b7", // Biru Utama
      light: "#4fb0e0", // Biru Terang
      dark: "#005487", // Biru Tua
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F3F4F6",
      light: "#F9FAFB",
      dark: "#D1D5DB",
      contrastText: "#1F2937",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
    error: { main: "#EF4444" },
    success: { main: "#10B981" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "3rem", fontWeight: 700 },
    h2: { fontSize: "2.25rem", fontWeight: 700 },
    h3: { fontSize: "1.875rem", fontWeight: 600 },
    h4: { fontSize: "1.5rem", fontWeight: 600 },
    h5: { fontSize: "1.25rem", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "all 0.3s ease-in-out",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 16, fontWeight: 500 },
      },
    },
  },
});

export default theme;
