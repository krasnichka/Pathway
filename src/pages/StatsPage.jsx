import * as React from "react";
import { Typography, Container, Paper } from "@mui/material";

function StatsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>
          📊 Статистика интересов
        </Typography>
        <Typography color="text.secondary">
          Как менялись твои предпочтения: от повара к юристу и дальше 📈
        </Typography>
      </Paper>
    </Container>
  );
}

export default StatsPage;