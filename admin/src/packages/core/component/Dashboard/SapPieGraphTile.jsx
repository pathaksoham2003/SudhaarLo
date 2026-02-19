import React, { useState, useCallback } from "react";
import { Box, useTheme } from "@mui/material";
import SapTileWrapper from "./SapTileWrapper";
import SapTileItemList from "./SapTileItemList";
import useSapTileData from "./useSapTileData";
import { describeArc } from "./chartUtils";

/**
 * SapPieGraphTile
 *
 * Traditional pie chart with side legend showing percentages.
 * Full API: sorting, "Other" grouping, overlay, selection,
 * loading, totals, custom render props.
 */
const SapPieGraphTile = ({
  title, description, tileHeader = null,
  noDataMessage = "No data available", isLoading = false,
  items = [], colors = [],
  sortBy = "value", sortType = "asc", maxDisplayItems = 5,
  showTotal = false,
  isOverlayMode: controlledOverlay,
  isSelectableTile = false, selectFirstItemOnClick = false,
  isTileSelected = false, onTileSelectedChanged,
  onLabelSelectedChanged,
  renderValue, renderLabel, renderColorIcon,
  renderTotalLabel, renderTotalValue,
  className = "carousel-tile", sx = {},
}) => {
  const theme = useTheme();
  const [internalOverlay, setInternalOverlay] = useState(false);
  const showOverlay = controlledOverlay !== undefined ? controlledOverlay : internalOverlay;

  const { displayItems, total, hasOther } = useSapTileData({
    items, colors, sortBy, sortType, maxDisplayItems, showOverlay,
  });

  const handleItemClick = useCallback(
    (item) => onLabelSelectedChanged && onLabelSelectedChanged({ ...item, selected: !item.selected }),
    [onLabelSelectedChanged]
  );
  const handleOtherClick = useCallback(() => setInternalOverlay((v) => !v), []);
  const handleTileSelected = useCallback(() => {
    onTileSelectedChanged && onTileSelectedChanged();
    if (selectFirstItemOnClick && items.length && onLabelSelectedChanged)
      onLabelSelectedChanged({ ...items[0], selected: true });
  }, [onTileSelectedChanged, selectFirstItemOnClick, items, onLabelSelectedChanged]);

  const bgColor = theme.palette.mode === "dark"
    ? theme.palette.background.paper : theme.palette.background.default;

  // Build slices
  const cx = 70, cy = 70, r = 60;
  let angle = 0;
  const slices = displayItems.map((item) => {
    const sweep = total > 0 ? (item.value / total) * 360 : 0;
    const s = { ...item, startAngle: angle, endAngle: angle + sweep };
    angle += sweep;
    return s;
  });

  // Default renderValue for pie shows percentages
  const defaultPieValue = (value) => {
    const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    return `${pct}%`;
  };

  return (
    <SapTileWrapper
      title={title} description={description} tileHeader={tileHeader}
      isLoading={isLoading} noDataMessage={noDataMessage}
      hasData={displayItems.length > 0}
      isSelectableTile={isSelectableTile} isTileSelected={isTileSelected}
      onTileSelectedChanged={handleTileSelected}
      className={className} sx={sx}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
        {/* Pie SVG */}
        <svg width={140} height={140} viewBox="0 0 140 140"
          style={{ display: "block", flexShrink: 0 }}>
          {slices.map((sl, i) => (
            <path key={i}
              d={describeArc(cx, cy, r, sl.startAngle, sl.endAngle)}
              fill={sl._color}
              opacity={sl.selected === false ? 0.3 : 1}
              stroke={bgColor} strokeWidth={1.5}
              style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              onClick={() => sl._isOther ? handleOtherClick() : handleItemClick(sl)}
            />
          ))}
        </svg>

        {/* Legend — pie shows percentage by default */}
        <SapTileItemList
          items={displayItems} onItemClick={handleItemClick}
          onOtherClick={handleOtherClick}
          showTotal={showTotal && !hasOther} total={total}
          renderValue={renderValue || defaultPieValue}
          renderLabel={renderLabel} renderColorIcon={renderColorIcon}
          renderTotalLabel={renderTotalLabel} renderTotalValue={renderTotalValue}
        />
      </Box>
    </SapTileWrapper>
  );
};

export default SapPieGraphTile;
