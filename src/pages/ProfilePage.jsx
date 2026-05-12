import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Alert,
  Card,
  CardContent,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WorkIcon from "@mui/icons-material/Work";
import CheckIcon from "@mui/icons-material/Check";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Списки опций
const SUBJECTS = [
  "Математика",
  "Русский язык",
  "Физика",
  "Химия",
  "Биология",
  "Информатика",
  "История",
  "Обществознание",
  "Литература",
  "Иностранный язык",
  "География",
  "Астрономия",
  "ОБЖ",
];
const GRADES = ["2", "3", "4", "5"];
const EXAM_SUBJECTS = [
  { id: "math", name: "Математика", required: true },
  { id: "russian", name: "Русский язык", required: true },
  { id: "physics", name: "Физика", required: false },
  { id: "chemistry", name: "Химия", required: false },
  { id: "biology", name: "Биология", required: false },
  { id: "informatics", name: "Информатика", required: false },
  { id: "history", name: "История", required: false },
  { id: "social", name: "Обществознание", required: false },
  { id: "literature", name: "Литература", required: false },
  { id: "english", name: "Иностранный язык", required: false },
  { id: "geography", name: "География", required: false },
];
const ACHIEVEMENTS_OPTIONS = [
  "Победитель олимпиады (школьный этап)",
  "Победитель олимпиады (муниципальный этап)",
  "Победитель олимпиады (региональный этап)",
  "Победитель олимпиады (всероссийский этап)",
  "Призёр олимпиады (школьный этап)",
  "Призёр олимпиады (муниципальный этап)",
  "Призёр олимпиады (региональный этап)",
  "Призёр олимпиады (всероссийский этап)",
  "Участник научной конференции",
  "Победитель научной конференции",
  "Участник хакатона/конкурса проектов",
  "Победитель хакатона/конкурса проектов",
  "Волонтёрская деятельность",
  "Спортивные достижения",
  "Творческие конкурсы и фестивали",
  "Сертификаты о прохождении курсов",
  "Собственные проекты (сайт, приложение и др.)",
  "Публикации в СМИ/научных журналах",
];
const HOBBIES_OPTIONS = [
  "Программирование",
  "Веб-разработка",
  "Создание игр",
  "Дизайн и графика",
  "Видеомонтаж",
  "Фотография",
  "Чтение",
  "Написание текстов/стихов",
  "Изучение иностранных языков",
  "Спорт (командный)",
  "Спорт (индивидуальный)",
  "Музыка (игра на инструменте)",
  "Пение",
  "Танцы",
  "Рисование",
  "Рукоделие",
  "Кулинария",
  "Научные эксперименты",
  "Робототехника",
  "3D-моделирование",
  "Видеоблогинг",
  "Социальные проекты",
  "Настольные игры",
  "Шахматы",
  "Путешествия",
  "Изучение истории",
  "Астрономия",
  "Биология/природа",
  "Волонтёрство",
];
const CAREER_INTERESTS_OPTIONS = [
  "IT и программирование",
  "Веб-разработка",
  "Мобильная разработка",
  "Искусственный интеллект",
  "Кибербезопасность",
  "Анализ данных",
  "Медицина",
  "Инженерия",
  "Архитектура и строительство",
  "Дизайн и искусство",
  "Журналистика и медиа",
  "Психология",
  "Педагогика",
  "Экономика и финансы",
  "Менеджмент и бизнес",
  "Маркетинг и реклама",
  "Юриспруденция",
  "Политология",
  "Биотехнологии",
  "Экология",
  "Фармацевтика",
  "Спорт и фитнес",
  "Кулинария",
  "Туризм и гостиничный бизнес",
  "Лингвистика и перевод",
  "Кино и телевидение",
  "Музыка",
  "Фотография",
  "Игровая индустрия",
  "Космонавтика",
];

function ProfilePage() {
  const { currentUser, userData, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState({
    grade: false,
    subjects: false,
    exams: false,
    achievements: false,
    hobbies: false,
    interests: false,
  });

  // Временные состояния для редактирования
  const [tempGrade, setTempGrade] = useState("");
  const [tempFavoriteSubjects, setTempFavoriteSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [newSubjectGrade, setNewSubjectGrade] = useState("5");
  const [tempExamScores, setTempExamScores] = useState({});
  const [tempAchievements, setTempAchievements] = useState([]);
  const [tempHobbies, setTempHobbies] = useState([]);
  const [tempCareerInterests, setTempCareerInterests] = useState([]);

  // Загрузка данных
  useEffect(() => {
    if (userData) {
      setTempGrade(userData.grade || "");
      setTempFavoriteSubjects(userData.favoriteSubjects || []);
      setTempExamScores(userData.examScores || {});
      setTempAchievements(userData.achievements || []);
      setTempHobbies(userData.hobbies || []);
      setTempCareerInterests(userData.careerInterests || []);
    }
  }, [userData]);

  const toggleEditMode = (field) => {
    if (!editMode[field]) {
      if (field === "grade") setTempGrade(userData?.grade || "");
      if (field === "subjects")
        setTempFavoriteSubjects(userData?.favoriteSubjects || []);
      if (field === "exams") setTempExamScores(userData?.examScores || {});
      if (field === "achievements")
        setTempAchievements(userData?.achievements || []);
      if (field === "hobbies") setTempHobbies(userData?.hobbies || []);
      if (field === "interests")
        setTempCareerInterests(userData?.careerInterests || []);
    }
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleAddSubject = () => {
    if (
      newSubject &&
      !tempFavoriteSubjects.find((s) => s.name === newSubject)
    ) {
      setTempFavoriteSubjects([
        ...tempFavoriteSubjects,
        { name: newSubject, grade: newSubjectGrade },
      ]);
      setNewSubject("");
      setNewSubjectGrade("5");
    }
  };

  const handleRemoveSubject = (name) => {
    setTempFavoriteSubjects(
      tempFavoriteSubjects.filter((s) => s.name !== name),
    );
  };

  const handleExamScoreChange = (id, value) => {
    if (value === "" || /^\d{0,3}$/.test(value)) {
      const numValue = value === "" ? "" : Math.min(100, parseInt(value, 10));
      setTempExamScores({ ...tempExamScores, [id]: numValue });
    }
  };

  const toggleAchievement = (achievement) => {
    setTempAchievements((prev) =>
      prev.includes(achievement)
        ? prev.filter((a) => a !== achievement)
        : [...prev, achievement],
    );
  };

  const toggleHobby = (hobby) => {
    setTempHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby],
    );
  };

  const toggleInterest = (interest) => {
    setTempCareerInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        grade: tempGrade,
        favoriteSubjects: tempFavoriteSubjects,
        examScores: tempExamScores,
        achievements: tempAchievements,
        hobbies: tempHobbies,
        careerInterests: tempCareerInterests,
        updatedAt: new Date(),
      });
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) setUserData(updatedDoc.data());
      setEditMode({
        grade: false,
        subjects: false,
        exams: false,
        achievements: false,
        hobbies: false,
        interests: false,
      });
      setSuccess("Профиль успешно сохранён");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Ошибка:", err);
      setError("Не удалось сохранить профиль");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = (field) => {
    if (field === "grade") setTempGrade(userData?.grade || "");
    if (field === "subjects")
      setTempFavoriteSubjects(userData?.favoriteSubjects || []);
    if (field === "exams") setTempExamScores(userData?.examScores || {});
    if (field === "achievements")
      setTempAchievements(userData?.achievements || []);
    if (field === "hobbies") setTempHobbies(userData?.hobbies || []);
    if (field === "interests")
      setTempCareerInterests(userData?.careerInterests || []);
    setEditMode((prev) => ({ ...prev, [field]: false }));
  };

  const getFilledExams = () =>
    EXAM_SUBJECTS.filter(
      (s) => tempExamScores[s.id] !== undefined && tempExamScores[s.id] !== "",
    );

  const cardStyle = {
    mb: 3,
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    transition: "all 0.2s ease",
    "&:hover": { boxShadow: 4 },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8, pb: 16 }}>
      {/* Приветствие */}
      <Paper
        sx={{
          p: 6,
          mb: 6,
          textAlign: "center",
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          borderRadius: 3,
        }}
      >
        <Typography variant="h3" fontWeight="800" gutterBottom>
          Здравствуйте,{" "}
          {userData?.displayName?.split(" ")[0] ||
            currentUser?.email?.split("@")[0]}
        </Typography>
        <Typography
          variant="h6"
          sx={{ opacity: 0.95, maxWidth: 600, mx: "auto" }}
        >
          Пожалуйста, заполните профиль — это поможет нам подобрать направления,
          которые подходят именно Вам
        </Typography>
      </Paper>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Класс */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <SchoolIcon sx={{ color: "primary.main", fontSize: 28 }} />
              <Typography variant="h6" fontWeight="700">
                Класс обучения
              </Typography>
            </Box>
            {!editMode.grade && tempGrade && (
              <IconButton
                onClick={() => toggleEditMode("grade")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <Collapse in={editMode.grade || !tempGrade}>
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                fullWidth
                label="Выберите класс"
                value={tempGrade}
                onChange={(e) => setTempGrade(e.target.value)}
              >
                {[5, 6, 7, 8, 9, 10, 11].map((g) => (
                  <MenuItem key={g} value={g}>
                    {g} класс
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                size="small"
                onClick={() => handleCancelEdit("grade")}
                startIcon={<CloseIcon />}
              >
                Отмена
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSaveProfile}
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Сохранить
              </Button>
            </Box>
          </Collapse>
          <Collapse in={!editMode.grade && !!tempGrade}>
            <Box
              sx={{
                p: 3,
                bgcolor: "primary.light",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="700"
                color="primary.contrastText"
              >
                {tempGrade} класс
              </Typography>
              <CheckIcon color="success" sx={{ fontSize: 32 }} />
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Любимые предметы */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <SchoolIcon sx={{ color: "primary.main", fontSize: 28 }} />
              <Typography variant="h6" fontWeight="700">
                Любимые предметы
              </Typography>
            </Box>
            {!editMode.subjects && tempFavoriteSubjects.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("subjects")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <Collapse in={editMode.subjects || tempFavoriteSubjects.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Пожалуйста, укажите предметы, которые Вам нравятся, и оценки по
              ним
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Предмет"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                >
                  {SUBJECTS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Оценка"
                  value={newSubjectGrade}
                  onChange={(e) => setNewSubjectGrade(e.target.value)}
                >
                  {GRADES.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddSubject}
                  sx={{ height: "100%", borderRadius: 2 }}
                >
                  Добавить
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {tempFavoriteSubjects.map((s) => (
                <Chip
                  key={s.name}
                  label={`${s.name} • ${s.grade}`}
                  onDelete={() => handleRemoveSubject(s.name)}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                size="small"
                onClick={() => handleCancelEdit("subjects")}
                startIcon={<CloseIcon />}
              >
                Отмена
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSaveProfile}
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Сохранить
              </Button>
            </Box>
          </Collapse>
          <Collapse in={!editMode.subjects && tempFavoriteSubjects.length > 0}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {tempFavoriteSubjects.map((s) => (
                <Chip
                  key={s.name}
                  label={`${s.name} • ${s.grade}`}
                  sx={{ borderRadius: 2, fontWeight: "600" }}
                />
              ))}
            </Box>
          </Collapse>
          {tempFavoriteSubjects.length === 0 && !editMode.subjects && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Не указано
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* ЕГЭ/ОГЭ */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <SchoolIcon sx={{ color: "primary.main", fontSize: 28 }} />
              <Typography variant="h6" fontWeight="700">
                Баллы ЕГЭ/ОГЭ
              </Typography>
            </Box>
            {!editMode.exams && Object.keys(tempExamScores).length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("exams")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <Collapse
            in={editMode.exams || Object.keys(tempExamScores).length === 0}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Пожалуйста, укажите баллы — это поможет нам точнее подобрать
              направления
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {EXAM_SUBJECTS.map((s) => (
                <Grid item xs={12} sm={6} key={s.id}>
                  <TextField
                    fullWidth
                    label={s.name}
                    type="number"
                    value={tempExamScores[s.id] ?? ""}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleExamScoreChange(s.id, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="0–100"
                    inputProps={{
                      min: 0,
                      max: 100,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    helperText={s.required ? "Обязательный предмет" : ""}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                size="small"
                onClick={() => handleCancelEdit("exams")}
                startIcon={<CloseIcon />}
              >
                Отмена
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSaveProfile}
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Сохранить
              </Button>
            </Box>
          </Collapse>
          <Collapse
            in={!editMode.exams && Object.keys(tempExamScores).length > 0}
          >
            <Grid container spacing={2}>
              {getFilledExams().map((s) => (
                <Grid item xs={12} sm={6} key={s.id}>
                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: "success.light",
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color="success.contrastText"
                    >
                      {s.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      color="success.contrastText"
                    >
                      {tempExamScores[s.id]} баллов
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Collapse>
          {Object.keys(tempExamScores).length === 0 && !editMode.exams && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Не указано
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Достижения */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <EmojiEventsIcon sx={{ color: "warning.main", fontSize: 28 }} />
              <Typography variant="h6" fontWeight="700">
                Достижения
              </Typography>
            </Box>
            {!editMode.achievements && tempAchievements.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("achievements")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <Collapse in={editMode.achievements || tempAchievements.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Пожалуйста, выберите свои достижения из списка
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 280,
                overflowY: "auto",
                p: 1,
                mb: 2,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {ACHIEVEMENTS_OPTIONS.map((a, idx) => (
                <FormControlLabel
                  key={`${a}-${idx}`}
                  control={
                    <Checkbox
                      checked={tempAchievements.includes(a)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleAchievement(a);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                    />
                  }
                  label={a}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    m: 0,
                    "& .MuiTypography-root": { fontSize: "0.9rem" },
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
            {tempAchievements.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  Выбрано: {tempAchievements.length}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {tempAchievements.map((a) => (
                    <Chip
                      key={a}
                      label={a}
                      onDelete={() => toggleAchievement(a)}
                      size="small"
                      color="warning"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                size="small"
                onClick={() => handleCancelEdit("achievements")}
                startIcon={<CloseIcon />}
              >
                Отмена
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSaveProfile}
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Сохранить
              </Button>
            </Box>
          </Collapse>
          <Collapse in={!editMode.achievements && tempAchievements.length > 0}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {tempAchievements.map((a, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    bgcolor: "warning.light",
                    borderRadius: 2,
                    color: "warning.contrastText",
                  }}
                >
                  <Typography variant="body2" fontWeight="600">
                    {a}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Collapse>
          {tempAchievements.length === 0 && !editMode.achievements && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Не указано
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Хобби — ИСПРАВЛЕНО */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PsychologyIcon sx={{ color: "secondary.main", fontSize: 28 }} />
              <Typography variant="h6" fontWeight="700">
                Хобби
              </Typography>
            </Box>
            {!editMode.hobbies && tempHobbies.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("hobbies")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <Collapse in={editMode.hobbies || tempHobbies.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Что Вам нравится делать?
            </Typography>
            {/* 🔧 Контейнер с остановкой всплытия событий */}
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {HOBBIES_OPTIONS.map((h) => {
                const isSelected = tempHobbies.includes(h);
                return (
                  <Chip
                    key={h}
                    label={h}
                    // 🔧 onMouseDown + preventDefault + stopPropagation — надёжнее onClick
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleHobby(h);
                    }}
                    color={isSelected ? "secondary" : "default"}
                    variant={isSelected ? "filled" : "outlined"}
                    sx={{
                      borderRadius: 2,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: isSelected
                          ? "secondary.light"
                          : "action.hover",
                      },
                    }}
                  />
                );
              })}
            </Box>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                size="small"
                onClick={() => handleCancelEdit("hobbies")}
                startIcon={<CloseIcon />}
              >
                Отмена
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSaveProfile}
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Сохранить
              </Button>
            </Box>
          </Collapse>
          <Collapse in={!editMode.hobbies && tempHobbies.length > 0}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {tempHobbies.map((h) => (
                <Chip
                  key={h}
                  label={h}
                  color="secondary"
                  sx={{ borderRadius: 2, fontWeight: "600" }}
                />
              ))}
            </Box>
          </Collapse>
          {tempHobbies.length === 0 && !editMode.hobbies && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Не указано
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Интересы */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <WorkIcon sx={{ color: "primary.main", fontSize: 28 }} />
              <Typography variant="h6" fontWeight="700">
                Карьерные интересы
              </Typography>
            </Box>
            {!editMode.interests && tempCareerInterests.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("interests")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <Collapse in={editMode.interests || tempCareerInterests.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Какие направления Вас привлекают?
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 280,
                overflowY: "auto",
                p: 1,
                mb: 2,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {CAREER_INTERESTS_OPTIONS.map((i, idx) => (
                <FormControlLabel
                  key={`${i}-${idx}`}
                  control={
                    <Checkbox
                      checked={tempCareerInterests.includes(i)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleInterest(i);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                    />
                  }
                  label={i}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    m: 0,
                    "& .MuiTypography-root": { fontSize: "0.9rem" },
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
            {tempCareerInterests.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  Выбрано: {tempCareerInterests.length}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {tempCareerInterests.map((i) => (
                    <Chip
                      key={i}
                      label={i}
                      onDelete={() => toggleInterest(i)}
                      size="small"
                      sx={{
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                size="small"
                onClick={() => handleCancelEdit("interests")}
                startIcon={<CloseIcon />}
              >
                Отмена
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSaveProfile}
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Сохранить
              </Button>
            </Box>
          </Collapse>
          <Collapse in={!editMode.interests && tempCareerInterests.length > 0}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {tempCareerInterests.map((i) => (
                <Chip
                  key={i}
                  label={i}
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#1976d2",
                    borderRadius: 2,
                    fontWeight: "600",
                  }}
                />
              ))}
            </Box>
          </Collapse>
          {tempCareerInterests.length === 0 && !editMode.interests && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Не указано
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Кнопка сохранения */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={<SaveIcon />}
        onClick={handleSaveProfile}
        disabled={loading}
        sx={{
          py: 2,
          mb: 3,
          borderRadius: 3,
          fontSize: "1.1rem",
          fontWeight: "600",
          boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
            transform: "translateY(-2px)",
          },
        }}
      >
        {loading ? "Сохранение..." : "Сохранить все изменения"}
      </Button>
    </Container>
  );
}

export default ProfilePage;
