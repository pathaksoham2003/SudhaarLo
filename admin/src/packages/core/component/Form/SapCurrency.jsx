import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, InputAdornment, useTheme } from "@mui/material";

/**
 * SapCurrency
 *
 * Currency input with configurable prefix symbol, decimal
 * precision, thousands separator formatting, text-mode toggle,
 * and MUI theming. Formats the display on blur.
 */
const SapCurrency = ({
  value, onChange, onBlur, onFocus,
  textMode = false, textModeEmptyState = "",
  required = false, readOnly = false, disabled = false,
  prefix = "$", precision = 2, align = "right",
  placeholder = "",
  ariaDescribedBy = "", id = "", name = "",
  label, error: errorProp, helperText: helperTextProp,
  fullWidth = true, sx = {},
}) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);

  /** Format a number with thousands separator and decimal places. */
  const formatCurrency = useCallback(
    (val) => {
      if (val === null || val === undefined || val === "") return "";
      const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ""));
      if (isNaN(num)) return "";
      return num.toLocaleString("en-US", { minimumFractionDigits: precision, maximumFractionDigits: precision });
    },
    [precision]
  );

  const displayValue = useMemo(() => {
    if (focused) return value === null || value === undefined ? "" : String(value).replace(/[^0-9.-]/g, "");
    return formatCurrency(value);
  }, [value, focused, formatCurrency]);

  const validation = useMemo(() => {
    if (!touched) return null;
    if (required && (value === null || value === undefined || value === "")) return "This field is required.";
    return null;
  }, [touched, required, value]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  const handleChange = useCallback(
    (e) => {
      const raw = e.target.value;
      if (raw === "" || raw === "-" || /^-?\d*\.?\d*$/.test(raw)) {
        onChange && onChange(raw);
      }
    },
    [onChange]
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

  if (textMode) {
    const display = value !== null && value !== undefined && value !== ""
      ? `${prefix}${formatCurrency(value)}` : textModeEmptyState || "—";
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
        input: {
          readOnly,
          startAdornment: <InputAdornment position="start">{prefix}</InputAdornment>,
          "aria-describedby": ariaDescribedBy || undefined,
          sx: { textAlign: align },
        },
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily }, ...sx }}
    />
  );
};

export default SapCurrency;
