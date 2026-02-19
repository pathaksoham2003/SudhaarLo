import React, { useState, useCallback, useMemo } from "react";
import {
  TextField, Typography, Box, Select, MenuItem,
  InputAdornment, useTheme,
} from "@mui/material";

const COUNTRIES = [
  { code: "US", dial: "+1", flag: "🇺🇸", name: "United States" },
  { code: "CA", dial: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
  { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
  { code: "JP", dial: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "CN", dial: "+86", flag: "🇨🇳", name: "China" },
  { code: "BR", dial: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "MX", dial: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "AE", dial: "+971", flag: "🇦🇪", name: "UAE" },
];

/**
 * SapControlPhone
 *
 * International phone input with country flag selector, dial-code
 * prefix, optional country dropdown, text-mode toggle, and MUI theming.
 */
const SapControlPhone = ({
  value, onChange, onBlur,
  textMode = false, textModeEmptyState = "",
  required = false, readOnly = false, disabled = false,
  initCountry = "US", allowDropdown = false, trimFirstZero = false,
  placeholder = "", autoComplete = "on", ariaDescribedBy = "",
  id = "", name = "",
  label, error: errorProp, helperText: helperTextProp,
  fullWidth = true, sx = {},
}) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);
  const [country, setCountry] = useState(
    () => COUNTRIES.find((c) => c.code === initCountry) || COUNTRIES[0]
  );

  const validation = useMemo(() => {
    if (!touched) return null;
    if (required && !value) return "This field is required.";
    return null;
  }, [value, touched, required]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  const handleChange = useCallback(
    (e) => {
      let v = e.target.value.replace(/[^\d\s\-()+ ]/g, "");
      if (trimFirstZero && v.startsWith("0")) v = v.slice(1);
      onChange && onChange(v);
    },
    [onChange, trimFirstZero]
  );

  const handleBlur = useCallback(
    (e) => { setTouched(true); onBlur && onBlur(e.target.value); },
    [onBlur]
  );

  if (textMode) {
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Typography variant="body1">
          {value ? `${country.flag} ${country.dial} ${value}` : textModeEmptyState || "—"}
        </Typography>
      </Box>
    );
  }

  return (
    <TextField
      value={value ?? ""} onChange={handleChange} onBlur={handleBlur}
      type="tel" inputMode="tel" label={label}
      placeholder={placeholder || "Phone number"}
      required={required} disabled={disabled} error={hasError}
      helperText={displayHelper} fullWidth={fullWidth}
      autoComplete={autoComplete} id={id || undefined} name={name || undefined} size="small"
      slotProps={{
        input: {
          readOnly,
          "aria-describedby": ariaDescribedBy || undefined,
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 0.5 }}>
              {allowDropdown ? (
                <Select
                  value={country.code}
                  onChange={(e) => setCountry(COUNTRIES.find((c) => c.code === e.target.value) || COUNTRIES[0])}
                  variant="standard" disableUnderline
                  sx={{ minWidth: 70, fontSize: 14, "& .MuiSelect-select": { py: 0 } }}
                  renderValue={(c) => {
                    const ct = COUNTRIES.find((x) => x.code === c);
                    return ct ? `${ct.flag} ${ct.dial}` : c;
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <MenuItem key={c.code} value={c.code} sx={{ fontSize: 14 }}>
                      {c.flag} {c.dial} {c.name}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                  {country.flag} {country.dial}
                </Typography>
              )}
            </InputAdornment>
          ),
        },
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily }, ...sx }}
    />
  );
};

export default SapControlPhone;
