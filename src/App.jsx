import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import InsightsIcon from "@mui/icons-material/Insights";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// 🏠 Главная страница
function HomePage() {
  console.log("HomePage рендерится!"); // Для отладки
  
  return (
    <Box sx={{ minHeight: "100vh", py: 4, pb: 12, px: 2 }}>
      {/* ТЕСТОВЫЙ БЛОК - чтобы убедиться что компонент работает */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "lightblue" }}>
        <Typography>✅ Главная страница загружена!</Typography>
      </Paper>

      {/* 1. Заголовок и миссия */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
          🎓 ПрофВыбор
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Система поддержки выбора образовательной траектории
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 2, maxWidth: 700, mx: "auto", lineHeight: 1.6 }}
        >
          Мы помогаем школьникам 5–11 классов осознанно выбрать профессию,
          опираясь на личные интересы, эмоции и реальные достижения, а не просто
          на тесты.
        </Typography>
      </Box>

      {/* 2. Блок "Проблема" (Статистика) */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Почему это важно?
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3, height: "100%", bgcolor: "#fff3e0" }}>
            <PriorityHighIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              78% школьников
            </Typography>
            <Typography variant="body2" color="text.secondary">
              испытывают сильный стресс при выборе профессии (ВЦИОМ, 2023).
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3, height: "100%", bgcolor: "#ffebee" }}>
            <PsychologyIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Каждый 3-й студент
            </Typography>
            <Typography variant="body2" color="text.secondary">
              отчисляется или меняет специальность, потому что «ошибся с
              выбором».
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 3. Блок "Решение" (Что мы предлагаем) */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Как мы помогаем?
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <CheckCircleIcon color="success" sx={{ mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Не просто тесты
            </Typography>
            <Typography color="text.secondary">
              Существующие сервисы слишком формальны. Мы учитываем твой личный
              опыт, хобби и эмоции.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <CheckCircleIcon color="success" sx={{ mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Сопровождение, а не оценка
            </Typography>
            <Typography color="text.secondary">
              Помогаем ставить цели, отслеживать прогресс и поддерживаем
              «огонёк» мотивации каждый день.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <CheckCircleIcon color="success" sx={{ mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Персонализация
            </Typography>
            <Typography color="text.secondary">
              Рекомендации вузов и направлений строятся на основе твоих реальных
              оценок и интересов.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* 4. Призыв к действию */}
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Готов найти свой путь?
        </Typography>
        <Typography sx={{ mb: 3, opacity: 0.9 }}>
          Начни с заполнения профиля и постановки первой цели
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="/profile"
          endIcon={<ArrowForwardIcon />}
          sx={{
            bgcolor: "white",
            color: "primary.main",
            fontWeight: "bold",
            px: 4,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          Начать сейчас
        </Button>
      </Paper>
    </Box>
  );
}

// 👤 Страница: Профиль
function ProfilePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>
          👤 Профиль
        </Typography>
        <Typography color="text.secondary">
          Здесь можно загрузить оценки, табель, добавить хобби и увлечения
        </Typography>
      </Paper>
    </Container>
  );
}

// 🎓 Страница: Направления
function DirectionsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>
          🎓 Направления и вузы
        </Typography>
        <Typography color="text.secondary">
          Подборка институтов и образовательных программ под твои интересы
        </Typography>
      </Paper>
    </Container>
  );
}

// 📊 Страница: Статистика
function StatsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>
          📊 Статистика интересов
        </Typography>
        <Typography color="text.secondary">
          Как менялись твои предпочтения: от повара к юристу и дальше 📈
        </Typography>
      </Paper>
    </Container>
  );
}

// 🎯 Страница: Цели
function GoalsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>
          🎯 Мои цели
        </Typography>
        <Typography color="text.secondary">
          Текущая цель + задачи + огонёк 🔥 + награды 🏆
        </Typography>
      </Paper>
    </Container>
  );
}

// 🔵 Компонент нижней навигации (5 кнопок)
function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("Текущий путь:", location.pathname); // Для отладки

  const getCurrentValue = () => {
    switch (location.pathname) {
      case "/":
        return 0;
      case "/profile":
        return 1;
      case "/directions":
        return 2;
      case "/stats":
        return 3;
      case "/goals":
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

// 🟡 Главный компонент с роутингом
function App() {
  return (
    <Router>
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