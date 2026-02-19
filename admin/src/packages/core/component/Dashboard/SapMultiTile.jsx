import React, { useState, useCallback } from "react";
import { Box, Paper, Tabs, Tab, Typography } from "@mui/material";

/**
 * SapMultiTile
 *
 * Container tile that holds multiple dashboard tiles behind a
 * tabbed interface. Only the active tab's tile is visible.
 *
 * Supports tile-level selection and auto-select-first-item.
 */
const SapMultiTile = ({
  tileTitles = [],
  children,
  noDataMessage = "No data available",
  // Selection
  isSelectableTile = false,
  selectFirstItemOnClick = false,
  isTileSelected = false,
  onTileSelectedChanged,
  onSelectedTileIndexChange,
  // Style
  className = "carousel-tile", sx = {},
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const tiles = React.Children.toArray(children);
  const hasData = tiles.length > 0;

  const handleTabChange = useCallback(
    (_, newValue) => {
      setActiveTab(newValue);
      onSelectedTileIndexChange && onSelectedTileIndexChange(newValue);
    },
    [onSelectedTileIndexChange]
  );

  const handleTileClick = useCallback(() => {
    if (isSelectableTile && !isTileSelected && onTileSelectedChanged) {
      onTileSelectedChanged();
    }
  }, [isSelectableTile, isTileSelected, onTileSelectedChanged]);

  return (
    <Paper
      elevation={2}
      className={className}
      onClick={isSelectableTile ? handleTileClick : undefined}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        cursor: isSelectableTile ? "pointer" : "default",
        border: "2px solid",
        borderColor: isTileSelected ? "primary.main" : "transparent",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          ...(isSelectableTile && !isTileSelected && { borderColor: "action.disabled" }),
        },
        ...sx,
      }}
    >
      {/* Tab bar */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 42,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTab-root": { minHeight: 42, textTransform: "none", fontWeight: 600, fontSize: 13 },
        }}
      >
        {tileTitles.map((label, i) => (
          <Tab key={i} label={label} />
        ))}
      </Tabs>

      {/* Active panel */}
      <Box sx={{ flex: 1, p: 0 }}>
        {hasData ? (
          tiles[activeTab] || null
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
            {noDataMessage}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default SapMultiTile;
