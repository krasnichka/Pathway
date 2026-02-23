import * as React from "react";
import { Typography, Container, Paper } from "@mui/material";

function GoalsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>
          🎯 Мои цели
        </Typography>
        <Typography color="text.secondary">
          Текущая цель + задачи + огонёк 🔥 + награды 🏆
        </Typography>
      </Paper>
    </Container>
  );
}

export default GoalsPage;