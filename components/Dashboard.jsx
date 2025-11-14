"use client";
import React from "react";
import { Grid, Paper, Typography, Box, LinearProgress } from "@mui/material";

export default function Dashboard({
  summary = { income: 0, expense: 0, balance: 0 },
  budget = {},
  setBudget,
}) {
  const budgetValue = budget?.amount ? Number(budget.amount) : 0;
  const progress =
    budgetValue > 0 ? Math.min((summary.expense / budgetValue) * 100, 100) : 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Balance
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
            ₹{summary.balance.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Income: ₹{summary.income.toFixed(2)} • Expense: ₹
            {summary.expense.toFixed(2)}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Monthly Budget
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            ₹{budgetValue.toFixed(2)}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 8 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Spent: ₹{summary.expense.toFixed(2)} ({progress.toFixed(0)}%)
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Quick Insights
          </Typography>
          <Typography sx={{ mt: 1, fontWeight: 600 }}>
            {summary.income > summary.expense
              ? "You are saving — good job!"
              : "Expenses exceed income"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tip: Review subscriptions & recurring expenses.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
