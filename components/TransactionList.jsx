"use client";
import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";

export default function TransactionList({
  transactions = [],
  onDelete,
  onEdit,
  onExportJSON,
  onExportCSV,
  onReset,
  categories = [],
  filters = {},
  setFilters,
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (
          q &&
          !`${t.description} ${t.category}`
            .toLowerCase()
            .includes(q.toLowerCase())
        )
          return false;
        if (filters.type && filters.type !== "all" && t.type !== filters.type)
          return false;
        if (
          filters.category &&
          filters.category !== "all" &&
          t.category !== filters.category
        )
          return false;
        if (filters.startDate && new Date(t.date) < new Date(filters.startDate))
          return false;
        if (filters.endDate && new Date(t.date) > new Date(filters.endDate))
          return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, q, filters]);

  return (
    <Paper sx={{ mt: 3, p: 2 }}>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
        <TextField
          size="small"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <TextField
          size="small"
          select
          label="Type"
          value={filters.type || "all"}
          onChange={(e) => setFilters((s) => ({ ...s, type: e.target.value }))}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
        <TextField
          size="small"
          select
          label="Category"
          value={filters.category || "all"}
          onChange={(e) =>
            setFilters((s) => ({ ...s, category: e.target.value }))
          }
        >
          <MenuItem value="all">All</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          type="date"
          label="Start"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate || ""}
          onChange={(e) =>
            setFilters((s) => ({ ...s, startDate: e.target.value }))
          }
        />
        <TextField
          size="small"
          type="date"
          label="End"
          InputLabelProps={{ shrink: true }}
          value={filters.endDate || ""}
          onChange={(e) =>
            setFilters((s) => ({ ...s, endDate: e.target.value }))
          }
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onExportCSV}>Export CSV</Button>
        <Button onClick={onExportJSON}>Export JSON</Button>
        <Button
          color="error"
          onClick={() => {
            if (confirm("Reset all data?")) onReset();
          }}
        >
          Reset
        </Button>
      </Box>

      <Divider sx={{ mb: 1 }} />

      <List dense>
        {filtered.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No transactions
          </Typography>
        )}
        {filtered.map((t) => (
          <ListItem key={t.id} divider>
            <ListItemText
              primary={`${t.type === "income" ? "+" : "-"} ₹${Number(
                t.amount
              ).toFixed(2)} — ${t.category}`}
              secondary={`${t.description || ""} • ${format(
                new Date(t.date),
                "dd MMM yyyy"
              )} • ${t.payment}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => onEdit && onEdit(t)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete && onDelete(t.id)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
