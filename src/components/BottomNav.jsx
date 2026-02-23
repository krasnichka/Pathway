import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import InsightsIcon from "@mui/icons-material/Insights";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentValue = () => {
    switch (location.pathname) {
      case "/":
      case "/Pathway/":
      case "/Pathway":
        return 0;
      case "/profile":
      case "/Pathway/profile":
        return 1;
      case "/directions":
      case "/Pathway/directions":
        return 2;
      case "/stats":
      case "/Pathway/stats":
        return 3;
      case "/goals":
      case "/Pathway/goals":
        return 4;
      default:
        return 0;
    }
  };

  const handleNavigation = (event, newValue) => {
    const paths = ["/", "/profile", "/directions", "/stats", "/goals"];
    navigate(paths[newValue]);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <BottomNavigation
        showLabels
        value={getCurrentValue()}
        onChange={handleNavigation}
        sx={{
          width: "100%",
          minHeight: 64,
          "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            flex: 1,
            padding: "6px 4px",
          },
        }}
      >
        <BottomNavigationAction label="Главная" icon={<HomeIcon />} />
        <BottomNavigationAction label="Профиль" icon={<PersonIcon />} />
        <BottomNavigationAction label="Направления" icon={<SchoolIcon />} />
        <BottomNavigationAction label="Статистика" icon={<InsightsIcon />} />
        <BottomNavigationAction label="Цели" icon={<EmojiEventsIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;