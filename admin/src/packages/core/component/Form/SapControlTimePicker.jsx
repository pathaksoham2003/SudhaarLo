import React, { useState, useCallback, useMemo } from "react";
import { TextField, Typography, Box, MenuItem, useTheme } from "@mui/material";

/** Generate time slots for a given step in minutes. */
const generateSlots = (step = 5, disabledTimes = []) => {
  const slots = [];
  for (let m = 0; m < 1440; m += step) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    const t = `${hh}:${mm}`;
    slots.push({ value: t, label: t, disabled: disabledTimes.includes(t) });
  }
  return slots;
};

/**
 * SapControlTimePicker
 *
 * Time-only picker rendered as a select dropdown of time slots.
 * Supports minute-step granularity, min/max time constraints,
 * disabled specific times, text-mode toggle, and MUI theming.
 */
const SapControlTimePicker = ({
  value, onChange, onBlur,
  textMode = false, textModeEmptyState = "",
  required = false, readOnly = false, disabled = false,
  placeholder = "", label,
  minuteStep = 5, minTime = "", maxTime = "",
  disabledTimes = [],
  ariaDescribedBy = "", id = "", name = "",
  error: errorProp, helperText: helperTextProp,
  fullWidth = true, sx = {},
}) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);

  const slots = useMemo(
    () => generateSlots(minuteStep, disabledTimes),
    [minuteStep, disabledTimes]
  );

  const filteredSlots = useMemo(() => {
    let s = slots;
    if (minTime) s = s.filter((sl) => sl.value >= minTime);
    if (maxTime) s = s.filter((sl) => sl.value <= maxTime);
    return s;
  }, [slots, minTime, maxTime]);

  const validation = useMemo(() => {
    if (!touched) return null;
    if (required && !value) return "This field is required.";
    return null;
  }, [touched, required, value]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  const handleChange = useCallback((e) => { onChange && onChange(e.target.value); }, [onChange]);
  const handleBlur = useCallback(() => { setTouched(true); onBlur && onBlur(value); }, [onBlur, value]);

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
      select value={value ?? ""} onChange={handleChange} onBlur={handleBlur}
      label={label} placeholder={placeholder}
      required={required} disabled={disabled} error={hasError}
      helperText={displayHelper} fullWidth={fullWidth}
      id={id || undefined} name={name || undefined} size="small"
      slotProps={{ input: { readOnly, "aria-describedby": ariaDescribedBy || undefined } }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily }, ...sx }}
    >
      <MenuItem value=""><em>— Select Time —</em></MenuItem>
      {filteredSlots.map((sl) => (
        <MenuItem key={sl.value} value={sl.value} disabled={sl.disabled}>
          {sl.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SapControlTimePicker;
