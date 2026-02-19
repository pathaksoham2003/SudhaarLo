/**
 * SapZap Dashboard — Shared Chart Utilities
 *
 * Default colour palette, SVG path helpers, and common
 * constants used across all dashboard tile components.
 */

/** Original 9-colour palette matching the SapZap design system. */
export const DEFAULT_COLORS = [
  "#21b584", // green
  "#ffc527", // amber
  "#0072ce", // blue
  "#00bdff", // cyan
  "#ff5b27", // orange
  "#005290", // navy
  "#707070", // grey
  "#303030", // charcoal
  "#de3500", // red
];

/** Muted colour used for the auto-generated "Other" bucket. */
export const OTHER_COLOR = "#94a3b8";

/**
 * Returns the colour for an item at the given index.
 * Priority: item.color → colors array → DEFAULT_COLORS.
 */
export function resolveColor(index, itemColor, colorsArray) {
  if (itemColor) return itemColor;
  const palette = colorsArray && colorsArray.length ? colorsArray : DEFAULT_COLORS;
  return palette[index % palette.length];
}

/** Backwards-compatible alias. */
export const getColor = (index, customColor) => resolveColor(index, customColor);

/* ---------------------------------------------------------------
   SVG helpers
   --------------------------------------------------------------- */

/**
 * Converts polar coordinates to Cartesian.
 * Angle 0° starts at the top (12 o'clock position).
 */
export function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

/**
 * SVG path for a pie-chart wedge (from centre to arc and back).
 */
export function describeArc(cx, cy, r, startAngle, endAngle) {
  if (endAngle - startAngle >= 359.99) {
    return [
      `M ${cx} ${cy - r}`,
      `A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r}`,
      `Z`,
    ].join(" ");
  }
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

/**
 * SVG path for a donut-chart ring segment.
 */
export function describeDonutArc(cx, cy, outerR, innerR, startAngle, endAngle) {
  if (endAngle - startAngle >= 359.99) {
    return [
      `M ${cx} ${cy - outerR}`,
      `A ${outerR} ${outerR} 0 0 1 ${cx} ${cy + outerR}`,
      `A ${outerR} ${outerR} 0 0 1 ${cx} ${cy - outerR}`,
      `M ${cx} ${cy - innerR}`,
      `A ${innerR} ${innerR} 0 0 0 ${cx} ${cy + innerR}`,
      `A ${innerR} ${innerR} 0 0 0 ${cx} ${cy - innerR}`,
      `Z`,
    ].join(" ");
  }
  const os = polarToCartesian(cx, cy, outerR, startAngle);
  const oe = polarToCartesian(cx, cy, outerR, endAngle);
  const ie = polarToCartesian(cx, cy, innerR, endAngle);
  const is_ = polarToCartesian(cx, cy, innerR, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${os.x} ${os.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${is_.x} ${is_.y}`,
    `Z`,
  ].join(" ");
}
