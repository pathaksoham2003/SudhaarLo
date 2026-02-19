import React, { useCallback } from "react";
import { Box, Slider, Typography } from "@mui/material";

/**
 * SapControlSlider
 *
 * Range slider using MUI Slider. Supports single value or
 * range (two thumbs), configurable floor/ceil, text-mode
 * toggle, and MUI theming.
 */
const SapControlSlider = ({
  value,
  onChange,
  options = { floor: 0, ceil: 100 },
  textMode = false,
  disabled = false,
  label,
  step = 1,
  marks = false,
  valueLabelDisplay = "auto",
  sx = {},
}) => {

  const handleChange = useCallback(
    (_, newValue) => { onChange && onChange(newValue); },
    [onChange]
  );

  if (textMode) {
    const display = Array.isArray(value) ? `${value[0]} – ${value[1]}` : String(value ?? options.floor);
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Typography variant="body1">{display}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 1, ...sx }}>
      {label && (
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: "block" }}>
          {label}
        </Typography>
      )}
      <Slider
        value={value ?? options.floor}
        onChange={handleChange}
        min={options.floor}
        max={options.ceil}
        step={step}
        marks={marks}
        disabled={disabled}
        valueLabelDisplay={valueLabelDisplay}
        sx={{ color: "primary.main" }}
      />
    </Box>
  );
};

export default SapControlSlider;
