import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, IconButton, InputAdornment, useTheme } from "@mui/material";

/**
 * SapControlDate
 *
 * Date picker input with min/max constraints, configurable display
 * format, text-mode toggle, and MUI theming. Uses the native HTML
 * date input under the hood for broad browser support.
 */
const SapControlDate = ({
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
  minDate = "",
  maxDate = "",
  autoFormat = "MM/DD/YYYY",
  id = "",
  name = "",
  ariaDescribedBy = "",
  // MUI extras
  error: errorProp,
  helperText: helperTextProp,
  fullWidth = true,
  sx = {},
}) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);

  /* ---- Format a date string for display ---- */
  const formatDisplay = useCallback(
    (val) => {
      if (!val) return "";
      try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const yyyy = String(d.getFullYear());
        return autoFormat
          .replace("MM", mm)
          .replace("DD", dd)
          .replace("YYYY", yyyy)
          .replace("YY", yyyy.slice(-2));
      } catch {
        return val;
      }
    },
    [autoFormat]
  );

  /* ---- Validation ---- */
  const validation = useMemo(() => {
    if (!touched) return null;
    if (required && !value) return "This field is required.";
    if (value && minDate && new Date(value) < new Date(minDate))
      return `Date must be on or after ${formatDisplay(minDate)}.`;
    if (value && maxDate && new Date(value) > new Date(maxDate))
      return `Date must be on or before ${formatDisplay(maxDate)}.`;
    return null;
  }, [touched, required, value, minDate, maxDate, formatDisplay]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  /* ---- Handlers ---- */
  const handleChange = useCallback(
    (e) => {
      const v = e.target.value;
      onChange && onChange(v);
      onSetTime && onSetTime(v);
    },
    [onChange, onSetTime]
  );

  const handleBlur = useCallback(
    (e) => {
      setTouched(true);
      const v = e.target.value;
      onBlur && onBlur(v);
      onSetTime && onSetTime(v);
    },
    [onBlur, onSetTime]
  );

  /* ---- Text mode ---- */
  if (textMode) {
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && (
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>
            {label}
          </Typography>
        )}
        <Typography variant="body1">
          {value ? formatDisplay(value) : textModeEmptyState || "—"}
        </Typography>
      </Box>
    );
  }

  return (
    <TextField
      value={value ?? ""}
      onChange={handleChange}
      onBlur={handleBlur}
      type="date"
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
        input: {
          readOnly,
          "aria-describedby": ariaDescribedBy || undefined,
        },
        htmlInput: {
          min: minDate || undefined,
          max: maxDate || undefined,
        },
        inputLabel: { shrink: true },
      }}
      sx={{
        "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily },
        ...sx,
      }}
    />
  );
};

export default SapControlDate;
