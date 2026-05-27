import * as React from "react";
import {
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  TextField,
  Chip,
  Card,
  CardContent,
  Button,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkIcon from "@mui/icons-material/Work";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LanguageIcon from "@mui/icons-material/Language";

// ✅ ИМПОРТ ДАННЫХ ИЗ ЛОКАЛЬНОГО ФАЙЛА
import universitiesData from "../data/universities.json";

import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { DAILY_TASK_POOL, REST_TASKS } from "../utils/taskConstants";
import calculateRecommendations, {
  getAdmissionChanceText,
} from "../utils/recommendationAlgorithm";

const categories = [
  "ТОП",
  "Все",
  "IT",
  "Инженерия",
  "Медицина",
  "Экономика",
  "Наука",
  "Юриспруденция",
  "Психология",
  "Дизайн",
  "Медиа",
  "Биотехнологии",
  "Гуманитарные",
  "Международные",
];

// ✅ Вспомогательная функция: считаем сумму минимальных баллов
const calculateTotalMinScore = (direction) => {
  if (!direction.minScores) return 0;
  return Object.values(direction.minScores).reduce(
    (sum, score) => sum + score,
    0,
  );
};

// ✅ Вспомогательная функция: считаем сумму баллов пользователя
const calculateUserTotalScore = (userData, direction) => {
  if (!userData?.examScores || !direction.minScores) return 0;
  return Object.keys(direction.minScores).reduce((sum, subject) => {
    return sum + (userData.examScores[subject] || 0);
  }, 0);
};

function DirectionsPage() {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Все");
  const [showTopMatches, setShowTopMatches] = React.useState(false);
  const [selectedDirection, setSelectedDirection] = React.useState(null);
  const [selectedUniversity, setSelectedUniversity] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // ✅ БЕРЁМ ДАННЫЕ ПРЯМО ИЗ ЛОКАЛЬНОГО ФАЙЛА (без API)
  const universities = universitiesData.universities;

  // Получаем рекомендации
  const topRecommendations = React.useMemo(() => {
    if (!userData || !universities) return [];
    return calculateRecommendations(userData, universities);
  }, [userData, universities]);

  // Фильтрация
  const filteredData = React.useMemo(() => {
    if (!universities) return [];
    let data = universities;

    if (showTopMatches && topRecommendations.length > 0) {
      const recommendationsByUni = {};
      topRecommendations.forEach((rec) => {
        const uniId = rec.university.id;
        if (!recommendationsByUni[uniId]) recommendationsByUni[uniId] = [];
        recommendationsByUni[uniId].push(rec);
      });

      data = data
        .map((uni) => {
          const recs = recommendationsByUni[uni.id] || [];
          const topDirections = recs
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((rec) => rec.direction);
          return {
            ...uni,
            directions: topDirections,
            directionRecommendations: recs
              .sort((a, b) => b.score - a.score)
              .slice(0, 3),
          };
        })
        .filter((uni) => uni.directions.length > 0);
    }

    return data
      .map((uni) => ({
        ...uni,
        directions: uni.directions.filter((dir) => {
          const matchesSearch =
            searchTerm === "" ||
            dir.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            uni.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory =
            selectedCategory === "Все" || dir.category === selectedCategory;
          return matchesSearch && matchesCategory;
        }),
      }))
      .filter((uni) => uni.directions.length > 0);
  }, [
    universities,
    searchTerm,
    selectedCategory,
    showTopMatches,
    topRecommendations,
  ]);

  const handleCategoryChange = (category) => {
    if (category === "ТОП") {
      setShowTopMatches(true);
      setSelectedCategory("Все");
    } else {
      setShowTopMatches(false);
      setSelectedCategory(category);
    }
  };

  const handleShowDetails = (university, direction) => {
    setSelectedUniversity(university);
    setSelectedDirection(direction);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDirection(null);
    setSelectedUniversity(null);
  };

  const handleSetAsGoal = async (university, direction) => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    const today = new Date().toISOString().split("T")[0];
    const currentCategory = direction.category || "IT";
    const totalMinScore = calculateTotalMinScore(direction);

    const longTermTasks = [
      {
        id: 1,
        title: `Подготовиться к ЕГЭ (мин. ${totalMinScore} баллов)`,
        category: "ЕГЭ",
        completed: false,
      },
      {
        id: 2,
        title: `Изучить информацию о вузе ${university.name}`,
        category: "Информация",
        completed: false,
      },
      {
        id: 3,
        title: "Посетить день открытых дверей",
        category: "Информация",
        completed: false,
      },
      {
        id: 4,
        title: "Пройти онлайн-курс по направлению",
        category: "Навыки",
        completed: false,
      },
      {
        id: 5,
        title: "Написать эссе о выбранной профессии",
        category: "Рефлексия",
        completed: false,
      },
    ];

    const taskPool = DAILY_TASK_POOL[currentCategory] || DAILY_TASK_POOL.IT;
    const shuffled = [...taskPool].sort(() => 0.5 - Math.random());
    const newDailyTasks = shuffled.slice(0, 3).map((title, index) => ({
      id: `daily_${today}_${index}`,
      title,
      category: currentCategory,
      completed: false,
      date: today,
    }));

    if (Math.random() < 0.2) {
      const restTask =
        REST_TASKS[Math.floor(Math.random() * REST_TASKS.length)];
      newDailyTasks.push({
        id: `daily_${today}_rest`,
        title: restTask,
        category: "Отдых",
        completed: false,
        date: today,
      });
    }

    await updateDoc(userRef, {
      goal: {
        direction,
        university: university.name,
        selectedAt: today,
        longTermTasks,
      },
      dailyTasks: newDailyTasks,
    });

    alert(
      `✅ Цель установлена: ${direction.name}\nЕжедневные задачи обновлены!`,
    );
  };

  // ✅ Убрали isLoading и error — данные загружаются мгновенно из локального файла

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🎓Направления и вузы
        </Typography>
        <Typography color="text.secondary" variant="body1">
          {showTopMatches
            ? "Персональные рекомендации"
            : `Найдено: ${filteredData.length} университетов`}
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Поиск направления или вуза..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => handleCategoryChange(category)}
            color={
              (showTopMatches && category === "ТОП") ||
              (!showTopMatches && selectedCategory === category)
                ? "primary"
                : "default"
            }
            variant={
              (showTopMatches && category === "ТОП") ||
              (!showTopMatches && selectedCategory === category)
                ? "filled"
                : "outlined"
            }
            sx={{ fontWeight: 600 }}
          />
        ))}
      </Box>

      {showTopMatches && topRecommendations.length > 0 && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "success.light",
            borderLeft: "4px solid #2e7d32",
          }}
        >
          <Typography variant="body2" fontWeight="bold" color="success.dark">
            ✨ Показаны лучшие направления в каждом вузе (топ-3)
          </Typography>
        </Paper>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {filteredData.map((university) => (
          <Card
            key={university.id}
            sx={{
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                boxShadow: 8,
                borderColor: "primary.main",
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {university.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      mt: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationOnIcon
                        sx={{ fontSize: 18, mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {university.city}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <StarIcon
                        sx={{ fontSize: 18, mr: 0.5, color: "warning.main" }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="warning.main"
                      >
                        {university.rating}/100
                      </Typography>
                    </Box>
                    <Chip
                      label={university.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Направления ({university.directions.length})
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {university.directions.map((direction) => {
                  const recommendation =
                    showTopMatches && university.directionRecommendations
                      ? university.directionRecommendations.find(
                          (rec) => rec.direction.id === direction.id,
                        )
                      : null;
                  const score =
                    recommendation && !isNaN(recommendation.score)
                      ? recommendation.score
                      : null;
                  const totalMinScore = calculateTotalMinScore(direction);
                  const userTotalScore = calculateUserTotalScore(
                    userData,
                    direction,
                  );
                  const meetsRequirements = userTotalScore >= totalMinScore;

                  return (
                    <Paper
                      key={direction.id}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: "grey.50",
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          bgcolor: "primary.light",
                          borderColor: "primary.main",
                          "& .direction-title, & .direction-category, & .direction-info":
                            { color: "primary.contrastText" },
                        },
                        transition: "all 0.2s",
                        position: "relative",
                      }}
                    >
                      {score !== null && showTopMatches && (
                        <Chip
                          label={`🎯 ${score}%`}
                          color={
                            score >= 70
                              ? "success"
                              : score >= 50
                                ? "warning"
                                : "default"
                          }
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 120,
                            fontWeight: "bold",
                            zIndex: 1,
                          }}
                        />
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                          flexWrap: "wrap",
                          gap: 2,
                          pr: score !== null ? 14 : 0,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Chip
                            label={direction.category}
                            size="small"
                            className="direction-category"
                            sx={{ mb: 1, height: 24, fontWeight: "bold" }}
                          />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                            className="direction-title"
                          >
                            {direction.name}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleShowDetails(university, direction)
                          }
                          sx={{ zIndex: 2 }}
                        >
                          Подробнее
                        </Button>
                      </Box>

                      <Box sx={{ mb: 2 }} className="direction-info">
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          gutterBottom
                        >
                          📊 Минимальные баллы ЕГЭ (сумма):
                        </Typography>
                        <Chip
                          label={`${totalMinScore} баллов ${userData ? `(у вас: ${userTotalScore})` : ""}`}
                          size="small"
                          sx={{
                            borderRadius: 2,
                            bgcolor: meetsRequirements ? "#e8f5e9" : "#ffebee",
                            color: meetsRequirements ? "#2e7d32" : "#c62828",
                            fontWeight: "bold",
                            border: `1px solid ${meetsRequirements ? "#4caf50" : "#f44336"}`,
                          }}
                        />
                        {userData && (
                          <Typography
                            variant="caption"
                            sx={{
                              ml: 1,
                              color: meetsRequirements
                                ? "success.main"
                                : "error.main",
                              fontWeight: "bold",
                            }}
                          >
                            {meetsRequirements
                              ? "✓ Хватает баллов"
                              : "✗ Не хватает баллов"}
                          </Typography>
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 2,
                          pt: 2,
                          borderTop: "1px solid rgba(0,0,0,0.1)",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 3 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontWeight: "bold",
                            }}
                            className="direction-info"
                          >
                            📍 Бюджет:{" "}
                            <span style={{ color: "#2e7d32", marginLeft: 4 }}>
                              {direction.budgetPlaces} мест
                            </span>
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontWeight: "bold",
                            }}
                            className="direction-info"
                          >
                            ⏱ Длительность:{" "}
                            <span style={{ marginLeft: 4 }}>
                              {direction.duration}
                            </span>
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            fontWeight: "bold",
                            color: "primary.main",
                          }}
                          className="direction-info"
                        >
                          <MonetizationOnIcon sx={{ mr: 0.5 }} />
                          {(
                            (direction.cost || direction.costPerYear || 0) /
                            1000
                          ).toFixed(0)}
                          к ₽/год
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Модалка с деталями */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedDirection &&
          selectedUniversity &&
          (() => {
            const recommendation = topRecommendations.find(
              (rec) =>
                rec.university.id === selectedUniversity.id &&
                rec.direction.id === selectedDirection.id,
            );
            const chanceInfo = recommendation
              ? getAdmissionChanceText(recommendation.admissionChance)
              : null;
            const totalMinScore = calculateTotalMinScore(selectedDirection);
            const userTotalScore = calculateUserTotalScore(
              userData,
              selectedDirection,
            );
            const meetsRequirements = userTotalScore >= totalMinScore;

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
              creative: "Творческий экзамен",
            };

            return (
              <>
                <DialogTitle
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedDirection.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {selectedUniversity.name}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={handleCloseDialog}
                    size="small"
                    sx={{ color: "white" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                  <Chip
                    label={selectedDirection.category}
                    color="primary"
                    sx={{ mb: 2, fontWeight: "bold" }}
                  />

                  {recommendation && !isNaN(recommendation.score) && (
                    <Paper
                      sx={{
                        p: 2,
                        mb: 3,
                        bgcolor: "primary.light",
                        color: "primary.contrastText",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        🎯 Твой персональный рейтинг
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-around",
                          textAlign: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="h3" fontWeight="bold">
                            {Math.min(recommendation.score, 100)}%
                          </Typography>
                          <Typography variant="body2">Совпадение</Typography>
                        </Box>
                        {chanceInfo && (
                          <Box>
                            <Typography variant="h3">
                              {chanceInfo.emoji}
                            </Typography>
                            <Typography variant="body2">
                              {chanceInfo.text}
                            </Typography>
                            <Typography variant="caption">
                              шанс поступления
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            📊 ЕГЭ:{" "}
                            {Math.min(recommendation.details.examMatch, 100)}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            ❤️ Предметы: {recommendation.details.subjectMatch}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            🎯 Интересы: {recommendation.details.interestMatch}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            🎨 Хобби: {recommendation.details.hobbyMatch}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  )}

                  {/* Список предметов ЕГЭ */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      📋 Необходимые предметы ЕГЭ
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                      <List>
                        {Object.entries(selectedDirection.minScores || {}).map(
                          ([subject, score]) => {
                            const userScore =
                              userData?.examScores?.[subject] || 0;
                            const meetsRequirement = userScore >= score;
                            return (
                              <ListItem
                                key={subject}
                                sx={{
                                  bgcolor: "white",
                                  mb: 1,
                                  borderRadius: 1,
                                }}
                              >
                                <ListItemIcon>
                                  <CheckCircleIcon
                                    color={
                                      meetsRequirement ? "success" : "error"
                                    }
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={subjectNames[subject] || subject}
                                  secondary={`Минимальный балл: ${score}`}
                                />
                                <Box sx={{ textAlign: "right" }}>
                                  <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    color={
                                      meetsRequirement
                                        ? "success.main"
                                        : "error.main"
                                    }
                                  >
                                    {userScore > 0 ? userScore : "—"}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    из {score}
                                  </Typography>
                                </Box>
                              </ListItem>
                            );
                          },
                        )}
                      </List>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          bgcolor: meetsRequirements ? "#e8f5e9" : "#ffebee",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          Общая сумма:
                        </Typography>
                        <Chip
                          label={`${totalMinScore} баллов`}
                          size="small"
                          sx={{
                            bgcolor: meetsRequirements ? "#c8e6c9" : "#ffcdd2",
                            color: meetsRequirements ? "#2e7d32" : "#c62828",
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                    </Paper>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      📊 Минимальный проходной балл
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label={`${totalMinScore} баллов (сумма)`}
                          sx={{
                            borderRadius: 2,
                            bgcolor: meetsRequirements ? "#e8f5e9" : "#ffebee",
                            color: meetsRequirements ? "#2e7d32" : "#c62828",
                            fontWeight: "bold",
                          }}
                        />
                        {userData && (
                          <>
                            <Chip
                              label={`Ваши баллы: ${userTotalScore}`}
                              sx={{
                                borderRadius: 2,
                                bgcolor: meetsRequirements
                                  ? "#c8e6c9"
                                  : "#ffcdd2",
                                fontWeight: "bold",
                              }}
                            />
                            <Typography
                              variant="body2"
                              color={
                                meetsRequirements
                                  ? "success.main"
                                  : "error.main"
                              }
                              fontWeight="bold"
                            >
                              {meetsRequirements
                                ? "✓ Достаточно баллов для поступления"
                                : "✗ Не хватает баллов"}
                            </Typography>
                          </>
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Для поступления необходимо набрать указанную сумму
                        баллов по всем предметам
                      </Typography>
                    </Paper>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: "success.light",
                          color: "success.contrastText",
                          textAlign: "center",
                        }}
                      >
                        <AccountBalanceIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold">
                          {selectedDirection.budgetPlaces}
                        </Typography>
                        <Typography variant="body2">Бюджетных мест</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                          textAlign: "center",
                        }}
                      >
                        <MonetizationOnIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold">
                          {(
                            (selectedDirection.cost ||
                              selectedDirection.costPerYear ||
                              0) / 1000
                          ).toFixed(0)}
                          к ₽
                        </Typography>
                        <Typography variant="body2">Стоимость в год</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "info.light",
                      color: "info.contrastText",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <WorkIcon sx={{ mr: 1 }} />{" "}
                      <strong>Длительность обучения:</strong>{" "}
                      {selectedDirection.duration}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <LocationOnIcon sx={{ mr: 1 }} /> <strong>Город:</strong>{" "}
                      {selectedUniversity.city}
                    </Typography>
                  </Paper>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      💡 Полезная информация
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "warning.light" }}>
                      <Typography variant="body2">
                        <strong>Совет:</strong> Для повышения шансов на
                        поступление рекомендуется иметь баллы на 5-10 пунктов
                        выше минимальных.
                      </Typography>
                    </Paper>
                  </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
                  <Button onClick={handleCloseDialog} variant="outlined">
                    Закрыть
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      handleSetAsGoal(selectedUniversity, selectedDirection);
                      handleCloseDialog();
                      navigate("/goals");
                    }}
                    startIcon={<EmojiEventsIcon />}
                  >
                    Выбрать целью
                  </Button>
                  <Button
                    variant="contained"
                    href={selectedUniversity?.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<LanguageIcon />}
                    disabled={!selectedUniversity?.website}
                  >
                    Перейти на сайт вуза
                  </Button>
                </DialogActions>
              </>
            );
          })()}
      </Dialog>

      {filteredData.length === 0 && (
        <Paper sx={{ p: 6, textAlign: "center", mt: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            🔍 По вашему запросу ничего не найдено
          </Typography>
          <Typography color="text.secondary">
            Попробуйте изменить параметры поиска
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default DirectionsPage;
