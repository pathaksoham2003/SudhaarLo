/**
 * SapZap Dashboard Components — Barrel Export
 *
 * Usage:
 *   import {
 *     SapDashboardCarousel,
 *     SapBarGraphTile,
 *     SapDonutGraphTile,
 *     SapPieGraphTile,
 *     SapListTile,
 *     SapNumericTile,
 *     SapTextTile,
 *     SapCustomTile,
 *     SapMultiTile,
 *     SapFilterChips,
 *     SapTileWrapper,
 *   } from "@/packages/core/component/Dashboard";
 */

// Layout
export { default as SapDashboardCarousel } from "./SapDashboardCarousel";

// Chart tiles
export { default as SapBarGraphTile } from "./SapBarGraphTile";
export { default as SapDonutGraphTile } from "./SapDonutGraphTile";
export { default as SapPieGraphTile } from "./SapPieGraphTile";

// Data tiles
export { default as SapListTile } from "./SapListTile";
export { default as SapNumericTile } from "./SapNumericTile";
export { default as SapTextTile } from "./SapTextTile";
export { default as SapCustomTile } from "./SapCustomTile";
export { default as SapMultiTile } from "./SapMultiTile";

// Utilities
export { default as SapFilterChips } from "./SapFilterChips";
export { default as SapTileWrapper } from "./SapTileWrapper";
export { default as SapTileItemList } from "./SapTileItemList";

// Hooks & helpers
export { default as useSapTileData } from "./useSapTileData";
export { DEFAULT_COLORS, OTHER_COLOR, resolveColor, getColor } from "./chartUtils";
