"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export default function TransactionForm({
  categories = [],
  onAdd,
  onAddCategory,
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    category: categories[0] || "Other",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    payment: "Cash",
    type: "expense",
    recurring: false,
  });
  const [newCat, setNewCat] = useState("");

  const openForm = () => setOpen(true);
  const closeForm = () => setOpen(false);

  const handleChange = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = () => {
    if (!form.amount || Number(form.amount) === 0) return alert("Enter amount");
    const tx = { ...form, id: uuidv4(), amount: Number(form.amount) };
    onAdd && onAdd(tx);
    setForm({
      amount: "",
      category: categories[0] || "Other",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      payment: "Cash",
      type: "expense",
      recurring: false,
    });
    closeForm();
  };

  const addCategory = () => {
    const c = newCat.trim();
    if (!c) return;
    onAddCategory && onAddCategory(c);
    setNewCat("");
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Button variant="contained" onClick={openForm}>
          Add Transaction
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setForm((s) => ({
              ...s,
              type: s.type === "expense" ? "income" : "expense",
            }));
          }}
        >
          Toggle Income/Expense (Current: {form.type})
        </Button>
      </Box>

      <Dialog open={open} onClose={closeForm} fullWidth>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="Amount"
            value={form.amount}
            onChange={handleChange("amount")}
            type="number"
            fullWidth
          />
          <TextField
            label="Category"
            select
            value={form.category}
            onChange={handleChange("category")}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="New Category"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <Button onClick={addCategory} sx={{ alignSelf: "center" }}>
              Add
            </Button>
          </Box>
          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange("description")}
          />
          <TextField
            label="Date"
            type="date"
            value={form.date}
            onChange={handleChange("date")}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Payment Mode"
            value={form.payment}
            onChange={handleChange("payment")}
            select
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Cancel</Button>
          <Button onClick={submit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
