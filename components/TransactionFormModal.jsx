"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";

export default function TransactionFormModal({
  open,
  onClose,
  onSave,
  categories = [],
  initial = null,
}) {
  const [form, setForm] = useState({
    amount: "",
    category: categories[0] || "Other",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    payment: "Cash",
    type: "expense",
    recurring: false,
  });

  useEffect(() => {
    if (initial) {
      setForm({ ...initial });
    } else {
      setForm((s) => ({
        ...s,
        amount: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
      }));
    }
  }, [initial, categories]);

  const change = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = () => {
    if (!form.amount || Number(form.amount) <= 0)
      return alert("Enter valid amount");
    const tx = {
      ...form,
      id:
        initial?.id ||
        (crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36)),
    };
    onSave && onSave(tx);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initial ? "Edit Transaction" : "Add Transaction"}
      </DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
        <TextField
          label="Amount"
          type="number"
          value={form.amount}
          onChange={change("amount")}
          fullWidth
        />
        <TextField
          label="Category"
          select
          value={form.category}
          onChange={change("category")}
        >
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Description"
          value={form.description}
          onChange={change("description")}
          fullWidth
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label="Date"
            type="date"
            value={form.date}
            onChange={change("date")}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Payment"
            select
            value={form.payment}
            onChange={change("payment")}
            fullWidth
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>
          {initial ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
