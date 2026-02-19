import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, InputAdornment, useTheme } from "@mui/material";

/* ── SSN helpers ─────────────────────────────────────────────── */
const SSN_MAX = 11; // XXX-XX-XXXX
const formatSSN = (raw) => {
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};
const validateSSN = (digits) => {
  if (digits.length < 9) return null; // incomplete
  const a = digits.slice(0, 3), b = digits.slice(3, 5), c = digits.slice(5);
  if (a === "666" || a === "000" || a[0] === "9") return "Invalid SSN area number.";
  if (b === "00") return "Invalid SSN group number.";
  if (c === "0000") return "Invalid SSN serial number.";
  return null;
};

/**
 * SapControlInput
 *
 * General-purpose text / password input with text-mode toggle,
 * max/min length enforcement, SSN masking, and full MUI theming.
 */
const SapControlInput = ({
  value,
  onChange,
  onBlur,
  onKeyDown,
  // HTML input
  type = "text",
  maxLength = 100,
  disableMaxLength = false,
  minLength = 0,
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
  // SSN
  isSSN = false,
  // MUI extras
  label,
  error: errorProp,
  helperText: helperTextProp,
  fullWidth = true,
  sx = {},
}) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);

  const safeMax = disableMaxLength ? undefined : Math.max(maxLength, 0) || 100;
  const safeMin = Math.max(minLength, 0);

  /* ---- Validation ---- */
  const validation = useMemo(() => {
    if (!touched) return null;
    const v = value ?? "";
    if (required && !v) return "This field is required.";
    if (!disableMaxLength && safeMax && v.length > safeMax)
      return `Maximum ${safeMax} characters allowed.`;
    if (safeMin && v.length > 0 && v.length < safeMin)
      return `Minimum ${safeMin} characters required.`;
    if (isSSN) {
      const digits = String(v).replace(/\D/g, "");
      return validateSSN(digits);
    }
    return null;
  }, [value, touched, required, disableMaxLength, safeMax, safeMin, isSSN]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  /* ---- Handlers ---- */
  const handleChange = useCallback(
    (e) => {
      let v = e.target.value;
      if (isSSN) v = formatSSN(v);
      else if (!disableMaxLength && safeMax) v = v.slice(0, safeMax);
      onChange && onChange(v);
    },
    [onChange, isSSN, disableMaxLength, safeMax]
  );

  const handleBlur = useCallback(
    (e) => {
      setTouched(true);
      onBlur && onBlur(e.target.value);
    },
    [onBlur]
  );

  const handleKeyDown = useCallback(
    (e) => onKeyDown && onKeyDown(e.key),
    [onKeyDown]
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
          {value || textModeEmptyState || "—"}
        </Typography>
      </Box>
    );
  }

  /* ---- Input mode ---- */
  return (
    <TextField
      value={value ?? ""}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      type={isSSN ? "text" : type}
      label={label}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      error={hasError}
      helperText={displayHelper}
      fullWidth={fullWidth}
      autoComplete={autoComplete}
      id={id || undefined}
      name={name || undefined}
      size="small"
      slotProps={{
        input: {
          readOnly,
          "aria-describedby": ariaDescribedBy || undefined,
          ...(isSSN && { inputMode: "numeric" }),
        },
        htmlInput: {
          maxLength: isSSN ? SSN_MAX : disableMaxLength ? undefined : safeMax,
          minLength: safeMin || undefined,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          fontFamily: theme.typography.fontFamily,
        },
        ...sx,
      }}
    />
  );
};

export default SapControlInput;
