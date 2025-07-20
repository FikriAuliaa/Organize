import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Impor Komponen Layout & Header
import Header from "./components/Header";
import Navbar from "./components/landing/Navbar";
import Footer from "./components/landing/Footer";

// Impor Semua Halaman
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailPage from "./pages/EventDetailPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import EditEventPage from "./pages/EditEventPage";
import MyEventsPage from "./pages/MyEventsPage";
import ApplyOrganizerPage from "./pages/ApplyOrganizerPage";
import ParticipantListPage from "./pages/ParticipantListPage";
import OrganizerProfilePage from "./pages/OrganizerProfilePage";
import MyProfilePage from "./pages/MyProfilePage";

// Impor Komponen Penjaga
import OrganizerRoute from "./components/OrganizerRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import { Box } from "@mui/material";

function App() {
  const { userInfo } = useAuth();

  return (
    <Router>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {/* Tampilkan header yang sesuai */}
        {userInfo ? <Header /> : <Navbar />}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Routes>
            {/* Rute Publik */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/organizer/:id" element={<OrganizerProfilePage />} />

            {/* Rute yang hanya perlu login */}
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute>
                  <MyTicketsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MyProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply-organizer"
              element={
                <ProtectedRoute>
                  <ApplyOrganizerPage />
                </ProtectedRoute>
              }
            />

            {/* Rute yang hanya bisa diakses Organizer */}
            <Route
              path="/my-events"
              element={
                <OrganizerRoute>
                  <MyEventsPage />
                </OrganizerRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <OrganizerRoute>
                  <CreateEventPage />
                </OrganizerRoute>
              }
            />
            <Route
              path="/event/:id/edit"
              element={
                <OrganizerRoute>
                  <EditEventPage />
                </OrganizerRoute>
              }
            />
            <Route
              path="/event/:id/registrations"
              element={
                <OrganizerRoute>
                  <ParticipantListPage />
                </OrganizerRoute>
              }
            />
          </Routes>
          <Footer />
        </Box>
      </Box>
    </Router>
  );
}

export default App;
