"use client";
import React from "react";
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Dashboard from "../components/Dashboard";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Charts from "../components/Charts";
import BottomNavMobile from "../components/BottomNavMobile";
import useTransactions from "../lib/useTransactions";

export default function Page({ mode, toggleMode }) {
  // custom hook manages transactions, categories, budgets, exports
  const tx = useTransactions();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Personal Finance Tracker
          </Typography>
          <IconButton
            onClick={toggleMode}
            color="inherit"
            edge="end"
            aria-label="theme"
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
        <Dashboard
          transactions={tx.transactions}
          budget={tx.budget}
          setBudget={tx.setBudget}
        />
        <Box sx={{ mt: 3, display: "grid", gap: 16 }}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <TransactionForm
                categories={tx.categories}
                onAdd={tx.addTransaction}
                onAddCategory={tx.addCategory}
              />
              <TransactionList
                transactions={tx.transactions}
                onDelete={tx.deleteTransaction}
                onEdit={tx.editTransaction}
                onExportJSON={tx.exportJSON}
                onExportCSV={tx.exportCSV}
                onReset={tx.resetAll}
                categories={tx.categories}
                filters={tx.filters}
                setFilters={tx.setFilters}
              />
            </Box>

            <Box sx={{ width: { xs: "100%", md: 480 } }}>
              <Charts
                transactions={tx.transactions}
                categories={tx.categories}
              />
            </Box>
          </Box>

          {/* mobile bottom nav */}
          <BottomNavMobile
            balance={tx.summary.balance}
            income={tx.summary.income}
            expense={tx.summary.expense}
          />
        </Box>
      </Container>
    </Box>
  );
}
