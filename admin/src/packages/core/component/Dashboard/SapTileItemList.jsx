import React from "react";
import { Box, Typography, Divider } from "@mui/material";

/**
 * SapTileItemList
 *
 * Shared sub-component rendered by chart and list tiles.
 * Displays a vertical list of SapTileItem rows with colour dot,
 * label, and value. Supports "Other" click, total row,
 * and custom render props.
 */
const SapTileItemList = ({
  items = [],
  onItemClick,
  onOtherClick,
  showTotal = false,
  total = 0,
  // Render props (React equivalents of Angular templateRefs)
  renderValue,
  renderLabel,
  renderColorIcon,
  renderTotalLabel,
  renderTotalValue,
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      {items.map((item, index) => {
        const isOther = item._isOther;
        const isActive = item.selected !== false;

        const handleClick = () => {
          if (isOther && onOtherClick) {
            onOtherClick();
          } else if (onItemClick) {
            onItemClick(item);
          }
        };

        return (
          <Box
            key={`${item.label}-${index}`}
            onClick={handleClick}
            className={item.customLabelClasses || ""}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              py: 0.75,
              px: 1,
              cursor: "pointer",
              borderRadius: 1,
              opacity: isActive ? 1 : 0.4,
              bgcolor: item.selected ? "action.selected" : "transparent",
              transition: "all 0.2s",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            {/* Colour dot / custom icon */}
            {renderColorIcon ? (
              renderColorIcon(item._color, item)
            ) : item.customIcon ? (
              <Box
                className={item.customIconClasses || ""}
                sx={{ flexShrink: 0, width: 16, textAlign: "center" }}
              >
                {item.customIcon}
              </Box>
            ) : (
              <Box
                className={item.customIconClasses || ""}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: item._color,
                  flexShrink: 0,
                }}
              />
            )}

            {/* Label */}
            <Typography
              variant="caption"
              noWrap
              className={item.customLabelClasses || ""}
              sx={{
                flex: 1,
                fontStyle: isOther ? "italic" : "normal",
                textDecoration: isOther ? "underline" : "none",
              }}
            >
              {renderLabel ? renderLabel(item.label, item) : item.label}
            </Typography>

            {/* Value */}
            <Typography
              variant="caption"
              fontWeight={600}
              className={item.customValueClasses || ""}
            >
              {renderValue ? renderValue(item.value, item) : item.value}
            </Typography>
          </Box>
        );
      })}

      {/* Total row */}
      {showTotal && items.length > 0 && (
        <>
          <Divider sx={{ my: 0.5 }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              py: 0.75,
              px: 1,
            }}
          >
            <Box sx={{ width: 10, flexShrink: 0 }} />
            <Typography variant="caption" fontWeight={700} sx={{ flex: 1 }}>
              {renderTotalLabel ? renderTotalLabel("Total") : "Total"}
            </Typography>
            <Typography variant="caption" fontWeight={700}>
              {renderTotalValue ? renderTotalValue(total) : total}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SapTileItemList;
