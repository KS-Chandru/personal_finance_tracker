"use client";
import React, { useMemo } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";
import { format } from "date-fns";

export default function Dashboard({
  transactions = [],
  budget = {},
  setBudget,
}) {
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") income += Number(t.amount);
      else expense += Number(t.amount);
    });
    return {
      income,
      expense,
      balance: income - expense,
      highestCategory: (() => {
        const map = {};
        transactions.forEach((t) => {
          if (t.type === "expense") {
            map[t.category] = (map[t.category] || 0) + Number(t.amount);
          }
        });
        const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
        return entries[0]
          ? { category: entries[0][0], amount: entries[0][1] }
          : null;
      })(),
    };
  }, [transactions]);

  const monthLabel = format(new Date(), "MMMM yyyy");

  const budgetValue = budget?.amount ? Number(budget.amount) : 0;
  const spentThisMonth = summary.expense;
  const progress =
    budgetValue > 0 ? Math.min((spentThisMonth / budgetValue) * 100, 100) : 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Overview - {monthLabel}</Typography>
            <Typography variant="h5">Balance</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              ₹{summary.balance.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Income: ₹{summary.income.toFixed(2)} • Expense: ₹
              {summary.expense.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Budget</Typography>
            <Typography variant="h6">
              ₹{budgetValue.toFixed(2)} monthly
            </Typography>
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Spent: ₹{spentThisMonth.toFixed(2)} ({progress.toFixed(0)}%)
              </Typography>
              {budgetValue > 0 && progress >= 100 && (
                <Typography color="error" sx={{ mt: 1 }}>
                  Budget exceeded!
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Insights</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Highest expense category:
            </Typography>
            <Typography variant="h6">
              {summary.highestCategory
                ? `${
                    summary.highestCategory.category
                  } — ₹${summary.highestCategory.amount.toFixed(2)}`
                : "N/A"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Tip: Track recurring expenses to spot savings.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
