import * as React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
  Button,
  Checkbox,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  IconButton,
} from "@mui/material";
import {
  EmojiEvents,
  LocalFireDepartment,
  CheckCircle,
  Circle,
  AccessTime,
  Close,
  CalendarToday,
} from "@mui/icons-material";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { DAILY_TASK_POOL, REST_TASKS } from "../utils/taskConstants";
// Пул ежедневных задач по категориям

const ACHIEVEMENTS = [
  { id: "newbie", name: "Новичок", days: 3, icon: "🥉" },
  { id: "dedicated", name: "Старательный", days: 7, icon: "🥈" },
  { id: "champion", name: "Чемпион", days: 14, icon: "🥇" },
  { id: "legend", name: "Легенда", days: 30, icon: "👑" },
];

function GoalsPage() {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [goalData, setGoalData] = React.useState(null);
  const [dailyTasks, setDailyTasks] = React.useState([]);
  const [streak, setStreak] = React.useState(0);
  const [achievements, setAchievements] = React.useState([]);
  const [selectDialogOpen, setSelectDialogOpen] = React.useState(false);
  const [timeUntilReset, setTimeUntilReset] = React.useState("");
  const [fireDialogOpen, setFireDialogOpen] = React.useState(false);
  const [confirmDialog, setConfirmDialog] = React.useState({
    open: false,
    task: null,
    isLongTerm: false,
    note: "",
    startTime: null,
  });

  // 🔥 КЛЮЧЕВОЕ: отслеживаем предыдущую категорию
  const prevCategoryRef = React.useRef(null);

  // Загрузка данных
  React.useEffect(() => {
    loadGoalData();
  }, [currentUser]);

  // 🔥 ОБНОВЛЕНИЕ ЗАДАЧ ПРИ СМЕНЕ КАТЕГОРИИ
  React.useEffect(() => {
    if (!goalData?.direction?.category) return;

    const currentCategory = goalData.direction.category;
    const prevCategory = prevCategoryRef.current;

    // Если категория изменилась — генерируем новые задачи
    if (prevCategory && prevCategory !== currentCategory) {
      console.log(
        `🔄 Категория изменилась: ${prevCategory} → ${currentCategory}`,
      );
      generateNewDailyTasks(currentCategory);
    }

    prevCategoryRef.current = currentCategory;
  }, [goalData?.direction?.category]);

  // Таймер для обратного отсчёта
  React.useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilReset(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadGoalData = async () => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGoalData(data.goal || null);
        setDailyTasks(data.dailyTasks || []);
        setStreak(data.streak?.current || 0);
        setAchievements(data.achievements || []);
        // Сохраняем начальную категорию
        if (data.goal?.direction?.category) {
          prevCategoryRef.current = data.goal.direction.category;
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Генерация новых задач для категории
  const generateNewDailyTasks = async (category) => {
    const today = new Date().toISOString().split("T")[0];
    const taskPool = DAILY_TASK_POOL[category] || DAILY_TASK_POOL.IT;

    const shuffled = [...taskPool].sort(() => 0.5 - Math.random());
    const newTasks = shuffled.slice(0, 3).map((title, index) => ({
      id: `daily_${today}_${index}`,
      title,
      category: category,
      completed: false,
      date: today,
    }));

    // 20% шанс добавить отдых
    if (Math.random() < 0.2) {
      const restTask =
        REST_TASKS[Math.floor(Math.random() * REST_TASKS.length)];
      newTasks.push({
        id: `daily_${today}_rest`,
        title: restTask,
        category: "Отдых",
        completed: false,
        date: today,
      });
    }

    // Сохраняем в Firebase
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { dailyTasks: newTasks });
    setDailyTasks(newTasks);
    console.log("✅ Новые задачи сгенерированы:", newTasks);
  };

  const handleTaskClick = (task, isLongTerm = false) => {
    if (task.completed) {
      toggleTask(task, isLongTerm);
      return;
    }
    setConfirmDialog({
      open: true,
      task,
      isLongTerm,
      note: "",
      startTime: Date.now(),
    });
  };

  const toggleTask = async (task, isLongTerm = false, note = "") => {
    const userRef = doc(db, "users", currentUser.uid);
    const today = new Date().toISOString().split("T")[0];

    if (isLongTerm) {
      const updatedTasks = goalData.longTermTasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              completed: !t.completed,
              note,
              completedAt: new Date().toISOString(),
            }
          : t,
      );
      await updateDoc(userRef, { "goal.longTermTasks": updatedTasks });
      setGoalData({ ...goalData, longTermTasks: updatedTasks });
    } else {
      const updatedTasks = dailyTasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              completed: !t.completed,
              note,
              completedAt: new Date().toISOString(),
            }
          : t,
      );
      await updateDoc(userRef, { dailyTasks: updatedTasks });
      setDailyTasks(updatedTasks);
    }

    if (!task.completed) {
      await updateStreak(userRef, today);
    }
  };

  const updateStreak = async (userRef, today) => {
    const lastActive = userData?.streak?.lastActiveDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    let newStreak = userData?.streak?.current || 0;

    if (lastActive === today) return;
    else if (lastActive === yesterdayStr) newStreak += 1;
    else newStreak = 1;

    await updateDoc(userRef, {
      streak: {
        current: newStreak,
        longest: Math.max(newStreak, userData?.streak?.longest || 0),
        lastActiveDate: today,
      },
    });
    setStreak(newStreak);
    await checkAchievements(userRef, newStreak);
  };

  const checkAchievements = async (userRef, currentStreak) => {
    const newAchievements = [...achievements];
    let updated = false;
    for (const achievement of ACHIEVEMENTS) {
      if (
        currentStreak >= achievement.days &&
        !newAchievements.find((a) => a.id === achievement.id)
      ) {
        newAchievements.push({
          id: achievement.id,
          name: achievement.name,
          icon: achievement.icon,
          unlockedAt: new Date().toISOString(),
        });
        updated = true;
      }
    }
    if (updated) {
      await updateDoc(userRef, { achievements: newAchievements });
      setAchievements(newAchievements);
    }
  };

  const calculateProgress = () => {
    if (!goalData?.longTermTasks) return 0;
    const completed = goalData.longTermTasks.filter((t) => t.completed).length;
    return Math.round((completed / goalData.longTermTasks.length) * 100);
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("ru-RU", { weekday: "short" }),
        dayNumber: date.getDate(),
      });
    }
    return days;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Загрузка...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10, position: "relative" }}>
      <Fab
        color="error"
        onClick={() => setFireDialogOpen(true)}
        sx={{
          position: "fixed",
          top: 90,
          right: 24,
          zIndex: 1000,
          minWidth: 70,
          height: 70,
          boxShadow: "0 4px 12px rgba(255, 87, 34, 0.4)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LocalFireDepartment sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            {streak}
          </Typography>
        </Box>
      </Fab>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🎯 Твои цели
        </Typography>
        <Typography color="text.secondary">
          Двигайся к мечте маленькими шагами каждый день
        </Typography>
      </Box>

      {!goalData ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <EmojiEvents sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            У тебя ещё нет выбранной цели
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Выбери направление, к которому будешь стремиться
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              setSelectDialogOpen(true);
              navigate("/directions");
            }}
          >
            Выбрать направление
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card
            sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {goalData.direction?.name}
                  </Typography>
                  <Typography sx={{ opacity: 0.9 }}>
                    {goalData.university}
                  </Typography>
                </Box>
                <Chip
                  label={goalData.direction?.category}
                  sx={{ bgcolor: "white", color: "primary.main" }}
                />
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Прогресс выполнения:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    flex: 1,
                    height: 12,
                    bgcolor: "rgba(255,255,255,0.3)",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${calculateProgress()}%`,
                      bgcolor: "success.main",
                      transition: "width 0.5s ease",
                    }}
                  />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {calculateProgress()}%
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📋 Глубинные задачи
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Важные шаги к твоей цели
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {goalData.longTermTasks?.map((task) => (
                  <Paper
                    key={task.id}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      bgcolor: task.completed ? "success.light" : "grey.50",
                      transition: "all 0.3s",
                    }}
                  >
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleTaskClick(task, true)}
                      icon={<Circle />}
                      checkedIcon={<CheckCircle />}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                          color: task.completed
                            ? "success.dark"
                            : "text.primary",
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Chip
                        label={task.category}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                      {task.note && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          📝 {task.note}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    📅 Ежедневные задачи
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Поддержи огонёк маленькими шагами
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTime fontSize="small" color="info" />
                  <Typography variant="body2" color="text.secondary">
                    Обновление через: <strong>{timeUntilReset}</strong>
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {dailyTasks.map((task) => (
                  <Paper
                    key={task.id}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      bgcolor: task.completed ? "success.light" : "grey.50",
                      transition: "all 0.3s",
                    }}
                  >
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleTaskClick(task, false)}
                      icon={<Circle />}
                      checkedIcon={<CheckCircle />}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                          color: task.completed
                            ? "success.dark"
                            : "text.primary",
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ~10-15 минут
                      </Typography>
                      {task.note && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          📝 {task.note}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                ))}
              </Box>
              <Alert severity="info" sx={{ mt: 2 }}>
                💡 Завтра задачи обновятся! Выполни хотя бы одну сегодня, чтобы
                сохранить огонёк.
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🏆 Твои награды
              </Typography>
              <Grid container spacing={2}>
                {ACHIEVEMENTS.map((achievement) => {
                  const unlocked = achievements.find(
                    (a) => a.id === achievement.id,
                  );
                  return (
                    <Grid item xs={6} sm={3} key={achievement.id}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          opacity: unlocked ? 1 : 0.4,
                          bgcolor: unlocked ? "warning.light" : "grey.200",
                        }}
                      >
                        <Typography variant="h3">{achievement.icon}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {achievement.name}
                        </Typography>
                        <Typography variant="caption">
                          {achievement.days} дней
                        </Typography>
                        {unlocked && (
                          <Chip label="✅" size="small" sx={{ mt: 1 }} />
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      <Dialog
        open={fireDialogOpen}
        onClose={() => setFireDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalFireDepartment sx={{ color: "#ff5722", fontSize: 32 }} />
            <Typography variant="h5">Твоя серия</Typography>
          </Box>
          <IconButton onClick={() => setFireDialogOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {streak} {streak === 1 ? "день" : streak < 5 ? "дня" : "дней"}
            </Typography>
            <Typography color="text.secondary">
              {streak > 0
                ? "🔥 Так держать! Продолжай в том же духе!"
                : "Начни сегодня! Каждый день важен."}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CalendarToday fontSize="small" />
            Последние 7 дней
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
            {getLast7Days().map((day) => {
              const wasActive = userData?.streak?.lastActiveDate === day.date;
              return (
                <Box key={day.date} sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: wasActive ? "#ff5722" : "grey.300",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 0.5,
                    }}
                  >
                    {wasActive ? (
                      <CheckCircle sx={{ color: "white", fontSize: 24 }} />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {day.dayName}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {day.dayNumber}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Как работает огонёк:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              • Выполняй хотя бы 1 задачу каждый день
              <br />• Если пропустишь день — серия сбросится
              <br />• Чем длиннее серия, тем больше наград!
              <br />• Честность перед собой — ключ к успеху
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFireDialogOpen(false)} variant="contained">
            Понятно
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {confirmDialog.task?.completed
            ? "Отменить выполнение?"
            : "Выполнил задачу?"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            <strong>{confirmDialog.task?.title}</strong>
          </Typography>
          {!confirmDialog.task?.completed && (
            <>
              <TextField
                fullWidth
                label="Краткий отчёт (необязательно)"
                placeholder="Что сделал? Сколько времени заняло?"
                value={confirmDialog.note}
                onChange={(e) =>
                  setConfirmDialog({ ...confirmDialog, note: e.target.value })
                }
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              <Alert severity="info" sx={{ mb: 2 }}>
                💡 Честность перед собой — ключ к реальному прогрессу. Огонёк
                сгорит, если пропустишь день, но фальшивые отметки не помогут в
                поступлении.
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (confirmDialog.task) {
                toggleTask(
                  confirmDialog.task,
                  confirmDialog.isLongTerm,
                  confirmDialog.note,
                );
              }
              setConfirmDialog({ ...confirmDialog, open: false });
            }}
            color={confirmDialog.task?.completed ? "warning" : "success"}
          >
            {confirmDialog.task?.completed ? "Отменить" : "Подтвердить"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={selectDialogOpen}
        onClose={() => setSelectDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Выбери направление</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Перейди на вкладку "Направления" и выбери цель там
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectDialogOpen(false)}>Понятно</Button>
          <Button onClick={() => navigate("/directions")} variant="contained">
            К направлениям
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default GoalsPage;
