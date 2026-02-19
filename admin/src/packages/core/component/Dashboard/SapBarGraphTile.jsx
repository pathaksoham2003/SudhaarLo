import React, { useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import SapTileWrapper from "./SapTileWrapper";
import SapTileItemList from "./SapTileItemList";
import useSapTileData from "./useSapTileData";

/**
 * SapBarGraphTile
 *
 * Vertical bar chart with an item legend list underneath.
 * Supports sorting, "Other" grouping, overlay mode, tile
 * selection, loading state, totals, and custom render props.
 */
const SapBarGraphTile = ({
  // Tile chrome
  title,
  description,
  tileHeader = null,
  noDataMessage = "No data available",
  isLoading = false,
  // Data
  items = [],
  colors = [],
  // Sorting & limiting
  sortBy = "value",
  sortType = "asc",
  maxDisplayItems = 5,
  showTotal = false,
  // Overlay
  isOverlayMode: controlledOverlay,
  // Tile selection
  isSelectableTile = false,
  selectFirstItemOnClick = false,
  isTileSelected = false,
  onTileSelectedChanged,
  // Item selection
  onLabelSelectedChanged,
  // Render props
  renderValue,
  renderLabel,
  renderColorIcon,
  renderTotalLabel,
  renderTotalValue,
  // Style
  className = "carousel-tile",
  sx = {},
}) => {
  const [internalOverlay, setInternalOverlay] = useState(false);
  const showOverlay =
    controlledOverlay !== undefined ? controlledOverlay : internalOverlay;

  const { displayItems, total, hasOther } = useSapTileData({
    items,
    colors,
    sortBy,
    sortType,
    maxDisplayItems,
    showOverlay,
  });

  const handleItemClick = useCallback(
    (item) => {
      if (onLabelSelectedChanged) {
        onLabelSelectedChanged({ ...item, selected: !item.selected });
      }
    },
    [onLabelSelectedChanged]
  );

  const handleOtherClick = useCallback(() => {
    setInternalOverlay((v) => !v);
  }, []);

  const handleTileSelected = useCallback(() => {
    if (onTileSelectedChanged) onTileSelectedChanged();
    if (selectFirstItemOnClick && items.length && onLabelSelectedChanged) {
      onLabelSelectedChanged({ ...items[0], selected: true });
    }
  }, [onTileSelectedChanged, selectFirstItemOnClick, items, onLabelSelectedChanged]);

  // Bar chart metrics
  const maxValue = Math.max(...displayItems.map((i) => i.value), 1);
  const barMaxHeight = 110;

  return (
    <SapTileWrapper
      title={title}
      description={description}
      tileHeader={tileHeader}
      isLoading={isLoading}
      noDataMessage={noDataMessage}
      hasData={displayItems.length > 0}
      isSelectableTile={isSelectableTile}
      isTileSelected={isTileSelected}
      onTileSelectedChanged={handleTileSelected}
      className={className}
      sx={sx}
    >
      {/* Bars */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: displayItems.length > 6 ? 0.5 : 1.5,
          width: "100%",
          pt: 1,
          mb: 1.5,
        }}
      >
        {displayItems.map((item, index) => {
          const barHeight = (item.value / maxValue) * barMaxHeight;
          const isActive = item.selected !== false;
          return (
            <Box
              key={`${item.label}-${index}`}
              onClick={() =>
                item._isOther ? handleOtherClick() : handleItemClick(item)
              }
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                flex: 1,
                maxWidth: 55,
                opacity: isActive ? 1 : 0.35,
                transition: "all 0.2s ease",
                "&:hover": { opacity: isActive ? 0.8 : 0.55 },
              }}
            >
              <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, fontSize: 10 }}>
                {renderValue ? renderValue(item.value, item) : item.value}
              </Typography>
              <Box
                sx={{
                  width: "70%",
                  maxWidth: 38,
                  height: Math.max(barHeight, 4),
                  bgcolor: item._color,
                  borderRadius: "4px 4px 0 0",
                  transition: "height 0.4s ease",
                  ...(item.selected && { boxShadow: `0 0 8px ${item._color}55` }),
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, fontSize: 9, textAlign: "center", lineHeight: 1.2, maxWidth: 50, wordBreak: "break-word" }}
              >
                {renderLabel ? renderLabel(item.label, item) : item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Legend list */}
      <SapTileItemList
        items={displayItems}
        onItemClick={handleItemClick}
        onOtherClick={handleOtherClick}
        showTotal={showTotal && !hasOther}
        total={total}
        renderValue={renderValue}
        renderLabel={renderLabel}
        renderColorIcon={renderColorIcon}
        renderTotalLabel={renderTotalLabel}
        renderTotalValue={renderTotalValue}
      />
    </SapTileWrapper>
  );
};

export default SapBarGraphTile;
