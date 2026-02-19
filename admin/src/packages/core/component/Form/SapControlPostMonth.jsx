import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, useTheme } from "@mui/material";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * SapControlPostMonth
 *
 * Month + year picker. Uses the native month input type and
 * displays the selected month in a human-readable format.
 * Supports text-mode toggle, required validation, and MUI theming.
 */
const SapControlPostMonth = ({
  value, // "YYYY-MM" string
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
  // MUI extras
  error: errorProp,
  helperText: helperTextProp,
  fullWidth = true,
  sx = {},
}) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);

  const formatDisplay = useCallback((val) => {
    if (!val) return "";
    const [y, m] = String(val).split("-");
    const mi = parseInt(m, 10) - 1;
    return mi >= 0 && mi < 12 ? `${MONTHS[mi]} ${y}` : val;
  }, []);

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
    (e) => { setTouched(true); onBlur && onBlur(e.target.value); },
    [onBlur]
  );

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
      type="month" label={label} placeholder={placeholder}
      required={required} disabled={disabled} error={hasError}
      helperText={displayHelper} fullWidth={fullWidth}
      id={id || undefined} name={name || undefined} size="small"
      slotProps={{
        input: { readOnly, "aria-describedby": ariaDescribedBy || undefined },
        inputLabel: { shrink: true },
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily }, ...sx }}
    />
  );
};

export default SapControlPostMonth;
