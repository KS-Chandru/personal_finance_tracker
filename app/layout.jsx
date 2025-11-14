"use client";

import React, { useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  // ✅ FIX: Load theme directly in useState (React-recommended)
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem("pf_theme") || "light";
    } catch {
      return "light";
    }
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1976d2" },
          secondary: { main: "#9c27b0" },
        },
      }),
    [mode]
  );

  const toggleMode = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    try {
      localStorage.setItem("pf_theme", next);
    } catch {}
  };

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {React.cloneElement(children, { mode, toggleMode })}
        </ThemeProvider>
      </body>
    </html>
  );
}
