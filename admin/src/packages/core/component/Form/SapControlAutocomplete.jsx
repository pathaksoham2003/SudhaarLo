import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  TextField, Typography, Box, Paper, MenuItem, Chip,
  CircularProgress, InputAdornment, IconButton, useTheme,
} from "@mui/material";

/**
 * SapControlAutocomplete
 *
 * Searchable autocomplete input with debounced search, single or
 * multi-select (chip display), custom search function support,
 * display-field configuration, text-mode toggle, and MUI theming.
 */
const SapControlAutocomplete = ({
  value, onChange, onBlur,
  onOptionsChange,
  // Data
  items = [],
  search: customSearch,
  displayField = "label",
  idField = "value",
  // Config
  type = "singleselect", // "singleselect" | "multiselect"
  searchDebounceTime = 300,
  inputMinLength = 1,
  // Display
  textMode = false, textModeEmptyState = "",
  required = false, readOnly = false, disabled = false,
  placeholder = "", label,
  ariaDescribedBy = "", id = "", name = "",
  error: errorProp, helperText: helperTextProp,
  fullWidth = true, sx = {},
}) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(items);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const isMulti = type === "multiselect";

  // Sync external items
  useEffect(() => { if (!customSearch) setOptions(items); }, [items, customSearch]);

  // Debounced search
  useEffect(() => {
    if (!inputValue || inputValue.length < inputMinLength) {
      if (!customSearch) setOptions(items);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (customSearch) {
        setLoading(true);
        try {
          const results = await customSearch(inputValue);
          setOptions(results || []);
          onOptionsChange && onOptionsChange({ options: results, searchTerm: inputValue });
        } finally { setLoading(false); }
      } else {
        const term = inputValue.toLowerCase();
        const filtered = items.filter((i) =>
          String(i[displayField] ?? "").toLowerCase().includes(term)
        );
        setOptions(filtered);
        onOptionsChange && onOptionsChange({ options: filtered, searchTerm: inputValue });
      }
    }, searchDebounceTime);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue, customSearch, items, displayField, searchDebounceTime, inputMinLength, onOptionsChange]);

  const validation = useMemo(() => {
    if (!touched) return null;
    if (required) {
      if (isMulti && (!value || !value.length)) return "At least one selection is required.";
      if (!isMulti && !value) return "This field is required.";
    }
    return null;
  }, [touched, required, value, isMulti]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  const getDisplay = useCallback(
    (v) => {
      if (!v) return "";
      if (typeof v === "object") return v[displayField] || "";
      const found = items.find((i) => i[idField] === v);
      return found ? found[displayField] : v;
    },
    [items, displayField, idField]
  );

  const handleSelect = useCallback(
    (item) => {
      if (isMulti) {
        const current = Array.isArray(value) ? value : [];
        const exists = current.some((v) => (typeof v === "object" ? v[idField] : v) === item[idField]);
        const next = exists
          ? current.filter((v) => (typeof v === "object" ? v[idField] : v) !== item[idField])
          : [...current, item];
        onChange && onChange(next);
      } else {
        onChange && onChange(item);
        setInputValue(item[displayField] || "");
        setOpen(false);
      }
    },
    [onChange, value, isMulti, idField, displayField]
  );

  const handleRemoveChip = useCallback(
    (idx) => {
      if (!isMulti || !Array.isArray(value)) return;
      const next = value.filter((_, i) => i !== idx);
      onChange && onChange(next);
    },
    [onChange, value, isMulti]
  );

  /* ---- Text mode ---- */
  if (textMode) {
    let display = textModeEmptyState || "—";
    if (value) {
      if (isMulti && Array.isArray(value)) {
        display = value.length ? value.map(getDisplay).join(", ") : display;
      } else {
        display = getDisplay(value) || display;
      }
    }
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Typography variant="body1">{display}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", ...sx }}>
      {/* Multi-select chips */}
      {isMulti && Array.isArray(value) && value.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
          {value.map((v, i) => (
            <Chip key={i} label={getDisplay(v)} size="small" onDelete={() => handleRemoveChip(i)} />
          ))}
        </Box>
      )}

      <TextField
        value={inputValue}
        onChange={(e) => { setInputValue(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => { setTimeout(() => setOpen(false), 200); setTouched(true); onBlur && onBlur(value); }}
        label={label} placeholder={placeholder || "Type to search…"}
        required={required} disabled={disabled} error={hasError}
        helperText={displayHelper} fullWidth={fullWidth}
        id={id || undefined} name={name || undefined} size="small"
        slotProps={{
          input: {
            readOnly,
            "aria-describedby": ariaDescribedBy || undefined,
            endAdornment: loading ? (
              <InputAdornment position="end"><CircularProgress size={18} /></InputAdornment>
            ) : inputValue ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => { setInputValue(""); onChange && onChange(isMulti ? value : null); }} sx={{ fontSize: 14 }}>✕</IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily } }}
      />

      {/* Dropdown */}
      {open && options.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute", top: "100%", left: 0, right: 0,
            zIndex: 1300, maxHeight: 250, overflowY: "auto", mt: 0.5,
            borderRadius: 2,
          }}
        >
          {options.map((item, i) => {
            const isSelected = isMulti && Array.isArray(value) &&
              value.some((v) => (typeof v === "object" ? v[idField] : v) === item[idField]);
            return (
              <MenuItem
                key={item[idField] ?? i}
                onClick={() => handleSelect(item)}
                selected={isSelected}
                sx={{ fontSize: 14 }}
              >
                {item[displayField]}
              </MenuItem>
            );
          })}
        </Paper>
      )}
    </Box>
  );
};

export default SapControlAutocomplete;
