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

// Список предметов для выбора
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

// Оценки
const GRADES = ["2", "3", "4", "5"];

// Предметы ЕГЭ/ОГЭ с баллами
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

// Готовые варианты достижений
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

// Готовые варианты хобби
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

// Готовые варианты карьерных интересов
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

  // Состояния редактирования для каждого блока
  const [editMode, setEditMode] = useState({
    grade: false,
    subjects: false,
    exams: false,
    achievements: false,
    hobbies: false,
    interests: false,
  });

  // Состояния формы
  const [grade, setGrade] = useState(userData?.grade || "");
  const [favoriteSubjects, setFavoriteSubjects] = useState(
    userData?.favoriteSubjects || [],
  );
  const [newSubject, setNewSubject] = useState("");
  const [newSubjectGrade, setNewSubjectGrade] = useState("5");

  // ЕГЭ/ОГЭ
  const [examScores, setExamScores] = useState(userData?.examScores || {});

  // Достижения
  const [achievements, setAchievements] = useState(
    userData?.achievements || [],
  );

  // Хобби
  const [hobbies, setHobbies] = useState(userData?.hobbies || []);

  // Карьерные интересы
  const [careerInterests, setCareerInterests] = useState(
    userData?.careerInterests || [],
  );

  // Загрузка данных при монтировании
  useEffect(() => {
    if (userData) {
      setGrade(userData.grade || "");
      setFavoriteSubjects(userData.favoriteSubjects || []);
      setExamScores(userData.examScores || {});
      setAchievements(userData.achievements || []);
      setHobbies(userData.hobbies || []);
      setCareerInterests(userData.careerInterests || []);

      // Если есть данные, показываем их в режиме просмотра
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

  // Переключение режима редактирования
  const toggleEditMode = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Добавление предмета
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

  // Удаление предмета
  const handleRemoveSubject = (subjectName) => {
    setFavoriteSubjects(favoriteSubjects.filter((s) => s.name !== subjectName));
  };

  // Изменение балла ЕГЭ
  const handleExamScoreChange = (subjectId, value) => {
    const numValue =
      value === "" ? "" : Math.min(100, Math.max(0, parseInt(value) || 0));
    setExamScores({
      ...examScores,
      [subjectId]: numValue,
    });
  };

  // Переключение достижения
  const toggleAchievement = (achievement) => {
    if (achievements.includes(achievement)) {
      setAchievements(achievements.filter((a) => a !== achievement));
    } else {
      setAchievements([...achievements, achievement]);
    }
  };

  // Переключение хобби
  const toggleHobby = (hobby) => {
    if (hobbies.includes(hobby)) {
      setHobbies(hobbies.filter((h) => h !== hobby));
    } else {
      setHobbies([...hobbies, hobby]);
    }
  };

  // Переключение интереса
  const toggleInterest = (interest) => {
    if (careerInterests.includes(interest)) {
      setCareerInterests(careerInterests.filter((i) => i !== interest));
    } else {
      setCareerInterests([...careerInterests, interest]);
    }
  };

  // Сохранение профиля
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

      // Обновляем контекст
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        setUserData(updatedDoc.data());
      }

      // Переключаем все блоки в режим просмотра
      setEditMode({
        grade: false,
        subjects: false,
        exams: false,
        achievements: false,
        hobbies: false,
        interests: false,
      });

      setSuccess("Профиль успешно сохранён! 🎉");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      setError("Не удалось сохранить профиль. Попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  // Получение заполненных экзаменов
  const getFilledExams = () => {
    return EXAM_SUBJECTS.filter((subj) => examScores[subj.id]);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      {/* Приветствие */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          👋 Привет, {userData?.displayName || currentUser?.email}!
        </Typography>
        <Typography sx={{ mt: 1, opacity: 0.9 }}>
          Заполни профиль, чтобы мы могли подобрать лучшие направления для тебя
        </Typography>
      </Paper>

      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Класс */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">📚 Класс обучения</Typography>
            {!editMode.grade && grade && (
              <IconButton onClick={() => toggleEditMode("grade")} size="small">
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
                p: 2,
                bgcolor: "primary.light",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
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
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">
              <SchoolIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Любимые предметы и оценки
            </Typography>
            {!editMode.subjects && favoriteSubjects.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("subjects")}
                size="small"
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Collapse in={editMode.subjects || favoriteSubjects.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Укажи предметы, которые тебе нравятся и твои оценки по ним
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Предмет"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                >
                  {SUBJECTS.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
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
                  sx={{ height: "100%" }}
                >
                  Добавить
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {favoriteSubjects.map((subject) => (
                <Chip
                  key={subject.name}
                  label={`${subject.name} (${subject.grade})`}
                  onDelete={() => handleRemoveSubject(subject.name)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Collapse>

          <Collapse in={!editMode.subjects && favoriteSubjects.length > 0}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {favoriteSubjects.map((subject) => (
                <Chip
                  key={subject.name}
                  label={`${subject.name} - ${subject.grade}`}
                  color="primary"
                  sx={{ fontWeight: "bold" }}
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
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">📝 Баллы ЕГЭ/ОГЭ</Typography>
            {!editMode.exams && Object.keys(examScores).length > 0 && (
              <IconButton onClick={() => toggleEditMode("exams")} size="small">
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Collapse in={editMode.exams || Object.keys(examScores).length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Укажи свои баллы (необязательно, но поможет с рекомендациями)
            </Typography>

            <Grid container spacing={2}>
              {EXAM_SUBJECTS.map((subject) => (
                <Grid item xs={12} sm={6} key={subject.id}>
                  <TextField
                    fullWidth
                    label={subject.name}
                    type="number"
                    value={examScores[subject.id] || ""}
                    onChange={(e) =>
                      handleExamScoreChange(subject.id, e.target.value)
                    }
                    placeholder="0-100"
                    inputProps={{ min: 0, max: 100 }}
                    helperText={subject.required ? "Обязательный предмет" : ""}
                  />
                </Grid>
              ))}
            </Grid>
          </Collapse>

          <Collapse in={!editMode.exams && Object.keys(examScores).length > 0}>
            <Grid container spacing={1}>
              {getFilledExams().map((subject) => (
                <Grid item xs={12} sm={6} key={subject.id}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "success.light",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="success.contrastText"
                    >
                      {subject.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="success.contrastText"
                    >
                      {examScores[subject.id]} баллов
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

      {/* Академические достижения */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">
              <EmojiEventsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Академические достижения
            </Typography>
            {!editMode.achievements && achievements.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("achievements")}
                size="small"
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Collapse in={editMode.achievements || achievements.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Выбери свои достижения из списка
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 300,
                overflowY: "auto",
                p: 1,
              }}
            >
              {ACHIEVEMENTS_OPTIONS.map((achievement) => (
                <FormControlLabel
                  key={achievement}
                  control={
                    <Checkbox
                      checked={achievements.includes(achievement)}
                      onChange={() => toggleAchievement(achievement)}
                    />
                  }
                  label={achievement}
                  sx={{ m: 0 }}
                />
              ))}
            </Box>

            {achievements.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom fontWeight="bold">
                  Выбрано: {achievements.length}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {achievements.map((achievement) => (
                    <Chip
                      key={achievement}
                      label={achievement}
                      onDelete={() => toggleAchievement(achievement)}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Collapse>

          <Collapse in={!editMode.achievements && achievements.length > 0}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {achievements.map((achievement, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1.5,
                    bgcolor: "warning.light",
                    borderRadius: 1,
                    color: "warning.contrastText",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {achievement}
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

      {/* Хобби и увлечения */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">
              <PsychologyIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Хобби и увлечения
            </Typography>
            {!editMode.hobbies && hobbies.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("hobbies")}
                size="small"
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Collapse in={editMode.hobbies || hobbies.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Выбери что тебе нравится делать
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {HOBBIES_OPTIONS.map((hobby) => (
                <Chip
                  key={hobby}
                  label={hobby}
                  onClick={() => toggleHobby(hobby)}
                  color={hobbies.includes(hobby) ? "secondary" : "default"}
                  variant={hobbies.includes(hobby) ? "filled" : "outlined"}
                />
              ))}
            </Box>
          </Collapse>

          <Collapse in={!editMode.hobbies && hobbies.length > 0}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {hobbies.map((hobby) => (
                <Chip
                  key={hobby}
                  label={hobby}
                  color="secondary"
                  sx={{ fontWeight: "bold" }}
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

      {/* Карьерные интересы */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">
              <WorkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Карьерные интересы
            </Typography>
            {!editMode.interests && careerInterests.length > 0 && (
              <IconButton
                onClick={() => toggleEditMode("interests")}
                size="small"
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Collapse in={editMode.interests || careerInterests.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Какие направления тебя привлекают
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 300,
                overflowY: "auto",
                p: 1,
              }}
            >
              {CAREER_INTERESTS_OPTIONS.map((interest) => (
                <FormControlLabel
                  key={interest}
                  control={
                    <Checkbox
                      checked={careerInterests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                    />
                  }
                  label={interest}
                  sx={{ m: 0 }}
                />
              ))}
            </Box>

            {careerInterests.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom fontWeight="bold">
                  Выбрано интересов: {careerInterests.length}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {careerInterests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      onDelete={() => toggleInterest(interest)}
                      size="small"
                      sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Collapse>

          <Collapse in={!editMode.interests && careerInterests.length > 0}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {careerInterests.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#1976d2",
                    fontWeight: "bold",
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
        sx={{ py: 2, mb: 3 }}
      >
        {loading ? "Сохранение..." : "Сохранить все изменения"}
      </Button>
    </Container>
  );
}

export default ProfilePage;
