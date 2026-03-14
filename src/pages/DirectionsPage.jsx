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
  CircularProgress,
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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkIcon from "@mui/icons-material/Work";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useQuery } from "@tanstack/react-query";
import { getAllUniversities } from "../services/universitiesApi";
import calculateRecommendations, {
  getAdmissionChanceText,
} from "../utils/recommendationAlgorithm";
import { useAuth } from "../context/AuthContext";

const categories = [
  "Твой ТОП",
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

function DirectionsPage() {
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Все");
  const [showTopMatches, setShowTopMatches] = React.useState(false);
  const [selectedDirection, setSelectedDirection] = React.useState(null);
  const [selectedUniversity, setSelectedUniversity] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const {
    data: universities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["universities"],
    queryFn: getAllUniversities,
  });

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
      // Группируем рекомендации по вузам
      const recommendationsByUni = {};

      topRecommendations.forEach((rec) => {
        const uniId = rec.university.id;
        if (!recommendationsByUni[uniId]) {
          recommendationsByUni[uniId] = [];
        }
        recommendationsByUni[uniId].push(rec);
      });

      // Для каждого вуза берём топ-3 направления
      data = data
        .map((uni) => {
          const recs = recommendationsByUni[uni.id] || [];
          // Сортируем по score и берём топ-3
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
    if (category === "Твой ТОП") {
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

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Загрузка направлений...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">Ошибка загрузки данных: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🎓 Направления и вузы
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
              (showTopMatches && category === "Твой ТОП") ||
              (!showTopMatches && selectedCategory === category)
                ? "primary"
                : "default"
            }
            variant={
              (showTopMatches && category === "Твой ТОП") ||
              (!showTopMatches && selectedCategory === category)
                ? "filled"
                : "outlined"
            }
            sx={{
              fontWeight: 600,
            }}
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
                  // Получаем рекомендацию для этого направления
                  const recommendation =
                    showTopMatches && university.directionRecommendations
                      ? university.directionRecommendations.find(
                          (rec) => rec.direction.id === direction.id,
                        )
                      : null;

                  // Проверяем, что score существует и это число
                  const score =
                    recommendation && !isNaN(recommendation.score)
                      ? recommendation.score
                      : null;

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
                          "& *": { color: "primary.contrastText" },
                        },
                        transition: "all 0.2s",
                        position: "relative",
                      }}
                    >
                      {/* Показываем chip только если есть валидный score */}
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
                            sx={{ mb: 1, height: 24, fontWeight: "bold" }}
                          />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
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

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          gutterBottom
                        >
                          📊 Минимальные баллы ЕГЭ:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          {Object.entries(direction.minScores).map(
                            ([subject, minScore]) => {
                              const userScore =
                                userData?.examScores?.[subject] || 0;
                              const meetsRequirement = userScore >= minScore;

                              return (
                                <Chip
                                  key={subject}
                                  label={`${subjectNames[subject] || subject}: ${minScore}`}
                                  size="small"
                                  color={meetsRequirement ? "success" : "error"}
                                  variant="outlined"
                                  sx={{
                                    fontWeight: "bold",
                                    bgcolor: meetsRequirement
                                      ? "rgba(76, 175, 80, 0.08)"
                                      : "rgba(244, 67, 54, 0.08)",
                                  }}
                                />
                              );
                            },
                          )}
                        </Box>
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
                        >
                          <AttachMoneyIcon sx={{ mr: 0.5 }} />
                          {(direction.cost / 1000).toFixed(0)}к ₽/год
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

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      📋 Требования ЕГЭ
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                      <List>
                        {Object.entries(selectedDirection.minScores).map(
                          ([subject, score]) => (
                            <ListItem key={subject}>
                              <ListItemIcon>
                                <CheckCircleIcon
                                  color={score >= 85 ? "success" : "primary"}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={subjectNames[subject] || subject}
                                secondary={`Минимальный балл: ${score}`}
                              />
                              <Typography variant="h6" fontWeight="bold">
                                {score}
                              </Typography>
                            </ListItem>
                          ),
                        )}
                      </List>
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
                        <AttachMoneyIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold">
                          {(selectedDirection.cost / 1000).toFixed(0)}к ₽
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
                      <WorkIcon sx={{ mr: 1 }} />
                      <strong>Длительность обучения:</strong>{" "}
                      {selectedDirection.duration}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <LocationOnIcon sx={{ mr: 1 }} />
                      <strong>Город:</strong> {selectedUniversity.city}
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

                <DialogActions sx={{ p: 3, pt: 0 }}>
                  <Button onClick={handleCloseDialog} variant="outlined">
                    Закрыть
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (selectedUniversity?.website)
                        window.open(selectedUniversity.website, "_blank");
                    }}
                    startIcon={<LocationOnIcon />}
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
