import React, { useCallback } from "react";
import {
  Radio, FormControlLabel, Typography, Box, useTheme,
} from "@mui/material";

const COLOR_MAP = {
  primary: "primary", secondary: "secondary", success: "success",
  info: "info", danger: "error", warning: "warning",
};

/**
 * SapControlRadio
 *
 * Themed radio button with text-mode toggle, colour variants,
 * inline layout, and MUI theming.
 *
 * Usage: Wrap multiple SapControlRadio components in an MUI
 * RadioGroup for mutual exclusion, or manage state manually.
 */
const SapControlRadio = ({
  checked,
  onChange,
  value = "",
  label,
  textMode = false,
  alternateTextMode = false,
  required = false,
  radioId = "",
  name = "",
  color = "primary",
  displayInline = false,
  disabled = false,
  readOnly = false,
  sx = {},
}) => {
  const theme = useTheme();
  const muiColor = COLOR_MAP[color] || "primary";
  const isDisabled = disabled || readOnly;

  const handleChange = useCallback(
    (e) => { if (!readOnly) onChange && onChange(e.target.value); },
    [onChange, readOnly]
  );

  /* ---- Text mode ---- */
  if (textMode) {
    return (
      <Box
        sx={{
          display: displayInline ? "inline-flex" : "flex",
          alignItems: "center", gap: 1, py: 0.5,
          opacity: alternateTextMode ? 0.6 : 1,
          ...sx,
        }}
      >
        <Box
          sx={{
            width: 18, height: 18, borderRadius: "50%",
            border: "2px solid",
            borderColor: checked ? muiColor + ".main" : "action.disabled",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {checked && (
            <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: muiColor + ".main" }} />
          )}
        </Box>
        {label && (
          <Typography variant="body2" color={alternateTextMode ? "text.secondary" : "text.primary"}>
            {label}
          </Typography>
        )}
      </Box>
    );
  }

  /* ---- Interactive mode ---- */
  const radio = (
    <Radio
      checked={!!checked}
      onChange={handleChange}
      value={value}
      disabled={isDisabled}
      color={muiColor}
      required={required}
      id={radioId || undefined}
      name={name || undefined}
      sx={!label ? sx : undefined}
    />
  );

  if (!label) return radio;

  return (
    <FormControlLabel
      control={radio}
      label={label}
      sx={{
        display: displayInline ? "inline-flex" : "flex",
        mr: displayInline ? 3 : 0,
        "& .MuiFormControlLabel-label": {
          fontFamily: theme.typography.fontFamily,
          fontSize: 14,
        },
        ...sx,
      }}
    />
  );
};

export default SapControlRadio;
