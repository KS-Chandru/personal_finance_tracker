"use client";

import React, { createContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

export const ThemeContext = createContext(null);

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Only render app AFTER hydration
  }, []);

  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pf_theme") || "light";
    }
    return "light";
  });

  const toggleMode = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    localStorage.setItem("pf_theme", next);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  return (
    <html lang="en">
      <body>
        {mounted && (
          <ThemeContext.Provider value={{ mode, toggleMode }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </ThemeContext.Provider>
        )}
      </body>
    </html>
  );
}
