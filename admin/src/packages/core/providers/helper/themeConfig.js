// themeConfig.js

import { createTheme } from "@mui/material";

export const COLORS = {
  primary: "#FAF6F6",
  secondary: "#CA1551",
  accent: "#001514",
  accentSub: "#505C5B",
  button: "#8CA3A2",
  inputBg: "#E7EAEA",
  textDark: "#001514",
  textLight: "#FAF6F6",
};

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      background: {
        default: mode === "light" ? COLORS.primary : COLORS.accent,
        paper: mode === "light" ? COLORS.primary : COLORS.accentSub,
      },
      text: {
        primary: mode === "light" ? COLORS.textDark : COLORS.textLight,
      },
      primary: { main: COLORS.secondary },
      secondary: { main: COLORS.button },
    },
    typography: {
      fontFamily: "Outfit, sans-serif",
      h4: { fontWeight: 700 },
      body1: { fontWeight: 400 },
    },
  });
