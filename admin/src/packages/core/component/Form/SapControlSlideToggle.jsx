import React, { useCallback } from "react";
import { Switch, FormControlLabel, Typography, Box, useTheme } from "@mui/material";

/**
 * SapControlSlideToggle
 *
 * On/off slide toggle using MUI Switch. Supports custom
 * on/off colours, text-mode (disabled but visible),
 * and MUI theming.
 */
const SapControlSlideToggle = ({
  checked = false,
  onChange,
  onBlur,
  textMode = false,
  disabled = false,
  label,
  id = "",
  name = "",
  onColor = "",
  offColor = "",
  color = "primary", // "primary" | "secondary" | "error"
  sx = {},
}) => {
  const theme = useTheme();

  const handleChange = useCallback(
    (e) => { onChange && onChange(e.target.checked); },
    [onChange]
  );

  const muiColor = color === "danger" ? "error" : color || "primary";

  const switchEl = (
    <Switch
      checked={!!checked}
      onChange={handleChange}
      onBlur={() => onBlur && onBlur()}
      disabled={textMode || disabled}
      color={muiColor}
      id={id || undefined}
      name={name || undefined}
      sx={{
        ...(onColor && checked && {
          "& .MuiSwitch-track": { bgcolor: `${onColor} !important`, opacity: "1 !important" },
          "& .MuiSwitch-thumb": { bgcolor: onColor },
        }),
        ...(offColor && !checked && {
          "& .MuiSwitch-track": { bgcolor: `${offColor} !important`, opacity: "0.7 !important" },
        }),
      }}
    />
  );

  if (!label) return <Box sx={sx}>{switchEl}</Box>;

  return (
    <FormControlLabel
      control={switchEl}
      label={label}
      sx={{
        "& .MuiFormControlLabel-label": { fontFamily: theme.typography.fontFamily, fontSize: 14 },
        ...sx,
      }}
    />
  );
};

export default SapControlSlideToggle;
