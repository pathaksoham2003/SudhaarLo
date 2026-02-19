import React, { useState, useCallback, useMemo } from "react";
import {
  Box, TextField, Typography, Chip, MenuItem, Select,
  InputAdornment, IconButton, FormControl, InputLabel,
  FormHelperText, useTheme,
} from "@mui/material";

/**
 * SapControlDropdown
 *
 * Searchable dropdown with single or multi-select, clearable
 * selection, text-mode toggle, custom id/display props, and
 * full MUI theming. Search-as-you-type filters the option list.
 */
const SapControlDropdown = ({
  value,
  onChange,
  onBlur,
  onFocus,
  onToggle,
  // Data
  items = [],
  idProp = "id",
  displayProp = "name",
  // Config
  multiple = false,
  enableSearchBox = false,
  clearable = false,
  fullObject = false,
  disableBlankItem = false,
  clearSearchOnAdd = false,
  // Display
  textMode = false,
  textModeEmptyState = "",
  required = false,
  disabled = false,
  placeholder = "",
  label = "— Select —",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [touched, setTouched] = useState(false);

  /* ---- Filtered items ---- */
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter((item) =>
      String(item[displayProp] ?? "").toLowerCase().includes(term)
    );
  }, [items, searchTerm, displayProp]);

  /* ---- Display helpers ---- */
  const getLabel = useCallback(
    (id) => {
      const found = items.find((i) => i[idProp] === id);
      return found ? found[displayProp] : id;
    },
    [items, idProp, displayProp]
  );

  const validation = useMemo(() => {
    if (!touched) return null;
    if (required) {
      if (multiple && (!value || !value.length)) return "At least one selection is required.";
      if (!multiple && !value && value !== 0) return "This field is required.";
    }
    return null;
  }, [touched, required, value, multiple]);

  const hasError = errorProp || !!validation;
  const displayHelper = helperTextProp || validation || "";

  /* ---- Handlers ---- */
  const handleChange = useCallback(
    (e) => {
      let v = e.target.value;
      if (clearSearchOnAdd) setSearchTerm("");
      if (fullObject) {
        if (multiple) {
          v = v.map((id) => items.find((i) => i[idProp] === id) || id);
        } else {
          v = items.find((i) => i[idProp] === v) || v;
        }
      }
      onChange && onChange(v);
    },
    [onChange, fullObject, multiple, items, idProp, clearSearchOnAdd]
  );

  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      onChange && onChange(multiple ? [] : "");
    },
    [onChange, multiple]
  );

  const handleBlur = useCallback(
    () => { setTouched(true); onBlur && onBlur(value); },
    [onBlur, value]
  );

  /* ---- Resolve value for MUI Select ---- */
  const selectValue = useMemo(() => {
    if (multiple) {
      if (!value) return [];
      return Array.isArray(value) ? value.map((v) => (fullObject ? v[idProp] : v)) : [];
    }
    return fullObject && value ? value[idProp] : (value ?? "");
  }, [value, multiple, fullObject, idProp]);

  /* ---- Text mode ---- */
  if (textMode) {
    let display = textModeEmptyState || "—";
    if (value) {
      if (multiple && Array.isArray(value)) {
        display = value.length ? value.map((v) => getLabel(fullObject ? v[idProp] : v)).join(", ") : display;
      } else {
        display = getLabel(fullObject ? value[idProp] : value) || display;
      }
    }
    return (
      <Box sx={{ py: 1, ...sx }}>
        {label && label !== "— Select —" && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Typography variant="body1">{display}</Typography>
      </Box>
    );
  }

  return (
    <FormControl fullWidth={fullWidth} size="small" error={hasError} disabled={disabled} sx={sx}>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        value={selectValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => onFocus && onFocus()}
        onOpen={() => onToggle && onToggle(true)}
        onClose={() => { onToggle && onToggle(false); setSearchTerm(""); }}
        multiple={multiple}
        required={required}
        label={label}
        id={id || undefined}
        name={name || undefined}
        displayEmpty
        renderValue={(sel) => {
          if (multiple) {
            if (!sel || !sel.length) return <em>{placeholder || "Select…"}</em>;
            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {sel.map((s) => <Chip key={s} label={getLabel(s)} size="small" />)}
              </Box>
            );
          }
          return sel ? getLabel(sel) : <em>{placeholder || "Select…"}</em>;
        }}
        endAdornment={
          clearable && ((multiple && selectValue.length > 0) || (!multiple && selectValue)) ? (
            <InputAdornment position="end" sx={{ mr: 2 }}>
              <IconButton size="small" onClick={handleClear} sx={{ fontSize: 14 }}>✕</IconButton>
            </InputAdornment>
          ) : null
        }
        MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
        inputProps={{ "aria-describedby": ariaDescribedBy || undefined }}
        sx={{ borderRadius: 2, fontFamily: theme.typography.fontFamily }}
      >
        {/* Search box */}
        {enableSearchBox && (
          <Box sx={{ px: 1.5, py: 1, position: "sticky", top: 0, bgcolor: "background.paper", zIndex: 1 }}>
            <TextField
              size="small" fullWidth placeholder="Search…"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              autoFocus
            />
          </Box>
        )}

        {/* Blank item */}
        {!multiple && !disableBlankItem && (
          <MenuItem value=""><em>— Select —</em></MenuItem>
        )}

        {/* Options */}
        {filtered.map((item) => (
          <MenuItem key={item[idProp]} value={item[idProp]}>
            {item[displayProp]}
          </MenuItem>
        ))}

        {filtered.length === 0 && (
          <MenuItem disabled><em>No results</em></MenuItem>
        )}
      </Select>
      {displayHelper && <FormHelperText>{displayHelper}</FormHelperText>}
    </FormControl>
  );
};

export default SapControlDropdown;
