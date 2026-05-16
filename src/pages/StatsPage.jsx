import * as React from "react";
import {
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useAuth } from "../context/AuthContext";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalculateIcon from "@mui/icons-material/Calculate";
import CodeIcon from "@mui/icons-material/Code";
import PaletteIcon from "@mui/icons-material/Palette";
import SportsIcon from "@mui/icons-material/Sports";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import BookIcon from "@mui/icons-material/Book";
import ScienceIcon from "@mui/icons-material/Science";
import BuildIcon from "@mui/icons-material/Build";
import BusinessIcon from "@mui/icons-material/Business";

// Храним названия иконок, а не JSX
const hobbyIconNames = {
  IT: "CodeIcon",
  Творчество: "PaletteIcon",
  Спорт: "SportsIcon",
  Музыка: "MusicNoteIcon",
  Наука: "ScienceIcon",
  Чтение: "BookIcon",
  Инженерия: "BuildIcon",
  Бизнес: "BusinessIcon",
};

// Компонент для рендера иконки по имени
const RenderHobbyIcon = ({ name, sx }) => {
  const icons = {
    CodeIcon: <CodeIcon sx={sx} />,
    PaletteIcon: <PaletteIcon sx={sx} />,
    SportsIcon: <SportsIcon sx={sx} />,
    MusicNoteIcon: <MusicNoteIcon sx={sx} />,
    ScienceIcon: <ScienceIcon sx={sx} />,
    BookIcon: <BookIcon sx={sx} />,
    BuildIcon: <BuildIcon sx={sx} />,
    BusinessIcon: <BusinessIcon sx={sx} />,
  };
  return icons[name] || <PsychologyIcon sx={sx} />;
};

// Категоризация увлечений
const hobbyCategories = {
  Программирование: "IT",
  "Веб-разработка": "IT",
  "Создание игр": "IT",
  "Дизайн и графика": "Творчество",
  Видеомонтаж: "Творчество",
  Фотография: "Творчество",
  Рисование: "Творчество",
  "Спорт (командный)": "Спорт",
  "Спорт (индивидуальный)": "Спорт",
  "Музыка (игра на инструменте)": "Музыка",
  Пение: "Музыка",
  Танцы: "Творчество",
  "Научные эксперименты": "Наука",
  Робототехника: "Инженерия",
  "3D-моделирование": "IT",
  Чтение: "Чтение",
  "Написание текстов/стихов": "Творчество",
  "Изучение иностранных языков": "Наука",
  Кулинария: "Творчество",
  Рукоделие: "Творчество",
  Видеоблогинг: "Творчество",
  "Социальные проекты": "Бизнес",
  "Настольные игры": "Творчество",
  Шахматы: "Творчество",
  Путешествия: "Творчество",
  "Изучение истории": "Наука",
  Астрономия: "Наука",
  "Биология/природа": "Наука",
  Волонтёрство: "Бизнес",
};

// Категоризация интересов
const interestCategories = {
  IT: [
    "IT и программирование",
    "Веб-разработка",
    "Мобильная разработка",
    "Искусственный интеллект",
    "Кибербезопасность",
    "Анализ данных",
  ],
  Инженерия: ["Инженерия", "Архитектура и строительство"],
  Медицина: ["Медицина", "Фармацевтика", "Биотехнологии"],
  Экономика: [
    "Экономика и финансы",
    "Менеджмент и бизнес",
    "Маркетинг и реклама",
  ],
  Творчество: [
    "Дизайн и искусство",
    "Журналистика и медиа",
    "Кино и телевидение",
    "Музыка",
    "Фотография",
  ],
  Наука: ["Наука", "Экология"],
  Гуманитарные: [
    "Психология",
    "Педагогика",
    "Юриспруденция",
    "Политология",
    "Лингвистика и перевод",
  ],
};

function StatsPage() {
  const { userData } = useAuth();

  const averageGrade = React.useMemo(() => {
    if (!userData?.favoriteSubjects || userData.favoriteSubjects.length === 0)
      return 0;
    const sum = userData.favoriteSubjects.reduce(
      (acc, subj) => acc + parseFloat(subj.grade || 0),
      0,
    );
    return (sum / userData.favoriteSubjects.length).toFixed(1);
  }, [userData?.favoriteSubjects]);

  const hobbiesByCategory = React.useMemo(() => {
    if (!userData?.hobbies || userData.hobbies.length === 0) return {};
    const grouped = {};
    userData.hobbies.forEach((hobby) => {
      const category = hobbyCategories[hobby] || "Другое";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(hobby);
    });
    return grouped;
  }, [userData?.hobbies]);

  const interestsByCategory = React.useMemo(() => {
    if (!userData?.careerInterests || userData.careerInterests.length === 0)
      return {};
    const grouped = {};
    userData.careerInterests.forEach((interest) => {
      let foundCategory = "Другое";
      Object.entries(interestCategories).forEach(([category, items]) => {
        if (items.includes(interest)) foundCategory = category;
      });
      if (!grouped[foundCategory]) grouped[foundCategory] = [];
      grouped[foundCategory].push(interest);
    });
    return grouped;
  }, [userData?.careerInterests]);

  // График 1: Успеваемость по предметам (Column)
  const subjectsChartOptions = React.useMemo(() => {
    if (!userData?.favoriteSubjects || userData.favoriteSubjects.length === 0)
      return null;
    return {
      chart: { type: "column", height: 300 },
      title: {
        text: "📚 Твоя успеваемость",
        align: "left",
        style: { fontSize: "16px", fontWeight: "bold" },
      },
      credits: { enabled: false },
      xAxis: {
        categories: userData.favoriteSubjects.map((s) => s.name),
        labels: { rotation: -45, style: { fontSize: "11px" } },
      },
      yAxis: { min: 0, max: 5, title: { text: "Оценка" }, tickInterval: 1 },
      plotOptions: {
        column: {
          borderRadius: 8,
          dataLabels: { enabled: true },
          colorByPoint: true,
        },
      },
      colors: userData.favoriteSubjects.map((s) => {
        const grade = parseFloat(s.grade);
        if (grade >= 4.5) return "#4caf50";
        if (grade >= 4) return "#8bc34a";
        if (grade >= 3.5) return "#ffeb3b";
        if (grade >= 3) return "#ff9800";
        return "#f44336";
      }),
      series: [
        {
          name: "Оценка",
          data: userData.favoriteSubjects.map((s) => parseFloat(s.grade)),
        },
      ],
    };
  }, [userData?.favoriteSubjects]);

  // График 2: Баллы ЕГЭ (Column вместо Gauge)
  const egaChartOptions = React.useMemo(() => {
    if (!userData?.examScores || Object.keys(userData.examScores).length === 0)
      return null;
    const subjectNames = {
      math: "Математика",
      russian: "Русский язык",
      physics: "Физика",
      informatics: "Информатика",
      chemistry: "Химия",
      biology: "Биология",
      social: "Обществознание",
      history: "История",
      literature: "Литература",
      foreign: "Иностранный язык",
    };
    return {
      chart: { type: "column", height: 300 },
      title: {
        text: "🎯 Твои баллы ЕГЭ",
        align: "left",
        style: { fontSize: "16px", fontWeight: "bold" },
      },
      credits: { enabled: false },
      xAxis: {
        categories: Object.keys(userData.examScores).map(
          (k) => subjectNames[k] || k,
        ),
      },
      yAxis: { min: 0, max: 100, title: { text: "Баллы" } },
      plotOptions: {
        column: { borderRadius: 8, dataLabels: { enabled: true } },
      },
      colors: Object.values(userData.examScores).map((score) =>
        score >= 80 ? "#4caf50" : score >= 60 ? "#ff9800" : "#f44336",
      ),
      series: [{ name: "Балл", data: Object.values(userData.examScores) }],
    };
  }, [userData?.examScores]);

  // График 3: Распределение интересов (Pie)
  const interestsPieChartOptions = React.useMemo(() => {
    if (!userData?.careerInterests || userData.careerInterests.length === 0)
      return null;
    const data = Object.entries(interestsByCategory).map(
      ([category, items]) => ({ name: category, y: items.length }),
    );
    return {
      chart: { type: "pie", height: 300 },
      title: {
        text: "🎯 Твои интересы",
        align: "left",
        style: { fontSize: "16px", fontWeight: "bold" },
      },
      credits: { enabled: false },
      tooltip: { pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>" },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f}%",
          },
          showInLegend: true,
        },
      },
      series: [{ name: "Интересы", colorByPoint: true, data }],
    };
  }, [userData?.careerInterests, interestsByCategory]);

  // График 4: Увлечения по категориям (Bar)
  const hobbiesBarChartOptions = React.useMemo(() => {
    if (!userData?.hobbies || userData.hobbies.length === 0) return null;
    const data = Object.entries(hobbiesByCategory).map(([category, items]) => ({
      name: category,
      y: items.length,
    }));
    return {
      chart: { type: "bar", height: 300 },
      title: {
        text: "🎨 Увлечения по категориям",
        align: "left",
        style: { fontSize: "16px", fontWeight: "bold" },
      },
      credits: { enabled: false },
      xAxis: {
        categories: Object.keys(hobbiesByCategory),
        title: { text: null },
      },
      yAxis: { min: 0, title: { text: "Количество" } },
      plotOptions: { bar: { borderRadius: 8, dataLabels: { enabled: true } } },
      colors: [
        "#2196f3",
        "#e91e63",
        "#4caf50",
        "#9c27b0",
        "#ff9800",
        "#795548",
        "#607d8b",
        "#00bcd4",
      ],
      series: [{ name: "Увлечения", data }],
    };
  }, [userData?.hobbies, hobbiesByCategory]);

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📊 Твоя статистика
        </Typography>
        <Typography color="text.secondary">
          Анализируй свой прогресс и интересы
        </Typography>
      </Box>

      {/* Карточки статистики */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: "#2196f3", color: "white", borderRadius: 3 }}>
            <CardContent>
              <SchoolIcon sx={{ fontSize: 32, mb: 1, opacity: 0.8 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Средний балл
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {averageGrade}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: "#4caf50", color: "white", borderRadius: 3 }}>
            <CardContent>
              <EmojiEventsIcon sx={{ fontSize: 32, mb: 1, opacity: 0.8 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Достижения
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {userData?.achievements?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: "#ff9800", color: "white", borderRadius: 3 }}>
            <CardContent>
              <PsychologyIcon sx={{ fontSize: 32, mb: 1, opacity: 0.8 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Хобби
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {userData?.hobbies?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: "#03a9f4", color: "white", borderRadius: 3 }}>
            <CardContent>
              <TrendingUpIcon sx={{ fontSize: 32, mb: 1, opacity: 0.8 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Интересы
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {userData?.careerInterests?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: "#9c27b0", color: "white", borderRadius: 3 }}>
            <CardContent>
              <CalculateIcon sx={{ fontSize: 32, mb: 1, opacity: 0.8 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                ЕГЭ
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {Object.keys(userData?.examScores || {}).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 📊 График 1: Успеваемость */}
      {subjectsChartOptions && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={subjectsChartOptions}
          />
        </Paper>
      )}

      {/* 🎯 График 2: Баллы ЕГЭ */}
      {egaChartOptions && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <HighchartsReact highcharts={Highcharts} options={egaChartOptions} />
        </Paper>
      )}

      {/* 🎨 Grid с карточками увлечений */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          🎨 Твои увлечения
        </Typography>
        {userData && userData.hobbies && userData.hobbies.length > 0 ? (
          <Grid container spacing={2}>
            {Object.entries(hobbiesByCategory).map(([category, hobbies]) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Card
                  sx={{
                    height: "100%",
                    bgcolor: `${getCategoryColor(category)}.light`,
                    borderLeft: `4px solid ${getCategoryColor(category)}`,
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        color: `${getCategoryColor(category)}.main`,
                      }}
                    >
                      <RenderHobbyIcon
                        name={hobbyIconNames[category]}
                        sx={{ fontSize: 40 }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      align="center"
                      gutterBottom
                    >
                      {category}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        justifyContent: "center",
                      }}
                    >
                      {hobbies.map((hobby) => (
                        <Chip
                          key={hobby}
                          label={hobby}
                          size="small"
                          sx={{ bgcolor: "white", fontWeight: 500 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              bgcolor: "grey.50",
              borderRadius: 2,
            }}
          >
            <PsychologyIcon
              sx={{
                fontSize: 64,
                color: "text.secondary",
                opacity: 0.3,
                mb: 2,
              }}
            />
            <Typography color="text.secondary">
              Добавьте увлечения в профиле, чтобы увидеть их здесь
            </Typography>
          </Box>
        )}
      </Paper>

      {/* 📊 График 3: Распределение интересов */}
      {interestsPieChartOptions && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={interestsPieChartOptions}
          />
        </Paper>
      )}

      {/* 📊 График 4: Увлечения по категориям */}
      {hobbiesBarChartOptions && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={hobbiesBarChartOptions}
          />
        </Paper>
      )}

      {/* 💡 Инсайты */}
      <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "primary.light" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          💡 Инсайты
        </Typography>
        <Grid container spacing={2}>
          {userData?.favoriteSubjects &&
            userData.favoriteSubjects.length > 0 && (
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    📚 Твои сильные предметы:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {userData.favoriteSubjects
                      .filter((s) => parseFloat(s.grade) >= 4.5)
                      .map((s) => s.name)
                      .join(", ") || "Пока нет данных"}
                  </Typography>
                </Box>
              </Grid>
            )}
          {userData?.careerInterests && userData.careerInterests.length > 0 && (
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  🎯 Популярная категория:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {getMostPopularCategory(userData.careerInterests)}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
}

function getCategoryColor(category) {
  const colors = {
    IT: "#2196f3",
    Творчество: "#e91e63",
    Спорт: "#4caf50",
    Музыка: "#9c27b0",
    Наука: "#ff9800",
    Чтение: "#795548",
    Инженерия: "#607d8b",
    Бизнес: "#00bcd4",
  };
  return colors[category] || "#9e9e9e";
}

function getMostPopularCategory(interests) {
  const counts = {};
  interests.forEach((interest) => {
    Object.entries(interestCategories).forEach(([category, items]) => {
      if (items.includes(interest))
        counts[category] = (counts[category] || 0) + 1;
    });
  });
  const maxCategory = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return maxCategory ? maxCategory[0] : "Не определено";
}

export default StatsPage;
