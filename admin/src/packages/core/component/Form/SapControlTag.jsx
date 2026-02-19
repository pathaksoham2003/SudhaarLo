import React, { useState, useCallback, useMemo } from "react";
import {
  Box, TextField, Typography, Chip, MenuItem, Paper, useTheme,
} from "@mui/material";

/**
 * SapControlTag
 *
 * Tag/chip input with a searchable dropdown of available tags,
 * multi-select as chips, custom identifyBy/displayBy fields,
 * text-mode toggle, and MUI theming.
 */
const SapControlTag = ({
  value = [], // array of selected tag objects or ids
  onChange,
  // Data
  tags = [],
  identifyBy = "value",
  displayBy = "display",
  // Config
  required = false, readOnly = false, disabled = false,
  placeholder = "", label,
  id = "", name = "",
  textMode = false,
  // MUI extras
  error: errorProp, helperText: helperTextProp,
  fullWidth = true, sx = {},
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  const selectedIds = useMemo(
    () => (value || []).map((v) => (typeof v === "object" ? v[identifyBy] : v)),
    [value, identifyBy]
  );

  const filtered = useMemo(() => {
    const available = tags.filter((t) => !selectedIds.includes(t[identifyBy]));
    if (!inputValue.trim()) return available;
    const term = inputValue.toLowerCase();
    return available.filter((t) => String(t[displayBy] ?? "").toLowerCase().includes(term));
  }, [tags, selectedIds, inputValue, identifyBy, displayBy]);

  const getDisplay = useCallback(
    (v) => {
      const id = typeof v === "object" ? v[identifyBy] : v;
      const found = tags.find((t) => t[identifyBy] === id);
      return found ? found[displayBy] : id;
    },
    [tags, identifyBy, displayBy]
  );

  const handleAdd = useCallback(
    (tag) => {
      const next = [...(value || []), tag];
      onChange && onChange(next);
      setInputValue("");
    },
    [value, onChange]
  );

  const handleRemove = useCallback(
    (idx) => {
      const next = (value || []).filter((_, i) => i !== idx);
      onChange && onChange(next);
    },
    [value, onChange]
  );

  const validation = useMemo(() => {
    if (!touched) return null;
    if (required && (!value || !value.length)) return "At least one tag is required.";
    return null;
  }, [touched, required, value]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  if (textMode) {
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {(value || []).length ? value.map((v, i) => (
            <Chip key={i} label={getDisplay(v)} size="small" variant="outlined" />
          )) : <Typography variant="body2" color="text.secondary">—</Typography>}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", ...sx }}>
      {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: "block" }}>{label}</Typography>}

      {/* Selected chips */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: value?.length ? 1 : 0 }}>
        {(value || []).map((v, i) => (
          <Chip key={i} label={getDisplay(v)} size="small" onDelete={readOnly || disabled ? undefined : () => handleRemove(i)} />
        ))}
      </Box>

      {/* Search input */}
      {!readOnly && !disabled && (
        <TextField
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => { setTimeout(() => setOpen(false), 200); setTouched(true); }}
          placeholder={placeholder || "Add a tag…"}
          required={required && (!value || !value.length)}
          error={hasError} helperText={displayHelper} fullWidth={fullWidth}
          id={id || undefined} name={name || undefined} size="small"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily } }}
        />
      )}

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <Paper elevation={4} sx={{ position: "absolute", left: 0, right: 0, zIndex: 1300, maxHeight: 200, overflowY: "auto", mt: 0.5, borderRadius: 2 }}>
          {filtered.map((tag) => (
            <MenuItem key={tag[identifyBy]} onClick={() => handleAdd(tag)} sx={{ fontSize: 14 }}>
              {tag[displayBy]}
            </MenuItem>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default SapControlTag;
