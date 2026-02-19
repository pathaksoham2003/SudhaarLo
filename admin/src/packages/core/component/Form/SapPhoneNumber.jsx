import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, useTheme } from "@mui/material";

const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const formatPhone = (raw) => {
  const digits = raw.replace(/\D/g, "").slice(0, 15);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

/**
 * SapPhoneNumber
 *
 * Formatted phone-number input with auto-formatting as the user
 * types, max-length enforcement, text-mode toggle, and MUI theming.
 */
const SapPhoneNumber = ({
  value, onChange, onBlur,
  textMode = false, textModeEmptyState = "",
  required = false, readOnly = false, disabled = false,
  placeholder = "", autoComplete = "on",
  maxLength = 100, disableMaxLength = false,
  ariaDescribedBy = "", id = "", name = "",
  label, error: errorProp, helperText: helperTextProp,
  fullWidth = true, sx = {},
}) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);
  const safeMax = disableMaxLength ? undefined : Math.max(maxLength, 0) || 100;

  const validation = useMemo(() => {
    if (!touched) return null;
    const v = value ?? "";
    if (required && !v) return "This field is required.";
    if (v && !PHONE_RE.test(v.replace(/[\s()-]/g, ""))) return "Please enter a valid phone number.";
    return null;
  }, [value, touched, required]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  const handleChange = useCallback(
    (e) => { const v = formatPhone(e.target.value); onChange && onChange(v); },
    [onChange]
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
      type="tel" inputMode="tel" label={label} placeholder={placeholder || "(555) 123-4567"}
      required={required} disabled={disabled} error={hasError}
      helperText={displayHelper} fullWidth={fullWidth}
      autoComplete={autoComplete} id={id || undefined} name={name || undefined} size="small"
      slotProps={{
        input: { readOnly, "aria-describedby": ariaDescribedBy || undefined },
        htmlInput: { maxLength: disableMaxLength ? undefined : safeMax },
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily }, ...sx }}
    />
  );
};

export default SapPhoneNumber;
