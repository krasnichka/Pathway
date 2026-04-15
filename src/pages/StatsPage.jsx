import * as React from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PsychologyIcon from "@mui/icons-material/Psychology";

function StatsPage() {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Загрузка статистики...</Typography>
      </Container>
    );
  }

  if (!userData || !userData.grade) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          📝 Заполни профиль, чтобы увидеть персональную статистику
        </Alert>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Пока нет данных для отображения
          </Typography>
          <Typography color="text.secondary">
            Перейди в профиль и укажи свои оценки, интересы и достижения
          </Typography>
        </Paper>
      </Container>
    );
  }

  // --- ДАННЫЕ ДЛЯ ГРАФИКОВ ---

  // 1. График изменения интересов (симуляция на основе хобби и интересов)
  const interestChartData = {
    chart: {
      type: "spline",
      height: 350,
    },
    title: {
      text: "🎯 Динамика твоих интересов",
      align: "left",
    },
    xAxis: {
      categories: [
        "5 класс",
        "6 класс",
        "7 класс",
        "8 класс",
        "9 класс",
        "10 класс",
        "11 класс",
      ],
    },
    yAxis: {
      title: {
        text: "Уровень интереса (%)",
      },
      min: 0,
      max: 100,
    },
    tooltip: {
      valueSuffix: "%",
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 6,
        },
      },
    },
    series: generateInterestSeries(userData),
    credits: {
      enabled: false,
    },
  };

  // 2. График успеваемости по предметам
  const gradesChartData = {
    chart: {
      type: "column",
      height: 350,
    },
    title: {
      text: "📚 Твоя успеваемость по предметам",
      align: "left",
    },
    xAxis: {
      categories: userData.favoriteSubjects?.map((s) => s.name) || [],
      labels: {
        rotation: -45,
      },
    },
    yAxis: {
      title: {
        text: "Оценка",
      },
      min: 0,
      max: 5,
      tickInterval: 1,
    },
    plotOptions: {
      column: {
        borderRadius: 8,
        dataLabels: {
          enabled: true,
          format: "{y}",
        },
      },
    },
    series: [
      {
        name: "Твоя оценка",
        color: "#1976d2",
        data: userData.favoriteSubjects?.map((s) => parseInt(s.grade)) || [],
      },
    ],
    credits: {
      enabled: false,
    },
  };

  // 3. График баллов ЕГЭ vs проходные
  const examChartData = {
    chart: {
      type: "bar",
      height: 400,
    },
    title: {
      text: "📊 Твои баллы ЕГЭ vs Минимальные требования",
      align: "left",
    },
    xAxis: {
      categories: Object.keys(userData.examScores || {}).map((key) => {
        const names = {
          math: "Математика",
          russian: "Русский язык",
          physics: "Физика",
          informatics: "Информатика",
          chemistry: "Химия",
          biology: "Биология",
          social: "Общество",
          history: "История",
          literature: "Литература",
          foreign: "Иностранный",
        };
        return names[key] || key;
      }),
    },
    yAxis: {
      title: {
        text: "Баллы",
      },
      min: 0,
      max: 100,
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        name: "Твои баллы",
        color: "#2e7d32",
        data: Object.values(userData.examScores || {}),
      },
      {
        name: "Средний проходной",
        color: "#ff9800",
        data: Object.values(userData.examScores || {}).map(() => 75),
      },
    ],
    credits: {
      enabled: false,
    },
  };

  // 4. Распределение времени (хобби)
  const hobbiesChartData = {
    chart: {
      type: "pie",
      height: 350,
    },
    title: {
      text: "🎨 Твои увлечения",
      align: "left",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Хобби",
        colorByPoint: true,
        data: (userData.hobbies || []).map((hobby, index) => ({
          name: hobby,
          y: Math.floor(Math.random() * 30) + 10, // Симуляция времени
        })),
      },
    ],
    credits: {
      enabled: false,
    },
  };

  // --- СТАТИСТИКА ---
  const stats = {
    avgGrade:
      userData.favoriteSubjects?.reduce(
        (acc, s) => acc + parseInt(s.grade),
        0,
      ) / userData.favoriteSubjects?.length || 0,
    totalAchievements: userData.achievements?.length || 0,
    totalHobbies: userData.hobbies?.length || 0,
    totalInterests: userData.careerInterests?.length || 0,
    examSubjects: Object.keys(userData.examScores || {}).length,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📊 Твоя статистика
        </Typography>
        <Typography color="text.secondary">
          Анализируй свой прогресс и интересы
        </Typography>
      </Box>

      {/* Карточки со статистикой */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <SchoolIcon sx={{ mr: 1 }} />
                <Typography variant="body2">Средний балл</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats.avgGrade.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{ bgcolor: "success.light", color: "success.contrastText" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <EmojiEventsIcon sx={{ mr: 1 }} />
                <Typography variant="body2">Достижения</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats.totalAchievements}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{ bgcolor: "warning.light", color: "warning.contrastText" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PsychologyIcon sx={{ mr: 1 }} />
                <Typography variant="body2">Хобби</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats.totalHobbies}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: "info.light", color: "info.contrastText" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="body2">Интересы</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats.totalInterests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{ bgcolor: "secondary.light", color: "secondary.contrastText" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <SchoolIcon sx={{ mr: 1 }} />
                <Typography variant="body2">ЕГЭ</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats.examSubjects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Графики */}
      <Grid container spacing={3}>
        {/* График интересов */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={interestChartData}
            />
          </Paper>
        </Grid>

        {/* График успеваемости */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={gradesChartData}
            />
          </Paper>
        </Grid>

        {/* График ЕГЭ */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <HighchartsReact highcharts={Highcharts} options={examChartData} />
          </Paper>
        </Grid>

        {/* График хобби */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={hobbiesChartData}
            />
          </Paper>
        </Grid>

        {/* Рекомендации */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              💡 Инсайты на основе твоих данных
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              {stats.avgGrade >= 4.5 && (
                <Alert severity="success" icon={<TrendingUpIcon />}>
                  <strong>Отличная успеваемость!</strong> Ты можешь претендовать
                  на бюджетные места в топовых вузах.
                </Alert>
              )}
              {stats.totalAchievements >= 3 && (
                <Alert severity="success" icon={<EmojiEventsIcon />}>
                  <strong>Много достижений!</strong> Это даст дополнительные
                  баллы при поступлении.
                </Alert>
              )}
              {stats.examSubjects >= 3 && (
                <Alert severity="info" icon={<SchoolIcon />}>
                  <strong>Хороший набор предметов!</strong> У тебя есть выбор из
                  множества направлений.
                </Alert>
              )}
              {stats.avgGrade < 4 && (
                <Alert severity="warning" icon={<TrendingUpIcon />}>
                  <strong>Есть куда расти!</strong> Сосредоточься на ключевых
                  предметах для твоего направления.
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

// --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ---
function generateInterestSeries(userData) {
  const categories = {
    IT: "#2196f3",
    Инженерия: "#ff9800",
    Медицина: "#f44336",
    Экономика: "#4caf50",
    Наука: "#9c27b0",
    Дизайн: "#e91e63",
    Юриспруденция: "#3f51b5",
    Психология: "#00bcd4",
    Медиа: "#ff5722",
    Гуманитарные: "#795548",
  };

  const interests = userData.careerInterests || [];

  if (interests.length === 0) {
    return [
      {
        name: "Интерес",
        color: "#1976d2",
        data: [30, 40, 50, 60, 70, 80, 85],
      },
    ];
  }

  return interests.slice(0, 3).map((interest, index) => {
    // Находим категорию для интереса
    let category = "IT";
    Object.keys(categories).forEach((key) => {
      if (interest.includes(key)) category = key;
    });

    // Генерируем данные с ростом
    const baseValue = 30 + index * 10;
    const data = [];
    for (let i = 0; i < 7; i++) {
      data.push(Math.min(baseValue + i * 8 + Math.random() * 10, 100));
    }

    return {
      name: interest,
      color: categories[category] || "#1976d2",
      data,
    };
  });
}

export default StatsPage;
