"use client";
import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PieChartIcon from "@mui/icons-material/PieChart";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";

const drawerWidth = 260;
const collapsedWidth = 72;

export default function Sidebar({
  open = true,
  onToggle = () => {},
  active = "overview",
  setActive = () => {},
}) {
  const items = [
    { id: "overview", icon: <DashboardIcon />, label: "Overview" },
    {
      id: "transactions",
      icon: <AccountBalanceWalletIcon />,
      label: "Transactions",
    },
    { id: "analytics", icon: <PieChartIcon />, label: "Analytics" },
    { id: "settings", icon: <SettingsIcon />, label: "Settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        transition: "width .2s",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: "border-box",
          borderRight: "none",
          p: 2,
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>FE</Avatar>
        {open && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              FinEdge
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Personal Finance
            </Typography>
          </Box>
        )}
        <Box sx={{ flex: 1 }} />
        <IconButton size="small" onClick={onToggle}>
          {open ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <List>
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <motion.div
              key={it.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <ListItemButton
                selected={isActive}
                onClick={() => setActive(it.id)}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  py: 1.25,
                  px: open ? 1.5 : 0.75,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{it.icon}</ListItemIcon>
                {open && <ListItemText primary={it.label} />}
              </ListItemButton>
            </motion.div>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", pt: 2 }}>
        {open ? (
          <Typography variant="caption" color="text.secondary">
            Made with ♥
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary">
            v1
          </Typography>
        )}
      </Box>
    </Drawer>
  );
}
