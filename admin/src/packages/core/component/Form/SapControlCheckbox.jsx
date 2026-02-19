import React, { useCallback } from "react";
import {
  Checkbox, FormControlLabel, Typography, Box, useTheme,
} from "@mui/material";

/** Map spec colour names → MUI colour prop values. */
const COLOR_MAP = {
  primary: "primary", secondary: "secondary", success: "success",
  info: "info", danger: "error", warning: "warning",
};

/**
 * SapControlCheckbox
 *
 * Themed checkbox with text-mode toggle, true/false value
 * mapping, colour variants, inline layout, and MUI theming.
 */
const SapControlCheckbox = ({
  checked,
  onChange,
  value = "",
  label,
  textMode = false,
  alternateTextMode = false,
  required = false,
  id = "",
  name = "",
  color = "primary",
  displayInline = false,
  isTrueFalse = false,
  trueValue = "",
  falseValue = "",
  disabled = false,
  readOnly = false,
  indeterminate = false,
  ariaLabel,
  sx = {},
}) => {
  const theme = useTheme();
  const muiColor = COLOR_MAP[color] || "primary";
  const isDisabled = disabled || readOnly;

  const handleChange = useCallback(
    (e) => {
      if (readOnly) return;
      if (isTrueFalse) {
        onChange && onChange(e.target.checked ? trueValue : falseValue);
      } else {
        onChange && onChange(e.target.checked);
      }
    },
    [onChange, readOnly, isTrueFalse, trueValue, falseValue]
  );

  /* ---- Text mode ---- */
  if (textMode) {
    const isChecked = isTrueFalse ? value === trueValue : !!checked;
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
            width: 18, height: 18, borderRadius: 1,
            border: "2px solid",
            borderColor: isChecked ? muiColor + ".main" : "action.disabled",
            bgcolor: isChecked ? muiColor + ".main" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700, lineHeight: 1,
          }}
        >
          {isChecked ? "✓" : ""}
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
  const checkbox = (
    <Checkbox
      checked={isTrueFalse ? value === trueValue : !!checked}
      onChange={handleChange}
      disabled={isDisabled}
      color={muiColor}
      indeterminate={indeterminate}
      required={required}
      id={id || undefined}
      name={name || undefined}
      value={value}
      inputProps={{ "aria-label": ariaLabel || label || undefined }}
      sx={!label ? sx : undefined}
    />
  );

  if (!label) return checkbox;

  return (
    <FormControlLabel
      control={checkbox}
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

export default SapControlCheckbox;
