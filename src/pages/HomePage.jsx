import * as React from "react";
import {
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 12 }}>
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
          href="/Pathway/profile"
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
    </Container>
  );
}

export default HomePage;