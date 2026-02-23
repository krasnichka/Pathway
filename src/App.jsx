import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import DirectionsPage from "./pages/DirectionsPage";
import StatsPage from "./pages/StatsPage";
import GoalsPage from "./pages/GoalsPage";
import BottomNav from "./components/BottomNav";

function App() {
  return (
    <Router basename="/Pathway">
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.50",
          pb: 8,
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/directions" element={<DirectionsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
        </Routes>
        <BottomNav />
      </Box>
    </Router>
  );
}

export default App;