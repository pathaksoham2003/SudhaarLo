import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, useTheme } from "@mui/material";

/**
 * SapControlTextarea
 *
 * Multiline text input with character-count range display,
 * max/min length enforcement, text-mode toggle, and MUI theming.
 */
const SapControlTextarea = ({
  value,
  onChange,
  onBlur,
  rows = 10,
  maxLength = 500,
  disableMaxLength = false,
  minLength = 0,
  showRange = false,
  disableMaxLengthError = false,
  readOnly = false,
  textMode = false,
  textModeEmptyState = "",
  required = false,
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

  const safeMax = disableMaxLength ? undefined : Math.max(maxLength, 0) || 500;
  const safeMin = Math.max(minLength, 0);

  const validation = useMemo(() => {
    if (!touched) return null;
    const v = value ?? "";
    if (required && !v) return "This field is required.";
    if (!disableMaxLength && !disableMaxLengthError && safeMax && v.length > safeMax)
      return `Maximum ${safeMax} characters allowed.`;
    if (safeMin && v.length > 0 && v.length < safeMin)
      return `Minimum ${safeMin} characters required.`;
    return null;
  }, [value, touched, required, disableMaxLength, disableMaxLengthError, safeMax, safeMin]);

  const hasError = errorProp || !!validation;
  const currentLen = (value ?? "").length;

  // Build helper: validation message → range display → custom helperText
  const displayHelper = useMemo(() => {
    if (validation) return validation;
    if (helperTextProp) return helperTextProp;
    if (showRange && safeMax) return `${currentLen} / ${safeMax}`;
    return "";
  }, [validation, helperTextProp, showRange, safeMax, currentLen]);

  const handleChange = useCallback(
    (e) => {
      let v = e.target.value;
      if (!disableMaxLength && safeMax) v = v.slice(0, safeMax);
      onChange && onChange(v);
    },
    [onChange, disableMaxLength, safeMax]
  );

  const handleBlur = useCallback(
    (e) => { setTouched(true); onBlur && onBlur(e.target.value); },
    [onBlur]
  );

  if (textMode) {
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {value || textModeEmptyState || "—"}
        </Typography>
      </Box>
    );
  }

  return (
    <TextField
      value={value ?? ""} onChange={handleChange} onBlur={handleBlur}
      multiline rows={rows} label={label} placeholder={placeholder}
      required={required} disabled={disabled} error={hasError}
      helperText={displayHelper} fullWidth={fullWidth}
      id={id || undefined} name={name || undefined} size="small"
      slotProps={{
        input: { readOnly, "aria-describedby": ariaDescribedBy || undefined },
        htmlInput: { maxLength: disableMaxLength ? undefined : safeMax, minLength: safeMin || undefined },
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily }, ...sx }}
    />
  );
};

export default SapControlTextarea;
