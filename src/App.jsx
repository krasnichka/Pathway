import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import DirectionsPage from "./pages/DirectionsPage";
import StatsPage from "./pages/StatsPage";
import GoalsPage from "./pages/GoalsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BottomNav from "./components/BottomNav";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <Router basename="/Pathway">
      <AuthProvider>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "grey.50",
            pb: 8,
          }}
        >
          <Routes>
            {/* Публичные страницы */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Защищённые страницы */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/directions"
              element={
                <PrivateRoute>
                  <DirectionsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <PrivateRoute>
                  <StatsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <PrivateRoute>
                  <GoalsPage />
                </PrivateRoute>
              }
            />
          </Routes>
          <BottomNav />
        </Box>
      </AuthProvider>
    </Router>
  );
}

export default App;
