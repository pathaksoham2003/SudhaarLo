import React, { useState, useCallback, useMemo } from "react";
import {
  Box, TextField, Typography, Chip, MenuItem, Select,
  InputAdornment, IconButton, FormControl, InputLabel,
  FormHelperText, ListSubheader, useTheme,
} from "@mui/material";

/**
 * SapControlSelect
 *
 * Grouped, searchable select dropdown with single or multi-select,
 * clearable selection, text-mode toggle, custom id/display/group
 * props, and full MUI theming. Inline search filters as you type.
 */
const SapControlSelect = ({
  value,
  onChange,
  onToggle,
  // Data
  items = [],
  idProp = "id",
  displayProp = "name",
  groupBy = null,
  defaultLabel = "",
  defaultValue = "",
  // Config
  multiple = false,
  fullObject = false,
  clearable = true,
  inlineSearchable = true,
  // Display
  textMode = false,
  textModeEmptyState = "",
  required = false,
  disabled = false,
  placeholder = "",
  label,
  id = "",
  name = "",
  // MUI extras
  error: errorProp,
  helperText: helperTextProp,
  fullWidth = true,
  sx = {},
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [touched, setTouched] = useState(false);

  /* ---- Normalise items ---- */
  const normItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        [idProp]: item[idProp] ?? defaultValue,
        [displayProp]: item[displayProp] ?? defaultLabel,
      })),
    [items, idProp, displayProp, defaultLabel, defaultValue]
  );

  /* ---- Filter ---- */
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return normItems;
    const term = searchTerm.toLowerCase();
    return normItems.filter((item) =>
      String(item[displayProp] ?? "").toLowerCase().includes(term)
    );
  }, [normItems, searchTerm, displayProp]);

  /* ---- Group ---- */
  const grouped = useMemo(() => {
    if (!groupBy) return null;
    const map = {};
    filtered.forEach((item) => {
      const g = item[groupBy] || "Other";
      if (!map[g]) map[g] = [];
      map[g].push(item);
    });
    return map;
  }, [filtered, groupBy]);

  /* ---- Display helpers ---- */
  const getLabel = useCallback(
    (id) => {
      const found = normItems.find((i) => i[idProp] === id);
      return found ? found[displayProp] : id;
    },
    [normItems, idProp, displayProp]
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

  const handleChange = useCallback(
    (e) => {
      let v = e.target.value;
      if (fullObject) {
        v = multiple
          ? v.map((id) => normItems.find((i) => i[idProp] === id) || id)
          : normItems.find((i) => i[idProp] === v) || v;
      }
      onChange && onChange(v);
    },
    [onChange, fullObject, multiple, normItems, idProp]
  );

  const handleClear = useCallback(
    (e) => { e.stopPropagation(); onChange && onChange(multiple ? [] : ""); },
    [onChange, multiple]
  );

  const selectValue = useMemo(() => {
    if (multiple) return Array.isArray(value) ? value.map((v) => (fullObject ? v[idProp] : v)) : [];
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
        {label && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.25, display: "block" }}>{label}</Typography>}
        <Typography variant="body1">{display}</Typography>
      </Box>
    );
  }

  /* ---- Build menu items (with optional grouping) ---- */
  const renderOptions = () => {
    if (grouped) {
      return Object.entries(grouped).flatMap(([group, gItems]) => [
        <ListSubheader key={`group-${group}`} sx={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {group}
        </ListSubheader>,
        ...gItems.map((item) => (
          <MenuItem key={item[idProp]} value={item[idProp]} sx={{ pl: 4 }}>
            {item[displayProp]}
          </MenuItem>
        )),
      ]);
    }
    return filtered.map((item) => (
      <MenuItem key={item[idProp]} value={item[idProp]}>
        {item[displayProp]}
      </MenuItem>
    ));
  };

  return (
    <FormControl fullWidth={fullWidth} size="small" error={hasError} disabled={disabled} sx={sx}>
      {label && <InputLabel shrink>{label}</InputLabel>}
      <Select
        value={selectValue}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
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
            return <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>{sel.map((s) => <Chip key={s} label={getLabel(s)} size="small" />)}</Box>;
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
        MenuProps={{ PaperProps: { sx: { maxHeight: 300 } }, autoFocus: false }}
        sx={{ borderRadius: 2, fontFamily: theme.typography.fontFamily }}
      >
        {/* Inline search */}
        {inlineSearchable && (
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

        {!multiple && <MenuItem value=""><em>— None —</em></MenuItem>}
        {renderOptions()}
        {filtered.length === 0 && <MenuItem disabled><em>No results</em></MenuItem>}
      </Select>
      {displayHelper && <FormHelperText>{displayHelper}</FormHelperText>}
    </FormControl>
  );
};

export default SapControlSelect;
