import React, { useState, useCallback, useMemo } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import SapTileWrapper from "./SapTileWrapper";
import SapTileItemList from "./SapTileItemList";
import useSapTileData from "./useSapTileData";

/**
 * SapListTile
 *
 * Coloured label–value list tile. Supports two display modes:
 *   scrollingList=true  → all items in a scrollable container
 *   scrollingList=false → paged list with prev/next navigation
 *
 * Full API: sorting, "Other" grouping, selection, loading,
 * totals, custom render props.
 */
const ITEMS_PER_PAGE = 5;

const SapListTile = ({
  title, description, tileHeader = null,
  noDataMessage = "No data available", isLoading = false,
  items = [], colors = [],
  scrollingList = true,
  sortBy = "value", sortType = "asc",
  showTotal = false,
  isSelectableTile = false, selectFirstItemOnClick = false,
  isTileSelected = false, onTileSelectedChanged,
  onLabelSelectedChanged,
  renderValue, renderLabel, renderColorIcon,
  renderTotalLabel, renderTotalValue,
  className = "carousel-tile", sx = {},
}) => {
  const [page, setPage] = useState(0);

  // List tile shows all items (no maxDisplayItems / "Other")
  const { displayItems, total } = useSapTileData({
    items, colors, sortBy, sortType,
    maxDisplayItems: 0, // no limit
    showOverlay: true,
  });

  const handleItemClick = useCallback(
    (item) => onLabelSelectedChanged && onLabelSelectedChanged({ ...item, selected: !item.selected }),
    [onLabelSelectedChanged]
  );
  const handleTileSelected = useCallback(() => {
    onTileSelectedChanged && onTileSelectedChanged();
    if (selectFirstItemOnClick && items.length && onLabelSelectedChanged)
      onLabelSelectedChanged({ ...items[0], selected: true });
  }, [onTileSelectedChanged, selectFirstItemOnClick, items, onLabelSelectedChanged]);

  // Paging
  const totalPages = Math.ceil(displayItems.length / ITEMS_PER_PAGE);
  const pagedItems = useMemo(() => {
    if (scrollingList) return displayItems;
    const start = page * ITEMS_PER_PAGE;
    return displayItems.slice(start, start + ITEMS_PER_PAGE);
  }, [scrollingList, displayItems, page]);

  return (
    <SapTileWrapper
      title={title} description={description} tileHeader={tileHeader}
      isLoading={isLoading} noDataMessage={noDataMessage}
      hasData={displayItems.length > 0}
      isSelectableTile={isSelectableTile} isTileSelected={isTileSelected}
      onTileSelectedChanged={handleTileSelected}
      className={className} sx={sx}
    >
      <Box sx={{ width: "100%", ...(scrollingList && { maxHeight: 220, overflowY: "auto" }) }}>
        <SapTileItemList
          items={pagedItems}
          onItemClick={handleItemClick}
          showTotal={showTotal}
          total={total}
          renderValue={renderValue}
          renderLabel={renderLabel}
          renderColorIcon={renderColorIcon}
          renderTotalLabel={renderTotalLabel}
          renderTotalValue={renderTotalValue}
        />
      </Box>

      {/* Paging controls */}
      {!scrollingList && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 1 }}>
          <IconButton size="small" disabled={page === 0} onClick={() => setPage((p) => p - 1)}
            sx={{ width: 28, height: 28, fontSize: 14 }}>
            &#9664;
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {page + 1} / {totalPages}
          </Typography>
          <IconButton size="small" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}
            sx={{ width: 28, height: 28, fontSize: 14 }}>
            &#9654;
          </IconButton>
        </Box>
      )}
    </SapTileWrapper>
  );
};

export default SapListTile;
