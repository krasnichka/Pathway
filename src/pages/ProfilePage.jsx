import * as React from "react";
import { Typography, Container, Paper } from "@mui/material";

function ProfilePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>
          👤 Профиль
        </Typography>
        <Typography color="text.secondary">
          Здесь можно загрузить оценки, табель, добавить хобби и увлечения
        </Typography>
      </Paper>
    </Container>
  );
}

export default ProfilePage;