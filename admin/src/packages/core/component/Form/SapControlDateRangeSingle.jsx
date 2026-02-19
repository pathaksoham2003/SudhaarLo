import React, { useState, useCallback, useMemo } from "react";
import {
  TextField, Typography, Box, Button, Menu, MenuItem,
  Divider, useTheme,
} from "@mui/material";

const DEFAULT_RANGES = [
  { label: "Today", days: [0, 0] },
  { label: "Last 7 days", days: [-7, 0] },
  { label: "Last 30 days", days: [-30, 0] },
  { label: "Last month", months: -1 },
  { label: "Last 12 months", months: -12 },
  { label: "Last year", year: -1 },
  { label: "Week to date", wtd: true },
  { label: "Month to date", mtd: true },
  { label: "Year to date", ytd: true },
];

/** Resolve a preset range to { start, end } date strings (YYYY-MM-DD). */
const resolveRange = (range) => {
  const today = new Date();
  const fmt = (d) => d.toISOString().slice(0, 10);
  const end = fmt(today);
  if (range.days) {
    const s = new Date(today); s.setDate(s.getDate() + range.days[0]);
    return { startDate: fmt(s), endDate: end };
  }
  if (range.months) {
    const s = new Date(today); s.setMonth(s.getMonth() + range.months);
    return { startDate: fmt(s), endDate: end };
  }
  if (range.year) {
    const s = new Date(today); s.setFullYear(s.getFullYear() + range.year);
    return { startDate: fmt(s), endDate: end };
  }
  if (range.wtd) {
    const s = new Date(today); s.setDate(s.getDate() - s.getDay());
    return { startDate: fmt(s), endDate: end };
  }
  if (range.mtd) {
    const s = new Date(today.getFullYear(), today.getMonth(), 1);
    return { startDate: fmt(s), endDate: end };
  }
  if (range.ytd) {
    const s = new Date(today.getFullYear(), 0, 1);
    return { startDate: fmt(s), endDate: end };
  }
  return { startDate: "", endDate: "" };
};

/**
 * SapControlDateRangeSingle
 *
 * A single-field date range picker with preset range buttons
 * (Today, Last 7 days, Month to date, etc.) and an optional
 * custom range calendar. Uses MUI Menu for the preset list.
 */
const SapControlDateRangeSingle = ({
  value, // { startDate, endDate }
  onChange,
  onBlur,
  onSetTime,
  // Config
  textMode = false,
  textModeEmptyState = "",
  required = false,
  readOnly = false,
  disabled = false,
  label,
  minDate = "",
  maxDate = "",
  autoFormat = "MM/DD/YYYY",
  ranges,
  showCustomRangeLabel = false,
  alwaysShowCalendars = true,
  id = "",
  name = "",
  // MUI extras
  error: errorProp,
  helperText: helperTextProp,
  fullWidth = true,
  sx = {},
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  const presets = ranges || DEFAULT_RANGES;
  const startDate = value?.startDate || "";
  const endDate = value?.endDate || "";

  const formatDisplay = useCallback(
    (val) => {
      if (!val) return "";
      try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const yyyy = String(d.getFullYear());
        return autoFormat.replace("MM", mm).replace("DD", dd).replace("YYYY", yyyy);
      } catch { return val; }
    },
    [autoFormat]
  );

  const displayText = useMemo(() => {
    if (!startDate && !endDate) return "";
    return `${formatDisplay(startDate)} – ${formatDisplay(endDate)}`;
  }, [startDate, endDate, formatDisplay]);

  const validation = useMemo(() => {
    if (!touched) return null;
    if (required && (!startDate || !endDate)) return "Date range is required.";
    if (startDate && endDate && new Date(startDate) > new Date(endDate))
      return "Start date must be before end date.";
    return null;
  }, [touched, required, startDate, endDate]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  const emit = useCallback(
    (payload) => {
      onChange && onChange(payload);
      onSetTime && onSetTime(payload);
    },
    [onChange, onSetTime]
  );

  const handlePresetClick = useCallback(
    (preset) => {
      const resolved = resolveRange(preset);
      emit(resolved);
      setAnchorEl(null);
      setCustomOpen(false);
    },
    [emit]
  );

  if (textMode) {
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Typography variant="body1">{displayText || textModeEmptyState || "—"}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      {/* Display field */}
      <TextField
        value={displayText}
        onClick={(e) => !readOnly && !disabled && setAnchorEl(e.currentTarget)}
        onBlur={() => { setTouched(true); onBlur && onBlur(value); }}
        label={label}
        placeholder="Select date range"
        required={required}
        disabled={disabled}
        error={hasError}
        helperText={displayHelper}
        fullWidth={fullWidth}
        id={id || undefined}
        name={name || undefined}
        size="small"
        slotProps={{ input: { readOnly: true }, inputLabel: { shrink: true } }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily, cursor: "pointer" } }}
      />

      {/* Presets menu */}
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => { setAnchorEl(null); setCustomOpen(false); }}>
        {presets.map((preset, i) => (
          <MenuItem key={i} onClick={() => handlePresetClick(preset)} sx={{ fontSize: 14 }}>
            {preset.label}
          </MenuItem>
        ))}

        {(showCustomRangeLabel || alwaysShowCalendars) && <Divider />}
        {(showCustomRangeLabel || alwaysShowCalendars) && (
          <MenuItem onClick={() => setCustomOpen((p) => !p)} sx={{ fontSize: 14, fontWeight: 600 }}>
            Custom Range
          </MenuItem>
        )}

        {customOpen && (
          <Box sx={{ px: 2, pb: 2, pt: 1, display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              type="date" size="small" label="Start"
              value={startDate}
              onChange={(e) => emit({ startDate: e.target.value, endDate })}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: minDate || undefined, max: maxDate || undefined } }}
            />
            <Typography variant="body2" color="text.secondary">to</Typography>
            <TextField
              type="date" size="small" label="End"
              value={endDate}
              onChange={(e) => emit({ startDate, endDate: e.target.value })}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: minDate || undefined, max: maxDate || undefined } }}
            />
            <Button size="small" variant="contained" onClick={() => { setAnchorEl(null); setCustomOpen(false); }}>
              Apply
            </Button>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default SapControlDateRangeSingle;
