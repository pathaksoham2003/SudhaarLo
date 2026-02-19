import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, useTheme } from "@mui/material";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * SapControlEmail
 *
 * Email input with built-in format validation, text-mode toggle,
 * max length enforcement, and full MUI theming.
 */
const SapControlEmail = ({
  value,
  onChange,
  onBlur,
  maxLength = 100,
  disableMaxLength = false,
  readOnly = false,
  textMode = false,
  textModeEmptyState = "",
  required = false,
  placeholder = "",
  autoComplete = "on",
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

  const safeMax = disableMaxLength ? undefined : Math.max(maxLength, 0) || 100;

  const validation = useMemo(() => {
    if (!touched) return null;
    const v = value ?? "";
    if (required && !v) return "This field is required.";
    if (v && !EMAIL_RE.test(v)) return "Please enter a valid email address.";
    if (!disableMaxLength && safeMax && v.length > safeMax)
      return `Maximum ${safeMax} characters allowed.`;
    return null;
  }, [value, touched, required, disableMaxLength, safeMax]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

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
        <Typography variant="body1">{value || textModeEmptyState || "—"}</Typography>
      </Box>
    );
  }

  return (
    <TextField
      value={value ?? ""} onChange={handleChange} onBlur={handleBlur}
      type="email" label={label} placeholder={placeholder}
      required={required} disabled={disabled} error={hasError}
      helperText={displayHelper} fullWidth={fullWidth}
      autoComplete={autoComplete} id={id || undefined} name={name || undefined}
      size="small"
      slotProps={{
        input: { readOnly, "aria-describedby": ariaDescribedBy || undefined },
        htmlInput: { maxLength: disableMaxLength ? undefined : safeMax },
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily }, ...sx }}
    />
  );
};

export default SapControlEmail;
