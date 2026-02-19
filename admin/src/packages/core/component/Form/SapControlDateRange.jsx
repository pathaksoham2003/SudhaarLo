import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, useTheme } from "@mui/material";

/**
 * SapControlDateRange
 *
 * Two-field date range picker (start + end) with min/max
 * constraints, configurable display format, cross-field
 * validation, text-mode toggle, and MUI theming.
 */
const SapControlDateRange = ({
  startValue,
  endValue,
  onChange,
  onBlur,
  onSetTime,
  // Config
  textMode = false,
  textModeEmptyState = "",
  required = false,
  readOnly = false,
  disabled = false,
  startPlaceholder = "",
  endPlaceholder = "",
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

  const formatDisplay = useCallback(
    (val) => {
      if (!val) return "";
      try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const yyyy = String(d.getFullYear());
        return autoFormat.replace("MM", mm).replace("DD", dd).replace("YYYY", yyyy).replace("YY", yyyy.slice(-2));
      } catch { return val; }
    },
    [autoFormat]
  );

  const validation = useMemo(() => {
    if (!touched) return null;
    if (required && (!startValue || !endValue)) return "Both dates are required.";
    if (startValue && endValue && new Date(startValue) > new Date(endValue))
      return "Start date must be before end date.";
    if (startValue && minDate && new Date(startValue) < new Date(minDate))
      return `Start date must be on or after ${formatDisplay(minDate)}.`;
    if (endValue && maxDate && new Date(endValue) > new Date(maxDate))
      return `End date must be on or before ${formatDisplay(maxDate)}.`;
    return null;
  }, [touched, required, startValue, endValue, minDate, maxDate, formatDisplay]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  const emit = useCallback(
    (s, e) => {
      const payload = { startDate: s, endDate: e };
      onChange && onChange(payload);
      onSetTime && onSetTime(payload);
    },
    [onChange, onSetTime]
  );

  const handleStartChange = useCallback(
    (ev) => { emit(ev.target.value, endValue); },
    [emit, endValue]
  );

  const handleEndChange = useCallback(
    (ev) => { emit(startValue, ev.target.value); },
    [emit, startValue]
  );

  const handleBlur = useCallback(
    () => {
      setTouched(true);
      const payload = { startDate: startValue, endDate: endValue };
      onBlur && onBlur(payload);
      onSetTime && onSetTime(payload);
    },
    [onBlur, onSetTime, startValue, endValue]
  );

  if (textMode) {
    const display = startValue || endValue
      ? `${formatDisplay(startValue) || "—"}  →  ${formatDisplay(endValue) || "—"}`
      : textModeEmptyState || "—";
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Typography variant="body1">{display}</Typography>
      </Box>
    );
  }

  const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily } };

  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", ...sx }}>
      <TextField
        value={startValue ?? ""} onChange={handleStartChange} onBlur={handleBlur}
        type="date" label={label ? `${label} (Start)` : "Start"} placeholder={startPlaceholder}
        required={required} disabled={disabled} error={hasError} fullWidth={fullWidth}
        id={id ? `${id}-start` : undefined} name={name ? `${name}-start` : undefined}
        size="small"
        slotProps={{
          input: { readOnly, "aria-describedby": ariaDescribedBy || undefined },
          htmlInput: { min: minDate || undefined, max: maxDate || undefined },
          inputLabel: { shrink: true },
        }}
        sx={fieldSx}
      />
      <Typography variant="body2" sx={{ pt: 1.25, color: "text.secondary", flexShrink: 0 }}>to</Typography>
      <TextField
        value={endValue ?? ""} onChange={handleEndChange} onBlur={handleBlur}
        type="date" label={label ? `${label} (End)` : "End"} placeholder={endPlaceholder}
        required={required} disabled={disabled} error={hasError}
        helperText={displayHelper} fullWidth={fullWidth}
        id={id ? `${id}-end` : undefined} name={name ? `${name}-end` : undefined}
        size="small"
        slotProps={{
          input: { readOnly },
          htmlInput: { min: minDate || undefined, max: maxDate || undefined },
          inputLabel: { shrink: true },
        }}
        sx={fieldSx}
      />
    </Box>
  );
};

export default SapControlDateRange;
