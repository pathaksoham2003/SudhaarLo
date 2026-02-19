import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, useTheme } from "@mui/material";

/**
 * SapControlDatetime
 *
 * Combined date + time picker using the native datetime-local
 * input. Supports min/max constraints, minute step, text-mode
 * toggle, required validation, and MUI theming.
 */
const SapControlDatetime = ({
  value, onChange, onBlur,
  textMode = false, textModeEmptyState = "",
  required = false, readOnly = false, disabled = false,
  label, placeholder = "",
  minDate = "", maxDate = "", minuteStep = 5,
  autoFormat = "MM/DD/YYYY",
  ariaDescribedBy = "", id = "", name = "",
  error: errorProp, helperText: helperTextProp,
  fullWidth = true, sx = {},
}) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);

  const formatDisplay = useCallback((val) => {
    if (!val) return "";
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const yyyy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");
      return `${autoFormat.replace("MM", mm).replace("DD", dd).replace("YYYY", String(yyyy))} ${hh}:${mi}`;
    } catch { return val; }
  }, [autoFormat]);

  const validation = useMemo(() => {
    if (!touched) return null;
    if (required && !value) return "This field is required.";
    if (value && minDate && new Date(value) < new Date(minDate)) return `Must be on or after ${formatDisplay(minDate)}.`;
    if (value && maxDate && new Date(value) > new Date(maxDate)) return `Must be on or before ${formatDisplay(maxDate)}.`;
    return null;
  }, [touched, required, value, minDate, maxDate, formatDisplay]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  const handleChange = useCallback((e) => { onChange && onChange(e.target.value); }, [onChange]);
  const handleBlur = useCallback((e) => { setTouched(true); onBlur && onBlur(e.target.value); }, [onBlur]);

  if (textMode) {
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Typography variant="body1">{value ? formatDisplay(value) : textModeEmptyState || "—"}</Typography>
      </Box>
    );
  }

  return (
    <TextField
      value={value ?? ""} onChange={handleChange} onBlur={handleBlur}
      type="datetime-local" label={label} placeholder={placeholder}
      required={required} disabled={disabled} error={hasError}
      helperText={displayHelper} fullWidth={fullWidth}
      id={id || undefined} name={name || undefined} size="small"
      slotProps={{
        input: { readOnly, "aria-describedby": ariaDescribedBy || undefined },
        htmlInput: { min: minDate || undefined, max: maxDate || undefined, step: minuteStep * 60 },
        inputLabel: { shrink: true },
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily }, ...sx }}
    />
  );
};

export default SapControlDatetime;
