import React from "react";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";

/**
 * SapTileWrapper
 *
 * Common card wrapper for all SapZap dashboard tiles.
 * Handles the chrome shared by every tile: title, description,
 * optional header area, loading spinner, no-data placeholder,
 * and tile-level selection.
 */
const SapTileWrapper = ({
  title,
  description,
  children,
  // Loading
  isLoading = false,
  // Selection
  isSelectableTile = false,
  isTileSelected = false,
  onTileSelectedChanged,
  // Header (string or ReactNode)
  tileHeader = null,
  // Empty state
  noDataMessage = "No data available",
  hasData = true,
  // Style
  sx = {},
  className = "",
}) => {
  const handleTileClick = () => {
    if (isSelectableTile && !isTileSelected && onTileSelectedChanged) {
      onTileSelectedChanged();
    }
  };

  return (
    <Paper
      elevation={2}
      className={className}
      onClick={isSelectableTile ? handleTileClick : undefined}
      sx={{
        p: 2.5,
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        cursor: isSelectableTile ? "pointer" : "default",
        border: "2px solid",
        borderColor: isTileSelected ? "primary.main" : "transparent",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          ...(isSelectableTile &&
            !isTileSelected && {
              borderColor: "action.disabled",
            }),
        },
        ...sx,
      }}
    >
      {/* Title */}
      {title && (
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
          {title}
        </Typography>
      )}

      {/* Description */}
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
      )}

      {/* Optional header slot */}
      {tileHeader && (
        <Box sx={{ mb: 1.5 }}>
          {typeof tileHeader === "string" ? (
            <Typography variant="body2" fontWeight={600}>
              {tileHeader}
            </Typography>
          ) : (
            tileHeader
          )}
        </Box>
      )}

      {/* Content area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          minHeight: 80,
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={36} />
          </Box>
        ) : !hasData ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 3 }}
          >
            {noDataMessage}
          </Typography>
        ) : (
          children
        )}
      </Box>
    </Paper>
  );
};

export default SapTileWrapper;
