import React, { useState, useCallback } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import SapTileWrapper from "./SapTileWrapper";
import SapTileItemList from "./SapTileItemList";
import useSapTileData from "./useSapTileData";
import { describeDonutArc } from "./chartUtils";

/**
 * SapDonutGraphTile
 *
 * Donut (ring) chart with centre total and side legend.
 * Full API: sorting, "Other" grouping, overlay, selection,
 * loading, totals, custom render props.
 */
const SapDonutGraphTile = ({
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

  // Chart geometry
  const cx = 70, cy = 70, outerR = 60, innerR = 38;
  const bgColor = theme.palette.mode === "dark"
    ? theme.palette.background.paper : theme.palette.background.default;

  // Build slices
  let angle = 0;
  const slices = displayItems.map((item) => {
    const sweep = total > 0 ? (item.value / total) * 360 : 0;
    const s = { ...item, startAngle: angle, endAngle: angle + sweep };
    angle += sweep;
    return s;
  });

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
        {/* Donut SVG */}
        <Box sx={{ position: "relative", flexShrink: 0, width: 140, height: 140 }}>
          <svg width={140} height={140} viewBox="0 0 140 140" style={{ display: "block" }}>
            {displayItems.length === 1 ? (
              <>
                <circle cx={cx} cy={cy} r={outerR}
                  fill={slices[0]._color}
                  opacity={slices[0].selected === false ? 0.3 : 1}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleItemClick(displayItems[0])}
                />
                <circle cx={cx} cy={cy} r={innerR} fill={bgColor} />
              </>
            ) : (
              slices.map((sl, i) => (
                <path key={i}
                  d={describeDonutArc(cx, cy, outerR, innerR, sl.startAngle, sl.endAngle)}
                  fill={sl._color}
                  opacity={sl.selected === false ? 0.3 : 1}
                  stroke={bgColor} strokeWidth={1.5}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  onClick={() => sl._isOther ? handleOtherClick() : handleItemClick(sl)}
                />
              ))
            )}
          </svg>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
            <Typography variant="h6" fontWeight={700} lineHeight={1}>{total}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 9 }}>Total</Typography>
          </Box>
        </Box>

        {/* Legend */}
        <SapTileItemList
          items={displayItems} onItemClick={handleItemClick}
          onOtherClick={handleOtherClick}
          showTotal={showTotal && !hasOther} total={total}
          renderValue={renderValue} renderLabel={renderLabel}
          renderColorIcon={renderColorIcon}
          renderTotalLabel={renderTotalLabel} renderTotalValue={renderTotalValue}
        />
      </Box>
    </SapTileWrapper>
  );
};

export default SapDonutGraphTile;
