import * as React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Пароли не совпадают");
    }

    if (password.length < 6) {
      return setError("Пароль должен быть не менее 6 символов");
    }

    setLoading(true);

    try {
      await signup(email, password, displayName);
      navigate("/");
    } catch (err) {
      setError(err.message);
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <PersonAddIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Регистрация
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Создайте аккаунт для начала работы
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Имя"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Подтвердите пароль"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
          <Typography align="center" color="text.secondary">
            Уже есть аккаунт?{" "}
            <Link to="/login" style={{ color: "#1976d2" }}>
              Войти
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;