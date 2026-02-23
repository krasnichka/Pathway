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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import InputAdornment from "@mui/material/InputAdornment";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import directionsData from "../data/directions.json";

// Иконки для категорий
const categoryIcons = {
  IT: "💻",
  Инженерия: "⚙️",
  Медицина: "🏥",
  Экономика: "💰",
  Наука: "🔬",
  Творчество: "🎨",
};

const categories = [
  "Все",
  "IT",
  "Инженерия",
  "Медицина",
  "Экономика",
  "Наука",
  "Творчество",
];

function DirectionsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Все");

  const filteredDirections = directionsData.filter((direction) => {
    const matchesSearch =
      direction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      direction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Все" || direction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🎓 Направления и вузы
        </Typography>
        <Typography color="text.secondary" variant="body1">
          Популярные направления для поступления в 2024 году
        </Typography>
      </Box>

      {/* Поиск */}
      <TextField
        fullWidth
        placeholder="Поиск направления..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3, maxWidth: 600 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Фильтр по категориям */}
      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => setSelectedCategory(category)}
            color={selectedCategory === category ? "primary" : "default"}
            variant={selectedCategory === category ? "filled" : "outlined"}
            sx={{ fontWeight: selectedCategory === category ? 600 : 400 }}
          />
        ))}
      </Box>

      {/* Карточки направлений */}
      <Grid container spacing={3}>
        {filteredDirections.map((direction) => (
          <Grid item xs={12} sm={6} md={4} key={direction.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: `0 12px 40px ${direction.color}40`,
                  borderColor: direction.color,
                },
              }}
            >
              {/* Шапка карточки с градиентом */}
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${direction.color}15 0%, ${direction.color}05 100%)`,
                  p: 2.5,
                  borderBottom: `3px solid ${direction.color}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      fontSize: 36,
                      mr: 2,
                      width: 56,
                      height: 56,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "white",
                      borderRadius: 2,
                      boxShadow: 2,
                    }}
                  >
                    {categoryIcons[direction.category]}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ lineHeight: 1.2 }}
                    >
                      {direction.title}
                    </Typography>
                  </Box>
                  {direction.popular && (
                    <Chip
                      icon={<StarIcon />}
                      label="ТОП"
                      size="small"
                      color="warning"
                      sx={{ fontWeight: "bold" }}
                    />
                  )}
                </Box>
                <Chip
                  label={direction.category}
                  size="small"
                  sx={{
                    bgcolor: `${direction.color}20`,
                    color: direction.color,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>

              {/* Контент карточки */}
              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Typography
                  color="text.secondary"
                  sx={{ mb: 2.5, lineHeight: 1.5, minHeight: 60 }}
                >
                  {direction.description}
                </Typography>

                {/* Вузы */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      color: "text.primary",
                    }}
                  >
                    <SchoolIcon sx={{ mr: 1, fontSize: 18, color: direction.color }} />
                    <Typography variant="body2" fontWeight="bold">
                      Топ вузы:
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {direction.universities.slice(0, 3).map((uni, index) => (
                      <Chip
                        key={index}
                        label={uni}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    ))}
                    {direction.universities.length > 3 && (
                      <Chip
                        label={`+${direction.universities.length - 3}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Минимальные баллы */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: `${direction.color}10`,
                    p: 1.5,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TrendingUpIcon
                      sx={{ mr: 1, fontSize: 20, color: direction.color }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      Мин. баллы:
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: direction.color }}
                  >
                    {direction.minScore}+
                  </Typography>
                </Box>
              </CardContent>

              {/* Кнопка */}
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: direction.color,
                    color: "white",
                    fontWeight: 600,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      bgcolor: direction.color,
                      opacity: 0.9,
                    },
                  }}
                >
                  Подробнее о направлении
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Если ничего не найдено */}
      {filteredDirections.length === 0 && (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            mt: 3,
            borderRadius: 3,
            bgcolor: "grey.50",
          }}
        >
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