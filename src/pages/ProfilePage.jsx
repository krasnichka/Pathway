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
  Divider,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WorkIcon from "@mui/icons-material/Work";
import CheckIcon from "@mui/icons-material/Check";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Списки опций (без изменений)
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

  const [grade, setGrade] = useState(userData?.grade || "");
  const [favoriteSubjects, setFavoriteSubjects] = useState(
    userData?.favoriteSubjects || [],
  );
  const [newSubject, setNewSubject] = useState("");
  const [newSubjectGrade, setNewSubjectGrade] = useState("5");
  const [examScores, setExamScores] = useState(userData?.examScores || {});
  const [achievements, setAchievements] = useState(
    userData?.achievements || [],
  );
  const [hobbies, setHobbies] = useState(userData?.hobbies || []);
  const [careerInterests, setCareerInterests] = useState(
    userData?.careerInterests || [],
  );

  useEffect(() => {
    if (userData) {
      setGrade(userData.grade || "");
      setFavoriteSubjects(userData.favoriteSubjects || []);
      setExamScores(userData.examScores || {});
      setAchievements(userData.achievements || []);
      setHobbies(userData.hobbies || []);
      setCareerInterests(userData.careerInterests || []);
      if (userData.grade || userData.favoriteSubjects?.length > 0) {
        setEditMode({
          grade: false,
          subjects: false,
          exams: false,
          achievements: false,
          hobbies: false,
          interests: false,
        });
      }
    }
  }, [userData]);

  const toggleEditMode = (field) =>
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  const handleAddSubject = () => {
    if (newSubject && !favoriteSubjects.find((s) => s.name === newSubject)) {
      setFavoriteSubjects([
        ...favoriteSubjects,
        { name: newSubject, grade: newSubjectGrade },
      ]);
      setNewSubject("");
      setNewSubjectGrade("5");
    }
  };
  const handleRemoveSubject = (name) =>
    setFavoriteSubjects(favoriteSubjects.filter((s) => s.name !== name));
  const handleExamScoreChange = (id, value) => {
    const numValue =
      value === "" ? "" : Math.min(100, Math.max(0, parseInt(value) || 0));
    setExamScores({ ...examScores, [id]: numValue });
  };
  const toggleAchievement = (a) =>
    setAchievements(
      achievements.includes(a)
        ? achievements.filter((x) => x !== a)
        : [...achievements, a],
    );
  const toggleHobby = (h) =>
    setHobbies(
      hobbies.includes(h) ? hobbies.filter((x) => x !== h) : [...hobbies, h],
    );
  const toggleInterest = (i) =>
    setCareerInterests(
      careerInterests.includes(i)
        ? careerInterests.filter((x) => x !== i)
        : [...careerInterests, i],
    );

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        grade,
        favoriteSubjects,
        examScores,
        achievements,
        hobbies,
        careerInterests,
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

  const getFilledExams = () => EXAM_SUBJECTS.filter((s) => examScores[s.id]);

  // Общий стиль для карточек
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography variant="h3" fontWeight="800" gutterBottom>
          Привет,{" "}
          {userData?.displayName?.split(" ")[0] ||
            currentUser?.email?.split("@")[0]}
        </Typography>
        <Typography
          variant="h6"
          sx={{ opacity: 0.95, maxWidth: 600, mx: "auto" }}
        >
          Заполни профиль — и мы подберём направления, которые подходят именно
          тебе
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
            {!editMode.grade && grade && (
              <IconButton
                onClick={() => toggleEditMode("grade")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Collapse in={editMode.grade || !grade}>
            <TextField
              select
              fullWidth
              label="Выбери класс"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              sx={{ mt: 1 }}
            >
              {[5, 6, 7, 8, 9, 10, 11].map((g) => (
                <MenuItem key={g} value={g}>
                  {g} класс
                </MenuItem>
              ))}
            </TextField>
          </Collapse>

          <Collapse in={!editMode.grade && !!grade}>
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
                {grade} класс
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
            {!editMode.subjects && favoriteSubjects.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("subjects")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Collapse in={editMode.subjects || favoriteSubjects.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Укажи предметы, которые тебе нравятся, и оценки по ним
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
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {favoriteSubjects.map((s) => (
                <Chip
                  key={s.name}
                  label={`${s.name} • ${s.grade}`}
                  onDelete={() => handleRemoveSubject(s.name)}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          </Collapse>

          <Collapse in={!editMode.subjects && favoriteSubjects.length > 0}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {favoriteSubjects.map((s) => (
                <Chip
                  key={s.name}
                  label={`${s.name} • ${s.grade}`}
                  sx={{ borderRadius: 2, fontWeight: "600" }}
                />
              ))}
            </Box>
          </Collapse>
          {favoriteSubjects.length === 0 && !editMode.subjects && (
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
            {!editMode.exams && Object.keys(examScores).length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("exams")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Collapse in={editMode.exams || Object.keys(examScores).length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Укажи баллы — это поможет нам точнее подобрать направления
            </Typography>
            <Grid container spacing={2}>
              {EXAM_SUBJECTS.map((s) => (
                <Grid item xs={12} sm={6} key={s.id}>
                  <TextField
                    fullWidth
                    label={s.name}
                    type="number"
                    value={examScores[s.id] || ""}
                    onChange={(e) =>
                      handleExamScoreChange(s.id, e.target.value)
                    }
                    placeholder="0–100"
                    inputProps={{ min: 0, max: 100 }}
                    helperText={s.required ? "Обязательный предмет" : ""}
                  />
                </Grid>
              ))}
            </Grid>
          </Collapse>

          <Collapse in={!editMode.exams && Object.keys(examScores).length > 0}>
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
                      {examScores[s.id]} баллов
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Collapse>
          {Object.keys(examScores).length === 0 && !editMode.exams && (
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
            {!editMode.achievements && achievements.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("achievements")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Collapse in={editMode.achievements || achievements.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Выбери свои достижения
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 280,
                overflowY: "auto",
                p: 1,
              }}
            >
              {ACHIEVEMENTS_OPTIONS.map((a) => (
                <FormControlLabel
                  key={a}
                  control={
                    <Checkbox
                      checked={achievements.includes(a)}
                      onChange={() => toggleAchievement(a)}
                    />
                  }
                  label={a}
                  sx={{ m: 0 }}
                />
              ))}
            </Box>
            {achievements.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  Выбрано: {achievements.length}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {achievements.map((a) => (
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
          </Collapse>

          <Collapse in={!editMode.achievements && achievements.length > 0}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {achievements.map((a, i) => (
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
          {achievements.length === 0 && !editMode.achievements && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Не указано
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Хобби */}
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
            {!editMode.hobbies && hobbies.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("hobbies")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Collapse in={editMode.hobbies || hobbies.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Что тебе нравится делать
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {HOBBIES_OPTIONS.map((h) => (
                <Chip
                  key={h}
                  label={h}
                  onClick={() => toggleHobby(h)}
                  color={hobbies.includes(h) ? "secondary" : "default"}
                  variant={hobbies.includes(h) ? "filled" : "outlined"}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          </Collapse>

          <Collapse in={!editMode.hobbies && hobbies.length > 0}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {hobbies.map((h) => (
                <Chip
                  key={h}
                  label={h}
                  color="secondary"
                  sx={{ borderRadius: 2, fontWeight: "600" }}
                />
              ))}
            </Box>
          </Collapse>
          {hobbies.length === 0 && !editMode.hobbies && (
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
            {!editMode.interests && careerInterests.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("interests")}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Collapse in={editMode.interests || careerInterests.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Какие направления тебя привлекают
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 280,
                overflowY: "auto",
                p: 1,
              }}
            >
              {CAREER_INTERESTS_OPTIONS.map((i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      checked={careerInterests.includes(i)}
                      onChange={() => toggleInterest(i)}
                    />
                  }
                  label={i}
                  sx={{ m: 0 }}
                />
              ))}
            </Box>
            {careerInterests.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  Выбрано: {careerInterests.length}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {careerInterests.map((i) => (
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
          </Collapse>

          <Collapse in={!editMode.interests && careerInterests.length > 0}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {careerInterests.map((i) => (
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
          {careerInterests.length === 0 && !editMode.interests && (
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
        {loading ? "Сохранение..." : "Сохранить изменения"}
      </Button>
    </Container>
  );
}

export default ProfilePage;
