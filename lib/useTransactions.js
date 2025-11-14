"use client";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "pf_transactions_v1";
const CATEGORIES_KEY = "pf_categories_v1";
const BUDGET_KEY = "pf_budget_v1";

const defaultCategories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Salary",
  "Investment",
  "Other",
];

export default function useTransactions() {
  // --------------------------------------------------------
  // ✅ LAZY INIT — SAFE, NO WARNINGS
  // --------------------------------------------------------

  const [transactions, setTransactions] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      // ensure dates are normalized to YYYY-MM-DD
      return parsed.map((t) => ({
        ...t,
        date: new Date(t.date).toISOString().slice(0, 10),
      }));
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const raw = localStorage.getItem(CATEGORIES_KEY);
      return raw ? JSON.parse(raw) : defaultCategories;
    } catch {
      return defaultCategories;
    }
  });

  const [budget, setBudget] = useState(() => {
    try {
      const raw = localStorage.getItem(BUDGET_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    startDate: "",
    endDate: "",
  });

  // --------------------------------------------------------
  // ✅ SAVE TO LOCALSTORAGE WHEN DATA CHANGES
  // --------------------------------------------------------

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
    } catch {}
  }, [budget]);

  // --------------------------------------------------------
  // CRUD FUNCTIONS
  // --------------------------------------------------------

  const addTransaction = (tx) => {
    setTransactions((s) => [tx, ...s]);
  };

  const deleteTransaction = (id) => {
    setTransactions((s) => s.filter((t) => t.id !== id));
  };

  const editTransaction = (updated) => {
    setTransactions((s) => s.map((t) => (t.id === updated.id ? updated : t)));
  };

  const addCategory = (cat) => {
    if (!cat) return;
    setCategories((s) => (s.includes(cat) ? s : [...s, cat]));
  };

  // --------------------------------------------------------
  // EXPORT FUNCTIONS
  // --------------------------------------------------------

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pf_transactions_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const cols = [
      "id",
      "date",
      "type",
      "amount",
      "category",
      "description",
      "payment",
    ];
    const rows = transactions.map((t) =>
      cols
        .map((c) => `"${(t[c] || "").toString().replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [cols.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pf_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------------
  // RESET ALL DATA
  // --------------------------------------------------------

  const resetAll = () => {
    setTransactions([]);
    setCategories(defaultCategories);
    setBudget({});

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
      localStorage.removeItem(BUDGET_KEY);
    } catch {}
  };

  // --------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------

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
    };
  }, [transactions]);

  // --------------------------------------------------------
  // RETURN PUBLIC API
  // --------------------------------------------------------

  return {
    transactions,
    setTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,

    categories,
    addCategory,

    budget,
    setBudget,

    filters,
    setFilters,

    exportJSON,
    exportCSV,
    resetAll,
    summary,
  };
}
