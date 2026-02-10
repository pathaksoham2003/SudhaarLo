import React from "react";
import { Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const PageHeader = ({ children }) => {
  const location = useLocation();

  if (children) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {children}
        </Typography>
      </Box>
    );
  }

  const pathSegments = location.pathname.split("/").slice(2); 
  const heading = pathSegments
    .map(segment =>
      segment
        .split("-") 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .join(" ");

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {heading || "Dashboard"}
      </Typography>
    </Box>
  );
};

export default PageHeader;
