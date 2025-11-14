"use client";
import React, { useState, useMemo } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TransactionFormModal from "./TransactionFormModal";
import { motion } from "framer-motion";
import useTransactionsHook from "../lib/useTransactions";

export default function TransactionsPanel({
  transactions = [],
  categories = [],
  addTransaction,
  editTransaction,
  deleteTransaction,
  exportCSV,
  exportJSON,
  exportPDF,
  resetAll,
  filters,
  setFilters,
}) {
  // try to get color map from hook (if available)
  const { CATEGORY_COLORS } = useTransactionsHook() || {};
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const recent = useMemo(() => transactions.slice(0, 12), [transactions]);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">Transactions</Typography>
        <Box sx={{ flex: 1 }} />
        <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add
        </Button>
      </Box>

      <Divider sx={{ my: 1 }} />

      <List dense>
        {recent.length === 0 && (
          <Typography color="text.secondary">No transactions yet.</Typography>
        )}
        {recent.map((t) => (
          <motion.div key={t.id} whileHover={{ scale: 1.01 }}>
            <ListItem
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setEditing(t);
                      setOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => deleteTransaction && deleteTransaction(t.id)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Chip
                      label={t.category}
                      size="small"
                      sx={{
                        background:
                          (CATEGORY_COLORS && CATEGORY_COLORS[t.category]) ||
                          undefined,
                        color: "#fff",
                      }}
                    />
                    <Box sx={{ fontWeight: 700 }}>
                      {t.type === "income" ? "+" : "-"} ₹
                      {Number(t.amount).toFixed(2)}
                    </Box>
                  </Box>
                }
                secondary={`${t.description || ""} • ${t.date} • ${t.payment}`}
              />
            </ListItem>
          </motion.div>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button onClick={exportCSV}>Export CSV</Button>
        <Button onClick={exportJSON}>Export JSON</Button>
        <Button onClick={exportPDF}>Export PDF</Button>
        <Button
          color="error"
          onClick={() => {
            if (confirm("Reset all data?")) resetAll();
          }}
        >
          Reset
        </Button>
      </Box>

      <TransactionFormModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSave={(tx) => {
          editing ? editTransaction(tx) : addTransaction(tx);
          setOpen(false);
          setEditing(null);
        }}
        categories={categories}
        initial={editing}
      />
    </Paper>
  );
}
