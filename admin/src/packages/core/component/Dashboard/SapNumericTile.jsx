import React, { useCallback } from "react";
import { Box, Typography, Divider } from "@mui/material";
import SapTileWrapper from "./SapTileWrapper";

/** Internal numeric item renderer. */
const NumericItem = ({ label, value, unit }) => (
  <Box sx={{ textAlign: "center", px: 1 }}>
    <Typography variant="h4" fontWeight={700} color="primary.main" lineHeight={1.2}>
      {value}
      {unit && (
        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5, fontWeight: 400 }}>
          {unit}
        </Typography>
      )}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
      {label}
    </Typography>
  </Box>
);

/**
 * SapNumericTile
 *
 * Displays one or two prominent numeric values with an
 * optional from/to range strip underneath.
 */
const SapNumericTile = ({
  title, description, tileHeader = null,
  noDataMessage = "No data available", isLoading = false,
  // Numeric items
  itemOne, itemTwo,
  fromLabel, toLabel,
  // Selection
  isSelectableTile = false,
  isTileSelected = false,
  onTileSelectedChanged,
  onSelectedValueChanged,
  // Style
  className = "carousel-tile", sx = {},
}) => {
  const hasData = !!(itemOne || itemTwo);

  const handleTileSelected = useCallback(() => {
    onTileSelectedChanged && onTileSelectedChanged();
    onSelectedValueChanged && onSelectedValueChanged();
  }, [onTileSelectedChanged, onSelectedValueChanged]);

  return (
    <SapTileWrapper
      title={title} description={description} tileHeader={tileHeader}
      isLoading={isLoading} noDataMessage={noDataMessage} hasData={hasData}
      isSelectableTile={isSelectableTile} isTileSelected={isTileSelected}
      onTileSelectedChanged={handleTileSelected}
      className={className} sx={sx}
    >
      <Box sx={{ width: "100%" }}>
        {/* Main numeric values */}
        <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", mb: fromLabel || toLabel ? 2 : 0 }}>
          {itemOne && <NumericItem {...itemOne} />}
          {itemOne && itemTwo && <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />}
          {itemTwo && <NumericItem {...itemTwo} />}
        </Box>

        {/* From / To range strip */}
        {(fromLabel || toLabel) && (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 1.25, bgcolor: "action.hover", borderRadius: 2 }}>
            {fromLabel && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">{fromLabel.label}</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {fromLabel.value}
                  {fromLabel.unit && <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>{fromLabel.unit}</Typography>}
                </Typography>
              </Box>
            )}
            {fromLabel && toLabel && <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>→</Typography>}
            {toLabel && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">{toLabel.label}</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {toLabel.value}
                  {toLabel.unit && <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>{toLabel.unit}</Typography>}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </SapTileWrapper>
  );
};

export default SapNumericTile;
