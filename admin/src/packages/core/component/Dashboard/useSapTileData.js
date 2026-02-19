import { useMemo } from "react";
import { DEFAULT_COLORS, OTHER_COLOR } from "./chartUtils";

/**
 * useSapTileData
 *
 * Shared hook that processes a raw SapTileItem[] into a
 * display-ready dataset — applying colours from the palette,
 * sorting, capping visible items, and creating an "Other"
 * bucket when items overflow maxDisplayItems.
 *
 * @param {object} options
 * @param {Array}    options.items           - Raw SapTileItem[]
 * @param {string[]} options.colors          - Optional custom colour array
 * @param {string}   options.sortBy          - Sort key ("value" or null)
 * @param {"asc"|"desc"} options.sortType    - Sort direction
 * @param {number}   options.maxDisplayItems - Items before "Other" (0 = no limit)
 * @param {boolean}  options.showOverlay     - If true, show all items (overlay mode)
 *
 * @returns {{ displayItems, otherItems, total, hasOther }}
 */
const useSapTileData = ({
  items = [],
  colors = [],
  sortBy = "value",
  sortType = "asc",
  maxDisplayItems = 5,
  showOverlay = false,
}) => {
  return useMemo(() => {
    if (!items.length) {
      return { displayItems: [], otherItems: [], total: 0, hasOther: false };
    }

    const palette = colors.length ? colors : DEFAULT_COLORS;

    // Assign resolved colours
    const colored = items.map((item, i) => ({
      ...item,
      _color: item.color || palette[i % palette.length],
      _originalIndex: i,
    }));

    // Sort
    let sorted = [...colored];
    if (sortBy === "value") {
      sorted.sort((a, b) =>
        sortType === "desc" ? b.value - a.value : a.value - b.value
      );
    }

    // Total
    const total = sorted.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

    // Overlay or no limit → show everything
    if (showOverlay || maxDisplayItems <= 0 || sorted.length <= maxDisplayItems) {
      return { displayItems: sorted, otherItems: [], total, hasOther: false };
    }

    // Truncate + create "Other"
    const visible = sorted.slice(0, maxDisplayItems);
    const rest = sorted.slice(maxDisplayItems);
    const otherValue = rest.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    const otherItem = {
      label: "Other",
      value: otherValue,
      _color: OTHER_COLOR,
      _isOther: true,
    };

    return {
      displayItems: [...visible, otherItem],
      otherItems: rest,
      total,
      hasOther: true,
    };
  }, [items, colors, sortBy, sortType, maxDisplayItems, showOverlay]);
};

export default useSapTileData;
