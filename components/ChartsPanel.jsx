"use client";
import React, { useMemo } from "react";
import { Box, Paper, Typography, Chip, Stack } from "@mui/material";
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
} from "chart.js";
import { format, parseISO } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function groupByMonth(transactions) {
  const map = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    map[key] = map[key] || { income: 0, expense: 0 };
    if (t.type === "income") map[key].income += Number(t.amount);
    else map[key].expense += Number(t.amount);
  });
  return map;
}

export default function ChartsPanel({
  transactions = [],
  categories = [],
  colorMap = {},
}) {
  const monthly = useMemo(() => groupByMonth(transactions), [transactions]);
  const keys = useMemo(() => Object.keys(monthly).sort(), [monthly]);

  const barData = useMemo(
    () => ({
      labels: keys.map((k) => {
        const [y, m] = k.split("-");
        return format(new Date(Number(y), Number(m) - 1, 1), "MMM yyyy");
      }),
      datasets: [
        {
          label: "Income",
          data: keys.map((k) => monthly[k].income),
          backgroundColor: "#10B981",
        },
        {
          label: "Expense",
          data: keys.map((k) => monthly[k].expense),
          backgroundColor: "#EF4444",
        },
      ],
    }),
    [keys, monthly]
  );

  // pie: category colors (sorted by value desc)
  const pieData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type === "expense")
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const labels = entries.map((e) => e[0]);
    const data = entries.map((e) => e[1]);
    const bg = labels.map((l) => colorMap[l] || "#9CA3AF");
    return { labels, datasets: [{ data, backgroundColor: bg }] };
  }, [transactions, colorMap]);

  const lineData = useMemo(() => {
    const pts = transactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return {
      labels: pts.map((p) => format(parseISO(p.date), "dd MMM")),
      datasets: [
        {
          label: "Expense",
          data: pts.map((p) => p.amount),
          borderColor: "#EF4444",
          tension: 0.3,
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
    const save = Math.max(income - expense, 0);
    const colors = ["#06B6D4", "#EF4444", "#10B981"];
    return {
      labels: ["Income", "Expense", "Savings"],
      datasets: [{ data: [income, expense, save], backgroundColor: colors }],
    };
  }, [transactions]);

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Monthly Income vs Expense
        </Typography>
        <Bar data={barData} />
      </Paper>

      <Paper
        sx={{
          p: 2,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Expense by Category
          </Typography>
          <Pie data={pieData} />
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            {pieData.labels?.map((l, i) => (
              <Chip
                key={l}
                label={`${l} (${pieData.datasets[0].data[i]})`}
                size="small"
                sx={{ background: colorMap[l] || undefined, color: "#fff" }}
              />
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Savings Ratio
          </Typography>
          <Doughnut data={doughnutData} />
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Spending Trend
        </Typography>
        <Line data={lineData} />
      </Paper>
    </Box>
  );
}
