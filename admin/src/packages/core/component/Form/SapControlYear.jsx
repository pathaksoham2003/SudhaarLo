import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, MenuItem, useTheme } from "@mui/material";

/**
 * SapControlYear
 *
 * Year-only picker rendered as a native number field constrained
 * to 4 digits, or as a select dropdown of years.
 * Supports text-mode toggle, required validation, and MUI theming.
 */
const SapControlYear = ({
  value,
  onChange,
  onBlur,
  onSetTime,
  // Config
  textMode = false,
  textModeEmptyState = "",
  required = false,
  readOnly = false,
  disabled = false,
  placeholder = "",
  label,
  id = "",
  name = "",
  ariaDescribedBy = "",
  // Year range for dropdown mode
  minYear,
  maxYear,
  // MUI extras
  error: errorProp,
  helperText: helperTextProp,
  fullWidth = true,
  sx = {},
}) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);

  const currentYear = new Date().getFullYear();
  const lo = minYear || currentYear - 20;
  const hi = maxYear || currentYear + 10;
  const years = useMemo(() => {
    const arr = [];
    for (let y = hi; y >= lo; y--) arr.push(y);
    return arr;
  }, [lo, hi]);

  const validation = useMemo(() => {
    if (!touched) return null;
    if (required && !value) return "This field is required.";
    return null;
  }, [touched, required, value]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  const handleChange = useCallback(
    (e) => {
      const v = e.target.value;
      onChange && onChange(v);
      onSetTime && onSetTime(v);
    },
    [onChange, onSetTime]
  );

  const handleBlur = useCallback(
    () => { setTouched(true); onBlur && onBlur(value); },
    [onBlur, value]
  );

  if (textMode) {
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Typography variant="body1">{value || textModeEmptyState || "—"}</Typography>
      </Box>
    );
  }

  return (
    <TextField
      select
      value={value ?? ""}
      onChange={handleChange}
      onBlur={handleBlur}
      label={label}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      error={hasError}
      helperText={displayHelper}
      fullWidth={fullWidth}
      id={id || undefined}
      name={name || undefined}
      size="small"
      slotProps={{
        input: { readOnly, "aria-describedby": ariaDescribedBy || undefined },
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily }, ...sx }}
    >
      <MenuItem value="">
        <em>— Select Year —</em>
      </MenuItem>
      {years.map((y) => (
        <MenuItem key={y} value={y}>{y}</MenuItem>
      ))}
    </TextField>
  );
};

export default SapControlYear;
