import React from "react";
import { Button, useTheme } from "@mui/material";

const RoundedButton = ({
  children,
  onClick,
  sx = {},
  color = "primary",
  variant = "contained",
  width = 150,   // default width
  height = 48,   // default height
  type = "button",
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
    type={type}
      onClick={onClick}
      variant={variant}
      color={color}
      sx={{
        borderRadius: 3,
        textTransform: "none",
        fontWeight: 600,
        minWidth: width,
        height: height,
        ...sx, // merge custom styles
        backgroundColor: variant === "contained" ? theme.palette[color].main : undefined,
        "&:hover": {
          backgroundColor:
            variant === "contained"
              ? theme.palette[color].dark
              : undefined,
          borderColor: variant === "outlined" ? theme.palette[color].main : undefined,
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default RoundedButton;
