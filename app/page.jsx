"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import TransactionsPanel from "../components/TransactionsPanel";
import ChartsPanel from "../components/ChartsPanel";
import useTransactions from "../lib/useTransactions";

export default function Page() {
  const tx = useTransactions();

  // single-page routing
  const [view, setView] = useState("overview"); // 'overview' | 'transactions' | 'analytics' | 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((s) => !s)}
        active={view}
        setActive={setView}
      />
      <Box component="main" sx={{ flex: 1 }}>
        <Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: { xs: 2, md: 4 },
            maxWidth: 1360,
            mx: "auto",
          }}
        >
          {view === "overview" && (
            <>
              <Dashboard
                summary={tx.summary}
                budget={tx.budget}
                setBudget={tx.setBudget}
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
                  gap: 3,
                  mt: 3,
                }}
              >
                <ChartsPanel
                  transactions={tx.transactions}
                  categories={tx.categories}
                />
                <TransactionsPanel
                  transactions={tx.transactions}
                  categories={tx.categories}
                  addTransaction={tx.addTransaction}
                  editTransaction={tx.editTransaction}
                  deleteTransaction={tx.deleteTransaction}
                  exportCSV={tx.exportCSV}
                  exportJSON={tx.exportJSON}
                  exportPDF={tx.exportPDF}
                  resetAll={tx.resetAll}
                  filters={tx.filters}
                  setFilters={tx.setFilters}
                />
              </Box>
            </>
          )}

          {view === "transactions" && (
            <TransactionsPanel
              transactions={tx.transactions}
              categories={tx.categories}
              addTransaction={tx.addTransaction}
              editTransaction={tx.editTransaction}
              deleteTransaction={tx.deleteTransaction}
              exportCSV={tx.exportCSV}
              exportJSON={tx.exportJSON}
              exportPDF={tx.exportPDF}
              resetAll={tx.resetAll}
              filters={tx.filters}
              setFilters={tx.setFilters}
            />
          )}

          {view === "analytics" && (
            <ChartsPanel
              transactions={tx.transactions}
              categories={tx.categories}
            />
          )}

          {view === "settings" && (
            <Box>
              {/* Simple settings panel — you can expand */}
              <h3>Settings</h3>
              <p>
                Manage budgets, recurring templates and export preferences here.
              </p>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
