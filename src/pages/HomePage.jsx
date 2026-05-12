import * as React from "react";
import { Typography, Container, Box, Grid, Paper, Button } from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8, pb: 16 }}>
      {/* 1. Hero Section */}
      <Box sx={{ textAlign: "center", mb: 10, pt: 4 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            px: 3,
            py: 1.5,
            bgcolor: "primary.main",
            color: "white",
            borderRadius: 50,
          }}
        >
          <SchoolIcon />
          <Typography variant="subtitle1" fontWeight="600">
            ВерныйПуть
          </Typography>
        </Box>

        <Typography
          variant="h2"
          fontWeight="800"
          sx={{
            mb: 3,
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-1px",
          }}
        >
          Ваш путь к осознанному выбору образования
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto", lineHeight: 1.8, mb: 4 }}
        >
          Система поддержки выбора образовательной траектории для учащихся
          общеобразовательных учреждений
        </Typography>

        <Button
          variant="contained"
          size="large"
          href="/Pathway/profile"
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: 5,
            py: 1.8,
            fontSize: "1.1rem",
            fontWeight: "600",
            borderRadius: 3,
            boxShadow: "0 8px 20px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              boxShadow: "0 12px 28px rgba(25, 118, 210, 0.4)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Начать
        </Button>
      </Box>

      {/* 2. Проблема - ОДИНАКОВЫЕ карточки */}
      <Typography
        variant="h4"
        fontWeight="700"
        sx={{ mb: 5, textAlign: "center" }}
      >
        Почему это важно
      </Typography>

      {/* Контейнер с flex для гарантированно одинаковых карточек */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
          mb: 10,
        }}
      >
        {/* Карточка 1 */}
        <Paper
          sx={{
            flex: "1 1 300px",
            maxWidth: "400px",
            p: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            borderTop: "4px solid #ff9800",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <PriorityHighIcon sx={{ fontSize: 48, color: "#ff9800", mb: 2 }} />
          <Typography variant="h2" fontWeight="800" gutterBottom>
            39%
          </Typography>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            школьников в стрессе
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
            старшеклассников испытывают трудности при выборе направления
            обучения и вуза
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mt: "auto" }}
          >
            ТАСС, 2025
          </Typography>
        </Paper>

        {/* Карточка 2 */}
        <Paper
          sx={{
            flex: "1 1 300px",
            maxWidth: "400px",
            p: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            borderTop: "4px solid #f44336",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <PsychologyIcon sx={{ fontSize: 48, color: "#f44336", mb: 2 }} />
          <Typography variant="h2" fontWeight="800" gutterBottom>
            45%
          </Typography>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            выбирают направление поздно
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
            учащихся определяют образовательную траекторию только после
            окончания школы
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mt: "auto" }}
          >
            Авито Работа, 2024
          </Typography>
        </Paper>

        {/* Карточка 3 */}
        <Paper
          sx={{
            flex: "1 1 300px",
            maxWidth: "400px",
            p: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            borderTop: "4px solid #9c27b0",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <WarningAmberIcon sx={{ fontSize: 48, color: "#9c27b0", mb: 2 }} />
          <Typography variant="h2" fontWeight="800" gutterBottom>
            90%
          </Typography>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            не знают, где искать информацию
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
            школьников испытывают дефицит качественной информации о направлениях
            обучения и требованиях вузов
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mt: "auto" }}
          >
            Pedsovet.org, 2022
          </Typography>
        </Paper>
      </Box>

      {/* 3. Решение - с градиентом */}
      <Box sx={{ mb: 10 }}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{ mb: 5, textAlign: "center" }}
        >
          Как работает система
        </Typography>

        <Paper
          sx={{
            p: 6,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
            }}
          >
            {/* Персонализация */}
            <Box
              sx={{ flex: "1 1 250px", maxWidth: "350px", textAlign: "center" }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                Персонализация
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Учитываем Ваши оценки, интересы и достижения для формирования
                индивидуальных рекомендаций
              </Typography>
            </Box>

            {/* Поддержка */}
            <Box
              sx={{ flex: "1 1 250px", maxWidth: "350px", textAlign: "center" }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                Поддержка
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Помогаем ставить образовательные цели и отслеживать прогресс на
                каждом этапе
              </Typography>
            </Box>

            {/* Аналитика */}
            <Box
              sx={{ flex: "1 1 250px", maxWidth: "350px", textAlign: "center" }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "secondary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <SchoolIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                Аналитика
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Предоставляем актуальную информацию о вузах, направлениях и
                требованиях к поступлению
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* 4. CTA Section */}
      <Paper
        sx={{
          p: 8,
          textAlign: "center",
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Готовы выбрать свой образовательный путь?
        </Typography>
        <Typography sx={{ mb: 4, opacity: 0.95, maxWidth: 500, mx: "auto" }}>
          Присоединяйтесь к учащимся, которые уже строят свою траекторию
          осознанно и уверенно
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="/Pathway/profile"
          endIcon={<ArrowForwardIcon />}
          sx={{
            bgcolor: "white",
            color: "primary.main",
            fontWeight: "700",
            px: 6,
            py: 2,
            borderRadius: 3,
            fontSize: "1.1rem",
            "&:hover": {
              bgcolor: "grey.100",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Начать
        </Button>
      </Paper>
    </Container>
  );
}

export default HomePage;
