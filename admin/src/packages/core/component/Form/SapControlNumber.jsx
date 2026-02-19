import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, useTheme } from "@mui/material";

/**
 * SapControlNumber
 *
 * Numeric input with decimal formatting, min/max constraints,
 * non-negative validation, text-mode toggle, and MUI theming.
 */
const SapControlNumber = ({
  value,
  onChange,
  onBlur,
  onFocus,
  maxLength = 100,
  disableMaxLength = false,
  readOnly = false,
  textMode = false,
  textModeEmptyState = "",
  required = false,
  nonNegative = false,
  decimals = 2,
  min = null,
  max = null,
  isBlank = false,
  placeholder = "",
  ariaDescribedBy = "",
  id = "",
  name = "",
  disabled = false,
  label,
  error: errorProp,
  helperText: helperTextProp,
  fullWidth = true,
  sx = {},
}) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);

  const safeMax = disableMaxLength ? undefined : Math.max(maxLength, 0) || 100;

  /* ---- Format display value ---- */
  const displayValue = useMemo(() => {
    if (value === null || value === undefined || value === "") {
      if (isBlank) return Number(0).toFixed(decimals);
      return "";
    }
    if (focused) return String(value);
    return Number(value).toFixed(decimals);
  }, [value, focused, decimals, isBlank]);

  /* ---- Validation ---- */
  const validation = useMemo(() => {
    if (!touched) return null;
    const v = value;
    if (required && (v === null || v === undefined || v === "")) return "This field is required.";
    if (v === null || v === undefined || v === "") return null;
    const num = Number(v);
    if (isNaN(num)) return "Please enter a valid number.";
    if (nonNegative && num < 0) return "Value must not be negative.";
    if (min !== null && num < min) return `Value must be at least ${min}.`;
    if (max !== null && num > max) return `Value must be at most ${max}.`;
    return null;
  }, [value, touched, required, nonNegative, min, max]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  /* ---- Handlers ---- */
  const handleChange = useCallback(
    (e) => {
      const raw = e.target.value;
      if (raw === "" || raw === "-") {
        onChange && onChange(raw === "-" ? raw : "");
        return;
      }
      // Allow valid partial numbers (e.g. "12.", "-0.")
      if (/^-?\d*\.?\d*$/.test(raw)) {
        if (!disableMaxLength && safeMax && raw.replace(/[^0-9]/g, "").length > safeMax) return;
        onChange && onChange(raw);
      }
    },
    [onChange, disableMaxLength, safeMax]
  );

  const handleBlur = useCallback(
    (e) => {
      setTouched(true);
      setFocused(false);
      const raw = e.target.value;
      const num = parseFloat(raw);
      if (!isNaN(num)) onChange && onChange(num);
      onBlur && onBlur(isNaN(num) ? raw : num);
    },
    [onChange, onBlur]
  );

  const handleFocus = useCallback(
    () => { setFocused(true); onFocus && onFocus(); },
    [onFocus]
  );

  /* ---- Text mode ---- */
  if (textMode) {
    const display = value !== null && value !== undefined && value !== ""
      ? Number(value).toFixed(decimals)
      : textModeEmptyState || "—";
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Typography variant="body1">{display}</Typography>
      </Box>
    );
  }

  return (
    <TextField
      value={displayValue} onChange={handleChange}
      onBlur={handleBlur} onFocus={handleFocus}
      type="text" inputMode="decimal"
      label={label} placeholder={placeholder}
      required={required} disabled={disabled} error={hasError}
      helperText={displayHelper} fullWidth={fullWidth}
      id={id || undefined} name={name || undefined} size="small"
      slotProps={{
        input: { readOnly, "aria-describedby": ariaDescribedBy || undefined },
        htmlInput: { inputMode: "decimal" },
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily }, ...sx }}
    />
  );
};

export default SapControlNumber;
