"use client";
import { useEffect, useMemo, useState } from "react";

// storage keys
const STORAGE_KEY = "pf_transactions_pro_v2";
const CATEGORIES_KEY = "pf_categories_pro_v2";
const BUDGET_KEY = "pf_budget_pro_v2";
const TEMPLATES_KEY = "pf_recurring_templates_v1";

const defaultCategories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Salary",
  "Investment",
  "Other",
];

// category colors (expand as needed)
const CATEGORY_COLORS = {
  Food: "#F97316",
  Travel: "#06B6D4",
  Shopping: "#8B5CF6",
  Bills: "#EF4444",
  Salary: "#10B981",
  Investment: "#6366F1",
  Other: "#9CA3AF",
};

export default function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      // normalize dates to YYYY-MM-DD
      const normalized = parsed.map((t) => ({
        ...t,
        date: new Date(t.date).toISOString().slice(0, 10),
      }));
      // return normalized (we will also add recurring occurrences from templates below via lazy-init)
      return normalized;
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

  const [templates, setTemplates] = useState(() => {
    try {
      const raw = localStorage.getItem(TEMPLATES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    startDate: "",
    endDate: "",
  });

  // persistors
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
  useEffect(() => {
    try {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    } catch {}
  }, [templates]);

  // helper: month key YYYY-MM
  const monthKey = (date = new Date()) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  // ensure templates produce one transaction per current month (lazy init via effect is acceptable here because it reacts to templates/transactions state changes)
  useEffect(() => {
    // For each template, check if current month occurrence exists; if not, create one
    const nowKey = monthKey(new Date());
    const newOnes = [];
    templates.forEach((tpl) => {
      // tpl.templateId used to mark occurrences by templateId
      const exists = transactions.some(
        (t) =>
          t.templateId &&
          t.templateId === tpl.templateId &&
          t.date.slice(0, 7) === nowKey
      );
      if (!exists) {
        // create occurrence for this month with same day as tpl.day (or tpl.date day)
        const base = new Date();
        const [y, m] = nowKey.split("-"); // YYYY-MM
        const day = tpl.day || new Date(tpl.date).getDate();
        const occDate = new Date(Number(y), Number(m) - 1, Math.min(day, 28)); // keep safe
        const occ = {
          id: crypto?.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(36),
          amount: tpl.amount,
          category: tpl.category,
          description: tpl.description,
          date: occDate.toISOString().slice(0, 10),
          payment: tpl.payment || "Auto",
          type: tpl.type,
          recurring: true,
          templateId: tpl.templateId,
        };
        newOnes.push(occ);
      }
    });
    if (newOnes.length) {
      setTransactions((s) => [...newOnes, ...s]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // CRUD
  const addTransaction = (tx) => {
    // if recurring true, also create or update a template
    if (tx.recurring) {
      const tpl = {
        templateId:
          tx.templateId ||
          (crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36)),
        amount: tx.amount,
        category: tx.category,
        description: tx.description,
        date: tx.date,
        day: new Date(tx.date).getDate(),
        payment: tx.payment,
        type: tx.type,
      };
      setTemplates((s) => {
        // if template exists (matching by some fields) skip adding duplicate
        if (s.some((t) => t.templateId === tpl.templateId)) return s;
        return [tpl, ...s];
      });
      // ensure tx carries templateId so occurrences are linked
      tx = { ...tx, templateId: tpl.templateId };
    }
    setTransactions((s) => [tx, ...s]);
  };

  const editTransaction = (tx) =>
    setTransactions((s) => s.map((t) => (t.id === tx.id ? tx : t)));
  const deleteTransaction = (id) =>
    setTransactions((s) => s.filter((t) => t.id !== id));
  const addCategory = (cat) => {
    if (!cat) return;
    setCategories((s) => (s.includes(cat) ? s : [...s, cat]));
  };

  // exports
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

  // export PDF (jsPDF if available, fallback to opening printable window)
  const exportPDF = async () => {
    try {
      // try jsPDF
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("Transactions Report", 14, 20);
      doc.setFontSize(10);
      let y = 30;
      transactions.slice(0, 100).forEach((t) => {
        doc.text(
          `${t.date} | ${t.type} | ₹${t.amount} | ${t.category} | ${t.description}`,
          14,
          y
        );
        y += 8;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save(`pf_transactions_${new Date().toISOString().slice(0, 10)}.pdf`);
      return;
    } catch (e) {
      // fallback: open printable window
      const html = `
      <html><head><title>Transactions</title></head><body>
        <h2>Transactions</h2>
        <pre>${transactions
          .map(
            (t) =>
              `${t.date} | ${t.type} | ₹${t.amount} | ${t.category} | ${t.description}`
          )
          .join("\n")}</pre>
      </body></html>`;
      const w = window.open("", "_blank");
      w.document.write(html);
      w.document.close();
      w.print();
    }
  };

  const resetAll = () => {
    setTransactions([]);
    setCategories(defaultCategories);
    setBudget({});
    setTemplates([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
      localStorage.removeItem(BUDGET_KEY);
      localStorage.removeItem(TEMPLATES_KEY);
    } catch {}
  };

  const summary = useMemo(() => {
    let income = 0,
      expense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") income += Number(t.amount);
      else expense += Number(t.amount);
    });
    return { income, expense, balance: income - expense };
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    categories,
    addCategory,
    budget,
    setBudget,
    filters,
    setFilters,
    exportCSV,
    exportJSON,
    exportPDF,
    resetAll,
    summary,
    templates,
    CATEGORY_COLORS,
  };
}
