import React from "react";
import { Box, Chip, Link } from "@mui/material";
import { getColor } from "./chartUtils";

/**
 * SapFilterChips
 *
 * Displays selected SapTileItem entries as removable chips.
 * Place this component inside a table / list header template
 * to let users see which tile labels are currently filtering
 * the data, and to remove individual filters or clear all.
 *
 * @param {Array}    filterChipData      - Full SapTileItem[] (only selected items are shown)
 * @param {Function} onUnselectLabel     - Called with item when a single chip is removed
 * @param {Function} onUnselectAllLabels - Called when the "Clear all" link is clicked
 * @param {object}   sx                  - Additional MUI sx styles
 */
const SapFilterChips = ({
  filterChipData = [],
  onUnselectLabel,
  onUnselectAllLabels,
  sx = {},
}) => {
  const selectedItems = filterChipData.filter((item) => item.selected);

  if (!selectedItems.length) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        ...sx,
      }}
    >
      {selectedItems.map((item, index) => {
        const color = getColor(index, item.color);
        return (
          <Chip
            key={`${item.label}-${index}`}
            label={item.label}
            size="small"
            variant="outlined"
            onDelete={() => onUnselectLabel && onUnselectLabel(item)}
            sx={{
              bgcolor: `${color}18`,
              borderColor: color,
              color: "text.primary",
              fontWeight: 500,
              "& .MuiChip-deleteIcon": {
                color,
                "&:hover": { color: "error.main" },
              },
            }}
          />
        );
      })}

      {selectedItems.length > 1 && (
        <Link
          component="button"
          variant="caption"
          underline="hover"
          onClick={() => onUnselectAllLabels && onUnselectAllLabels()}
          sx={{
            ml: 0.5,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Clear all
        </Link>
      )}
    </Box>
  );
};

export default SapFilterChips;
