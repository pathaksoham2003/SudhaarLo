import React, { useState, useCallback } from "react";
import { Box, Typography, Paper, TextField, IconButton, Popover } from "@mui/material";

const PRESET_COLORS = [
  "#CA1551", "#FF5B27", "#FFC527", "#21B584", "#0072CE",
  "#00BDFF", "#6C5CE7", "#303030", "#707070", "#005290",
  "#E91E63", "#9C27B0", "#3F51B5", "#009688", "#795548",
  "#FF9800", "#CDDC39", "#00BCD4", "#F44336", "#4CAF50",
];

/**
 * SapControlColorPicker
 *
 * Colour picker with a preset swatch grid and a native HTML
 * colour input for custom colours. Emits the selected hex value.
 */
const SapControlColorPicker = ({
  value,
  onChange,
  onEvent,
  label,
  presetColors = PRESET_COLORS,
  sx = {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePreset = useCallback(
    (color) => { onChange && onChange(color); },
    [onChange]
  );

  const handleNativeChange = useCallback(
    (e) => {
      onChange && onChange(e.target.value);
      onEvent && onEvent({ type: "slider", color: e.target.value });
    },
    [onChange, onEvent]
  );

  return (
    <Box sx={sx}>
      {label && (
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: "block" }}>
          {label}
        </Typography>
      )}

      {/* Swatch trigger */}
      <Box
        onClick={(e) => { setAnchorEl(e.currentTarget); onEvent && onEvent({ type: "open" }); }}
        sx={{
          width: 40, height: 40, borderRadius: 2, cursor: "pointer",
          bgcolor: value || "#ffffff",
          border: "2px solid", borderColor: "divider",
          transition: "box-shadow 0.2s",
          "&:hover": { boxShadow: "0 0 0 3px rgba(0,0,0,0.1)" },
        }}
      />

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => { setAnchorEl(null); onEvent && onEvent({ type: "close" }); }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Paper sx={{ p: 2, width: 240 }}>
          {/* Preset grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0.75, mb: 1.5 }}>
            {presetColors.map((color) => (
              <Box
                key={color}
                onClick={() => handlePreset(color)}
                sx={{
                  width: 36, height: 36, borderRadius: 1.5, cursor: "pointer",
                  bgcolor: color,
                  border: value === color ? "3px solid" : "2px solid transparent",
                  borderColor: value === color ? "primary.main" : "transparent",
                  transition: "transform 0.15s",
                  "&:hover": { transform: "scale(1.15)" },
                }}
              />
            ))}
          </Box>

          {/* Custom colour input */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <input
              type="color"
              value={value || "#000000"}
              onChange={handleNativeChange}
              style={{ width: 36, height: 36, border: "none", cursor: "pointer", borderRadius: 4, padding: 0 }}
            />
            <TextField
              value={value || ""}
              onChange={(e) => onChange && onChange(e.target.value)}
              size="small"
              placeholder="#000000"
              sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: "monospace", fontSize: 13 } }}
            />
          </Box>
        </Paper>
      </Popover>
    </Box>
  );
};

export default SapControlColorPicker;
