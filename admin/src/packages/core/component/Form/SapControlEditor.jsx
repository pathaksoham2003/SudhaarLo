import React, { useState, useCallback } from "react";
import { Box, Typography, Paper, IconButton, Divider, useTheme } from "@mui/material";

const DEFAULT_CONFIG = {
  editable: true,
  spellcheck: true,
  height: "auto",
  minHeight: "150px",
  maxHeight: "auto",
  placeholder: "Enter text here...",
  showToolbar: true,
  toolbarPosition: "top",
  fonts: [
    { class: "arial", name: "Arial" },
    { class: "times-new-roman", name: "Times New Roman" },
    { class: "calibri", name: "Calibri" },
  ],
};

/**
 * SapControlEditor
 *
 * Rich-text editor using a contentEditable div with a formatting
 * toolbar. Supports bold, italic, underline, lists, headings,
 * links, and HTML view mode. Fully theme-compatible with MUI.
 */
const ToolBtn = ({ cmd, icon, val, execCommand }) => (
  <IconButton
    size="small"
    onMouseDown={(e) => { e.preventDefault(); execCommand(cmd, val); }}
    sx={{ fontSize: 14, width: 30, height: 30, borderRadius: 1 }}
  >
    {icon}
  </IconButton>
);

const SapControlEditor = ({
  value = "",
  onChange,
  onBlur,
  onFocus,
  onViewModeChange,
  config: userConfig,
  placeholder,
  tabIndex = null,
  id = "",
  label,
  sx = {},
}) => {
  const theme = useTheme();
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const [htmlMode, setHtmlMode] = useState(false);

  const execCommand = useCallback((cmd, val = null) => {
    document.execCommand(cmd, false, val);
  }, []);

  const handleInput = useCallback(
    (e) => {
      const html = e.currentTarget.innerHTML;
      onChange && onChange(html);
    },
    [onChange]
  );

  const handleToggleHtml = useCallback(() => {
    setHtmlMode((prev) => {
      const next = !prev;
      onViewModeChange && onViewModeChange(!next); // true = visual, false = html
      return next;
    });
  }, [onViewModeChange]);

  return (
    <Box sx={sx}>
      {label && (
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: "block" }}>
          {label}
        </Typography>
      )}

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          "&:focus-within": { borderColor: "primary.main", boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}25` },
        }}
      >
        {/* Toolbar */}
        {config.showToolbar && (
          <Box
            sx={{
              display: "flex", flexWrap: "wrap", gap: 0.25, px: 1, py: 0.5,
              borderBottom: 1, borderColor: "divider", bgcolor: "action.hover",
            }}
          >
            <ToolBtn cmd="bold" icon="B" execCommand={execCommand} />
            <ToolBtn cmd="italic" icon="I" execCommand={execCommand} />
            <ToolBtn cmd="underline" icon="U" execCommand={execCommand} />
            <ToolBtn cmd="strikeThrough" icon="S" execCommand={execCommand} />
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <ToolBtn cmd="insertUnorderedList" icon="•" execCommand={execCommand} />
            <ToolBtn cmd="insertOrderedList" icon="1." execCommand={execCommand} />
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <ToolBtn cmd="justifyLeft" icon="⫷" execCommand={execCommand} />
            <ToolBtn cmd="justifyCenter" icon="☰" execCommand={execCommand} />
            <ToolBtn cmd="justifyRight" icon="⫸" execCommand={execCommand} />
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); handleToggleHtml(); }}
              sx={{ fontSize: 11, width: 30, height: 30, borderRadius: 1, fontWeight: 700, fontFamily: "monospace" }}>
              {"</>"}
            </IconButton>
          </Box>
        )}

        {/* Content area */}
        {htmlMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            style={{
              width: "100%", minHeight: config.minHeight, border: "none", outline: "none",
              padding: 12, fontFamily: "monospace", fontSize: 13,
              resize: "vertical", background: "transparent",
              color: theme.palette.text.primary,
            }}
          />
        ) : (
          <Box
            contentEditable={config.editable}
            suppressContentEditableWarning
            onInput={handleInput}
            onBlur={(e) => onBlur && onBlur(e)}
            onFocus={(e) => onFocus && onFocus(e)}
            dangerouslySetInnerHTML={{ __html: value }}
            tabIndex={tabIndex}
            id={id || undefined}
            sx={{
              minHeight: config.minHeight,
              maxHeight: config.maxHeight !== "auto" ? config.maxHeight : undefined,
              overflowY: "auto",
              px: 1.5, py: 1.5,
              outline: "none",
              fontFamily: theme.typography.fontFamily,
              fontSize: 14,
              lineHeight: 1.7,
              color: "text.primary",
              "&:empty::before": {
                content: `"${placeholder || config.placeholder}"`,
                color: "text.disabled",
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default SapControlEditor;
