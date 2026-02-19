import React, { useState, useMemo, useEffect, useRef } from "react";
import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";

/**
 * SapDashboardCarousel
 *
 * Responsive paginated carousel for dashboard tiles.
 * Breakpoints: Desktop → maxDisplayItems (default 4),
 * Tablet → 2, Mobile → 1.
 *
 * When using selectable tiles the carousel auto-scrolls
 * to the page containing the selected tile (unless
 * disableAutoTileScroll is true).
 */
const SapDashboardCarousel = ({
  children,
  maxDisplayItems = 4,
  config,
  disableAutoTileScroll = false,
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const desktopCount = config?.grid?.all || maxDisplayItems || 4;
  const tilesPerPage = isMobile ? 1 : isTablet ? 2 : desktopCount;

  const tiles = React.Children.toArray(children);
  const totalPages = Math.ceil(tiles.length / tilesPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const prevTilesPerPage = useRef(tilesPerPage);

  // Clamp page on resize
  useEffect(() => {
    if (tilesPerPage !== prevTilesPerPage.current) {
      prevTilesPerPage.current = tilesPerPage;
      setCurrentPage((p) => Math.min(p, Math.max(0, totalPages - 1)));
    }
  }, [tilesPerPage, totalPages]);

  // Auto-scroll to selected tile
  useEffect(() => {
    if (disableAutoTileScroll) return;
    const selectedIdx = tiles.findIndex((t) => t?.props?.isTileSelected);
    if (selectedIdx >= 0) {
      const targetPage = Math.floor(selectedIdx / tilesPerPage);
      setCurrentPage(targetPage);
    }
  }, [tiles, tilesPerPage, disableAutoTileScroll]);

  const showNavigation = tiles.length > tilesPerPage;

  const visibleTiles = useMemo(() => {
    const start = currentPage * tilesPerPage;
    return tiles.slice(start, start + tilesPerPage);
  }, [currentPage, tilesPerPage, tiles]);

  return (
    <Box sx={{ position: "relative", width: "100%", ...sx }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {showNavigation && (
          <IconButton
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            aria-label="Previous page"
            sx={{ bgcolor: "background.paper", boxShadow: 1, width: 36, height: 36, "&:disabled": { opacity: 0.3 } }}
          >
            <Box component="span" sx={{ fontSize: 16, lineHeight: 1, userSelect: "none" }}>&#9664;</Box>
          </IconButton>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${tilesPerPage}, 1fr)`,
            gap: 2, flex: 1, minHeight: 220,
          }}
        >
          {visibleTiles.map((tile, i) => (
            <Box key={`tile-${currentPage}-${i}`} sx={{ minWidth: 0 }}>
              {tile}
            </Box>
          ))}
        </Box>

        {showNavigation && (
          <IconButton
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            aria-label="Next page"
            sx={{ bgcolor: "background.paper", boxShadow: 1, width: 36, height: 36, "&:disabled": { opacity: 0.3 } }}
          >
            <Box component="span" sx={{ fontSize: 16, lineHeight: 1, userSelect: "none" }}>&#9654;</Box>
          </IconButton>
        )}
      </Box>

      {/* Dots */}
      {showNavigation && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Box key={i} role="button" tabIndex={0}
              aria-label={`Page ${i + 1}`}
              onClick={() => setCurrentPage(i)}
              onKeyDown={(e) => e.key === "Enter" && setCurrentPage(i)}
              sx={{
                width: 10, height: 10, borderRadius: "50%",
                bgcolor: i === currentPage ? "primary.main" : "action.disabled",
                cursor: "pointer", transition: "all 0.2s",
                "&:hover": { transform: "scale(1.3)" },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SapDashboardCarousel;
