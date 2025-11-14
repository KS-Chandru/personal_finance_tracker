"use client";
import React from "react";
import { Paper, Box, Typography } from "@mui/material";

export default function BottomNavMobile({
  balance = 0,
  income = 0,
  expense = 0,
}) {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 12,
        left: 12,
        right: 12,
        display: { xs: "flex", md: "none" },
        justifyContent: "space-between",
        p: 1.5,
        gap: 1,
      }}
    >
      <Box>
        <Typography variant="caption">Balance</Typography>
        <Typography variant="subtitle1">
          ₹{Number(balance).toFixed(2)}
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption">Income</Typography>
        <Typography variant="subtitle1">
          ₹{Number(income).toFixed(2)}
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption">Expense</Typography>
        <Typography variant="subtitle1">
          ₹{Number(expense).toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
}
