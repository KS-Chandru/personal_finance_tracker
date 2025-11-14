"use client";
import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Avatar,
  Tooltip,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4 from "@mui/icons-material/Brightness4";
import Brightness7 from "@mui/icons-material/Brightness7";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ThemeContext } from "../app/layout";

export default function Header() {
  const { mode, toggleMode } = useContext(ThemeContext);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "transparent",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <Toolbar sx={{ px: { xs: 1, md: 4 }, minHeight: 64 }}>
        <Paper
          component="form"
          sx={{
            p: "2px 8px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: 420,
          }}
        >
          <SearchIcon />
          <InputBase
            placeholder="Search transactions, categories..."
            sx={{ ml: 1, flex: 1 }}
          />
        </Paper>

        <Box sx={{ flex: 1 }} />

        <IconButton onClick={toggleMode} sx={{ ml: 1 }}>
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <IconButton sx={{ ml: 1 }}>
          <NotificationsIcon />
        </IconButton>

        <Tooltip title="Account">
          <IconButton sx={{ ml: 1 }}>
            <Avatar sx={{ width: 36, height: 36 }}>U</Avatar>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
