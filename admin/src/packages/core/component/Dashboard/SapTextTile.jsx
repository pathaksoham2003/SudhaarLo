import React, { useCallback } from "react";
import { Typography, Box } from "@mui/material";
import SapTileWrapper from "./SapTileWrapper";

/**
 * SapTextTile
 *
 * Displays a single prominent text value with an optional unit.
 * Ideal for simple status indicators, labels, or single-metric
 * displays where a numeric tile would be overkill.
 */
const SapTextTile = ({
  title, description,
  value = null,
  unit = null,
  noDataMessage = "No data available",
  isLoading = false,
  isSelectableTile = false,
  isTileSelected = false,
  onTileSelectedChanged,
  className = "carousel-tile", sx = {},
}) => {
  const hasData = value !== null && value !== undefined;

  const handleTileSelected = useCallback(() => {
    onTileSelectedChanged && onTileSelectedChanged();
  }, [onTileSelectedChanged]);

  return (
    <SapTileWrapper
      title={title} description={description}
      isLoading={isLoading} noDataMessage={noDataMessage} hasData={hasData}
      isSelectableTile={isSelectableTile} isTileSelected={isTileSelected}
      onTileSelectedChanged={handleTileSelected}
      className={className} sx={sx}
    >
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="h3" fontWeight={700} color="primary.main" lineHeight={1.2}>
          {value}
          {unit && (
            <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 1, fontWeight: 400 }}>
              {unit}
            </Typography>
          )}
        </Typography>
      </Box>
    </SapTileWrapper>
  );
};

export default SapTextTile;
