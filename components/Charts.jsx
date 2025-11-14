"use client";
import React, { useMemo } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
);

function groupByMonth(transactions) {
  const map = {};
  transactions.forEach((t) => {
    const key = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
    map[key] = map[key] || { income: 0, expense: 0 };
    if (t.type === "income") map[key].income += Number(t.amount);
    else map[key].expense += Number(t.amount);
  });
  return map;
}

export default function Charts({ transactions = [], categories = [] }) {
  const monthly = useMemo(() => groupByMonth(transactions), [transactions]);

  const labels = useMemo(() => {
    const keys = Object.keys(monthly).sort();
    return keys;
  }, [monthly]);

  const barData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: labels.map((l) => monthly[l]?.income || 0),
          stack: "a",
        },
        {
          label: "Expense",
          data: labels.map((l) => monthly[l]?.expense || 0),
          stack: "a",
        },
      ],
    };
  }, [labels, monthly]);

  const pieData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      }
    });
    const keys = Object.keys(map);
    return {
      labels: keys,
      datasets: [{ data: keys.map((k) => map[k]) }],
    };
  }, [transactions]);

  const lineData = useMemo(() => {
    // spending trend (expenses over time)
    const points = transactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return {
      labels: points.map((p) => p.date),
      datasets: [
        {
          label: "Expense",
          data: points.map((p) => p.amount),
          fill: false,
          tension: 0.2,
        },
      ],
    };
  }, [transactions]);

  const doughnutData = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);
    const saving = Math.max(income - expense, 0);
    return {
      labels: ["Income", "Expense", "Savings"],
      datasets: [{ data: [income, expense, saving] }],
    };
  }, [transactions]);

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1">Monthly Income vs Expense</Typography>
        <Bar data={barData} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1">Expense by Category</Typography>
        <Pie data={pieData} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1">Spending Trend</Typography>
        <Line data={lineData} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1">Savings Ratio</Typography>
        <Doughnut data={doughnutData} />
      </Paper>
    </Box>
  );
}
