import React, { useState, useCallback } from "react";
import { Box, TextField, IconButton, Typography, useTheme } from "@mui/material";

/**
 * SapControlInlineEditor
 *
 * Inline text editor that toggles between a read-only label
 * and an editable input with save (✓) and cancel (✕) buttons.
 * Ideal for in-place name/title editing.
 */
const SapControlInlineEditor = ({
  value,
  onChange,
  onSave,
  onCancel,
  maxLength = 100,
  disableMaxLength = false,
  placeholder = "",
  label,
  readOnly = false,
  sx = {},
}) => {
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  const safeMax = disableMaxLength ? undefined : Math.max(maxLength, 0) || 100;

  const startEditing = useCallback(() => {
    if (readOnly) return;
    setDraft(value ?? "");
    setEditing(true);
  }, [value, readOnly]);

  const handleSave = useCallback(() => {
    setEditing(false);
    onChange && onChange(draft);
    onSave && onSave(draft);
  }, [draft, onChange, onSave]);

  const handleCancel = useCallback(() => {
    setEditing(false);
    setDraft(value ?? "");
    onCancel && onCancel(value);
  }, [value, onCancel]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleSave();
      if (e.key === "Escape") handleCancel();
    },
    [handleSave, handleCancel]
  );

  if (!editing) {
    return (
      <Box
        onClick={startEditing}
        sx={{
          display: "inline-flex", alignItems: "center", gap: 1,
          cursor: readOnly ? "default" : "pointer",
          py: 0.5, px: 1, borderRadius: 1.5,
          transition: "background 0.2s",
          "&:hover": readOnly ? {} : { bgcolor: "action.hover" },
          ...sx,
        }}
      >
        {label && (
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mr: 0.5 }}>
            {label}:
          </Typography>
        )}
        <Typography variant="body1" sx={{ fontFamily: theme.typography.fontFamily }}>
          {value || placeholder || "—"}
        </Typography>
        {!readOnly && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            ✎
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, ...sx }}>
      <TextField
        value={draft}
        onChange={(e) => {
          let v = e.target.value;
          if (!disableMaxLength && safeMax) v = v.slice(0, safeMax);
          setDraft(v);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        size="small"
        autoFocus
        slotProps={{ htmlInput: { maxLength: disableMaxLength ? undefined : safeMax } }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontFamily: theme.typography.fontFamily } }}
      />
      <IconButton size="small" onClick={handleSave} color="success" sx={{ fontSize: 16 }}>
        ✓
      </IconButton>
      <IconButton size="small" onClick={handleCancel} color="error" sx={{ fontSize: 16 }}>
        ✕
      </IconButton>
    </Box>
  );
};

export default SapControlInlineEditor;
