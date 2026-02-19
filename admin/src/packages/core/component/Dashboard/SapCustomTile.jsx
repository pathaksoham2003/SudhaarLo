import React, { useCallback } from "react";
import SapTileWrapper from "./SapTileWrapper";

/**
 * SapCustomTile
 *
 * An open-ended tile that renders whatever children you provide
 * inside the standard tile chrome. Use this when none of the
 * specialised tiles fit your use case.
 *
 * Supports selectable and deselectable modes.
 */
const SapCustomTile = ({
  title, description,
  children,
  noDataMessage = "No data available",
  isSelectableTile = false,
  isDeselectableTile = false,
  isTileSelected = false,
  onTileSelectedChanged,
  className = "carousel-tile", sx = {},
}) => {
  const hasData = !!children;

  const handleTileClick = useCallback(() => {
    if (!isSelectableTile) return;
    // If already selected, only fire if deselectable
    if (isTileSelected && !isDeselectableTile) return;
    onTileSelectedChanged && onTileSelectedChanged();
  }, [isSelectableTile, isDeselectableTile, isTileSelected, onTileSelectedChanged]);

  return (
    <SapTileWrapper
      title={title} description={description}
      noDataMessage={noDataMessage} hasData={hasData}
      isSelectableTile={isSelectableTile} isTileSelected={isTileSelected}
      onTileSelectedChanged={handleTileClick}
      className={className} sx={sx}
    >
      {children}
    </SapTileWrapper>
  );
};

export default SapCustomTile;
