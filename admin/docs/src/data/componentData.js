/**
 * SapZap Dashboard — Full Component Documentation Data
 *
 * Each key maps a sidebar page-id to a documentation object
 * rendered by ComponentPage.jsx.
 */

const IMPORT_PATH = `"@/packages/core/component/Dashboard"`;

/* ----------------------------------------------------------------
   Shared prop fragments — reused across chart / list tiles
   ---------------------------------------------------------------- */
const SHARED_TILE_CHROME = [
  { name: "title", type: "string", default: "null", required: false, description: "The title shown at the top of the tile. Every tile should have a title." },
  { name: "description", type: "string", default: "null", required: false, description: "Small optional description shown below the title." },
  { name: "tileHeader", type: "string | ReactNode", default: "null", required: false, description: "Optional header displayed between the title/description and the chart area. Can be plain text or a custom React element." },
  { name: "noDataMessage", type: "string", default: '"No data available"', required: false, description: "Placeholder message shown when the tile has no data." },
  { name: "isLoading", type: "boolean", default: "false", required: false, description: "When true, displays a loading spinner instead of the tile content." },
];

const SHARED_DATA_PROPS = [
  { name: "items", type: "SapTileItem[]", default: "[]", required: true, description: "The data series for the chart. Without this, no data will display." },
  { name: "colors", type: "string[]", default: "[]", required: false, description: 'Optional colour array. Loops when items outnumber colours. Default palette: "#21b584", "#ffc527", "#0072ce", "#00bdff", "#ff5b27", "#005290", "#707070", "#303030", "#de3500".' },
];

const SHARED_SORT_PROPS = [
  { name: "sortBy", type: "string", default: '"value"', required: false, description: 'Metric to sort by. Set to null to preserve the original item order.' },
  { name: "sortType", type: '"asc" | "desc"', default: '"asc"', required: false, description: "Sort direction when sortBy is active." },
  { name: "maxDisplayItems", type: "number", default: "5", required: false, description: 'Maximum series to show before an "Other" bucket is created.' },
  { name: "showTotal", type: "boolean", default: "false", required: false, description: 'Show a total row at the bottom of the series list. Hidden when "Other" is present (total is shown in overlay instead).' },
];

const SHARED_OVERLAY = [
  { name: "isOverlayMode", type: "boolean", default: "false", required: false, description: 'Controlled overlay mode. When true, all items are shown (no "Other" grouping). Can also be toggled internally by clicking "Other".' },
];

const SHARED_SELECTION = [
  { name: "isSelectableTile", type: "boolean", default: "false", required: false, description: "Should the whole tile be selectable." },
  { name: "selectFirstItemOnClick", type: "boolean", default: "false", required: false, description: "Requires isSelectableTile. When the tile is selected, automatically select the first item in the list." },
  { name: "isTileSelected", type: "boolean", default: "false", required: false, description: "Requires isSelectableTile. Controlled boolean for the tile selection state." },
];

const SHARED_RENDER_PROPS = [
  { name: "renderValue", type: "(value, item) => ReactNode", default: "null", required: false, description: "Custom render function applied to every item value. React equivalent of Angular valueTemplate." },
  { name: "renderLabel", type: "(label, item) => ReactNode", default: "null", required: false, description: "Custom render function applied to every item label. React equivalent of Angular labelTemplate." },
  { name: "renderColorIcon", type: "(color, item) => ReactNode", default: "null", required: false, description: "Custom render function for the colour indicator. Overrides any customIcon set on individual items." },
  { name: "renderTotalLabel", type: "(label) => ReactNode", default: "null", required: false, description: "Requires showTotal. Custom render for the total row label." },
  { name: "renderTotalValue", type: "(value) => ReactNode", default: "null", required: false, description: "Requires showTotal. Custom render for the total row value." },
];

const SHARED_OUTPUTS = [
  { name: "onLabelSelectedChanged", type: "(item) => void", default: "—", required: false, description: "Fired when a series item is clicked. Receives the item with toggled selected." },
  { name: "onTileSelectedChanged", type: "() => void", default: "—", required: false, description: "Requires isSelectableTile. Fired when an unselected tile is clicked." },
];

const SHARED_STYLE = [
  { name: "className", type: "string", default: '"carousel-tile"', required: false, description: "CSS class name." },
  { name: "sx", type: "object", default: "{}", required: false, description: "Additional MUI sx styles." },
];

const CHART_TILE_PROPS = [
  ...SHARED_TILE_CHROME,
  ...SHARED_DATA_PROPS,
  ...SHARED_SORT_PROPS,
  ...SHARED_OVERLAY,
  ...SHARED_SELECTION,
  ...SHARED_RENDER_PROPS,
  ...SHARED_OUTPUTS,
  ...SHARED_STYLE,
];

const CUSTOM_ITEM_NOTES = [
  "Per-item custom CSS classes are supported via customIconClasses, customLabelClasses, and customValueClasses fields on SapTileItem.",
  "Per-item custom icons are supported via the customIcon field (any ReactNode).",
];

/* ================================================================
   Component documentation entries
   ================================================================ */

export const componentDocs = {

  /* ---- Carousel ------------------------------------------------ */
  carousel: {
    name: "SapDashboardCarousel",
    badge: "layout",
    description: "A responsive paginated carousel that displays dashboard tiles in a horizontal grid. Automatically adapts to screen size. When using selectable tiles, auto-scrolls to the selected tile on resize (configurable).",
    importCode: `import { SapDashboardCarousel } from ${IMPORT_PATH};`,
    props: [
      { name: "children", type: "ReactNode", default: "—", required: true, description: "Tile components to display." },
      { name: "maxDisplayItems", type: "number", default: "4", required: false, description: "Maximum tiles visible on desktop. Not recommended above 4 to avoid cramping." },
      { name: "config", type: "object", default: "null", required: false, description: "Optional custom config. Supports config.grid.all to override the desktop count." },
      { name: "disableAutoTileScroll", type: "boolean", default: "false", required: false, description: "When using selectable tiles, prevents auto-scrolling to the selected tile on small screens or resize." },
      { name: "sx", type: "object", default: "{}", required: false, description: "Additional MUI sx styles." },
    ],
    extras: [
      {
        type: "table",
        title: "Responsive Breakpoints",
        headers: ["Screen Size", "Tiles per Page"],
        rows: [
          ["Desktop (>= 960px)", "maxDisplayItems (default 4)"],
          ["Tablet (600 – 959px)", "2"],
          ["Mobile (< 600px)", "1"],
        ],
      },
    ],
    examples: [
      {
        title: "Basic Carousel",
        code: `<SapDashboardCarousel>
  <SapBarGraphTile title="Revenue" items={items} ... />
  <SapDonutGraphTile title="Split" items={items} ... />
  <SapListTile title="Top 5" items={items} ... />
  <SapNumericTile title="Totals" itemOne={...} />
</SapDashboardCarousel>`,
      },
      {
        title: "Custom Max Display",
        code: `<SapDashboardCarousel maxDisplayItems={3}>
  {/* tiles */}
</SapDashboardCarousel>`,
      },
    ],
    notes: [
      "Navigation arrows and dot indicators appear only when tiles overflow.",
      "Auto-scroll to selected tile works by inspecting child props for isTileSelected.",
      "Set disableAutoTileScroll to true if you manage scroll position externally.",
    ],
  },

  /* ---- Bar Graph ----------------------------------------------- */
  "bar-graph": {
    name: "SapBarGraphTile",
    badge: "chart",
    description: "Vertical bar chart with a legend list underneath. Bars scale proportionally to the maximum value. Supports sorting, colour customisation, 'Other' grouping, overlay mode, tile & item selection, loading state, totals, and custom render props.",
    importCode: `import { SapBarGraphTile } from ${IMPORT_PATH};`,
    props: CHART_TILE_PROPS,
    examples: [
      {
        title: "Basic Bar Chart",
        code: `<SapBarGraphTile
  title="Bookings by Category"
  description="This quarter"
  items={[
    { label: "Plumbing",   value: 120 },
    { label: "Electrical", value: 85  },
    { label: "Cleaning",   value: 200 },
    { label: "Painting",   value: 65  },
  ]}
  onLabelSelectedChanged={(item) => console.log(item)}
/>`,
      },
      {
        title: "Custom Colours, Sorting & Overlay",
        code: `<SapBarGraphTile
  title="Revenue by Region"
  items={regionItems}
  colors={["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"]}
  sortType="desc"
  maxDisplayItems={3}
  showTotal
  isSelectableTile
  isTileSelected={selectedTile === "revenue"}
  onTileSelectedChanged={() => setSelectedTile("revenue")}
  onLabelSelectedChanged={handleSelect}
/>`,
      },
      {
        title: "Custom Render Props",
        code: `<SapBarGraphTile
  title="Sales"
  items={salesItems}
  renderValue={(val) => \`$\${val.toLocaleString()}\`}
  renderLabel={(label) => <strong>{label}</strong>}
  renderTotalValue={(total) => <em>\${total}</em>}
  showTotal
/>`,
      },
    ],
    notes: [
      "Bars scale proportionally — the tallest bar fills the full chart height.",
      'Items beyond maxDisplayItems are grouped into an "Other" bar. Click it to toggle overlay mode.',
      "Items with selected: false render at 35% opacity.",
      ...CUSTOM_ITEM_NOTES,
    ],
  },

  /* ---- Donut Graph --------------------------------------------- */
  "donut-graph": {
    name: "SapDonutGraphTile",
    badge: "chart",
    description: "Donut (ring) chart with the total shown in the centre and a colour-coded legend beside it. Shares the full chart tile API: sorting, 'Other' grouping, overlay, selection, loading, totals, and custom render props.",
    importCode: `import { SapDonutGraphTile } from ${IMPORT_PATH};`,
    props: CHART_TILE_PROPS,
    examples: [
      {
        title: "Basic Donut",
        code: `<SapDonutGraphTile
  title="Service Distribution"
  items={[
    { label: "Plumbing",   value: 120 },
    { label: "Electrical", value: 85  },
    { label: "Cleaning",   value: 200 },
  ]}
  onLabelSelectedChanged={handleSelect}
/>`,
      },
    ],
    notes: [
      "The donut centre displays the sum of all item values.",
      "For a single-item dataset, a full ring is rendered.",
      "Theme-aware: inner ring background matches the current MUI palette mode.",
      ...CUSTOM_ITEM_NOTES,
    ],
  },

  /* ---- Pie Graph ----------------------------------------------- */
  "pie-graph": {
    name: "SapPieGraphTile",
    badge: "chart",
    description: "Traditional pie chart with percentage legend. Each wedge angle is proportional to its share of the total. Shares the full chart tile API.",
    importCode: `import { SapPieGraphTile } from ${IMPORT_PATH};`,
    props: CHART_TILE_PROPS,
    examples: [
      {
        title: "Basic Pie Chart",
        code: `<SapPieGraphTile
  title="Market Share"
  items={[
    { label: "Service A", value: 45 },
    { label: "Service B", value: 30 },
    { label: "Service C", value: 15 },
    { label: "Other",     value: 10 },
  ]}
  onLabelSelectedChanged={handleSelect}
/>`,
      },
    ],
    notes: [
      "Legend values default to percentages (one decimal place).",
      "Provide a renderValue prop to override the percentage display.",
      "SVG arcs use the polarToCartesian helper from chartUtils.js.",
      ...CUSTOM_ITEM_NOTES,
    ],
  },

  /* ---- List Tile ----------------------------------------------- */
  "list-tile": {
    name: "SapListTile",
    badge: "data",
    description: "Coloured label–value list tile with two display modes: a scrollable list (default) or a paged list with prev/next navigation. Shows all items without 'Other' grouping.",
    importCode: `import { SapListTile } from ${IMPORT_PATH};`,
    props: [
      { name: "scrollingList", type: "boolean", default: "true", required: false, description: "When true, items appear in a scrollable container. When false, items are paged with navigation controls." },
      ...SHARED_TILE_CHROME,
      ...SHARED_DATA_PROPS,
      { name: "sortBy", type: "string", default: '"value"', required: false, description: 'Sort metric. Set to null to keep original order.' },
      { name: "sortType", type: '"asc" | "desc"', default: '"asc"', required: false, description: "Sort direction." },
      { name: "showTotal", type: "boolean", default: "false", required: false, description: "Show a total row at the bottom." },
      ...SHARED_SELECTION,
      ...SHARED_RENDER_PROPS,
      ...SHARED_OUTPUTS,
      ...SHARED_STYLE,
    ],
    examples: [
      {
        title: "Scrolling List (default)",
        code: `<SapListTile
  title="Top Services"
  description="Ranked by bookings"
  items={serviceItems}
  onLabelSelectedChanged={handleSelect}
  showTotal
/>`,
      },
      {
        title: "Paged List",
        code: `<SapListTile
  title="All Categories"
  items={allCategories}
  scrollingList={false}
  sortType="desc"
/>`,
      },
    ],
    notes: [
      "List tile shows ALL items — no maxDisplayItems or 'Other' grouping.",
      "Scrolling mode caps height at 220px with overflow scroll.",
      "Paged mode shows 5 items per page with prev/next arrows.",
      ...CUSTOM_ITEM_NOTES,
    ],
  },

  /* ---- Numeric Tile -------------------------------------------- */
  "numeric-tile": {
    name: "SapNumericTile",
    badge: "data",
    description: "Displays one or two prominent numeric values with an optional from/to range strip underneath. Ideal for headline metrics such as revenue, order count, or percentages.",
    importCode: `import { SapNumericTile } from ${IMPORT_PATH};`,
    props: [
      ...SHARED_TILE_CHROME,
      { name: "itemOne", type: "{ label, value, unit? }", default: "null", required: false, description: "Data for the primary (left) numeric display." },
      { name: "itemTwo", type: "{ label, value, unit? }", default: "null", required: false, description: "Data for the secondary (right) numeric display." },
      { name: "fromLabel", type: "{ label, value, unit? }", default: "null", required: false, description: "Data for the bottom-left section of the range strip." },
      { name: "toLabel", type: "{ label, value, unit? }", default: "null", required: false, description: "Data for the bottom-right section of the range strip." },
      { name: "isSelectableTile", type: "boolean", default: "false", required: false, description: "Should the tile be selectable." },
      { name: "isTileSelected", type: "boolean", default: "false", required: false, description: "Controlled selection state." },
      { name: "onTileSelectedChanged", type: "() => void", default: "—", required: false, description: "Fired when an unselected tile is clicked." },
      { name: "onSelectedValueChanged", type: "() => void", default: "—", required: false, description: "Fired when the tile tab is clicked." },
      ...SHARED_STYLE,
    ],
    examples: [
      {
        title: "Two Values with Range",
        code: `<SapNumericTile
  title="Revenue Overview"
  itemOne={{ label: "Total Revenue", value: 245000, unit: "₹" }}
  itemTwo={{ label: "Orders", value: 1284 }}
  fromLabel={{ label: "From", value: "Jan 2026" }}
  toLabel={{ label: "To", value: "Dec 2026" }}
/>`,
      },
      {
        title: "Single Value",
        code: `<SapNumericTile
  title="Active Users"
  description="Currently online"
  itemOne={{ label: "Users", value: 327 }}
/>`,
      },
    ],
    notes: [
      "A vertical MUI Divider separates the two items when both are provided.",
      "The from/to strip uses a shaded background for visual separation.",
      "Does not use SapTileItem arrays or onLabelSelectedChanged.",
    ],
  },

  /* ---- Text Tile ----------------------------------------------- */
  "text-tile": {
    name: "SapTextTile",
    badge: "data",
    description: "Displays a single prominent text value with an optional unit. Ideal for simple status indicators or single-metric displays where a numeric tile would be overkill.",
    importCode: `import { SapTextTile } from ${IMPORT_PATH};`,
    props: [
      ...SHARED_TILE_CHROME,
      { name: "value", type: "string", default: "null", required: true, description: "The value to display prominently in the tile." },
      { name: "unit", type: "string", default: "null", required: false, description: "Optional unit displayed beside the value." },
      { name: "isSelectableTile", type: "boolean", default: "false", required: false, description: "Should the tile be selectable." },
      { name: "isTileSelected", type: "boolean", default: "false", required: false, description: "Controlled selection state." },
      { name: "onTileSelectedChanged", type: "() => void", default: "—", required: false, description: "Fired when an unselected tile is clicked." },
      ...SHARED_STYLE,
    ],
    examples: [
      {
        title: "Basic Text Tile",
        code: `<SapTextTile
  title="System Status"
  value="Operational"
/>`,
      },
      {
        title: "With Unit",
        code: `<SapTextTile
  title="Average Response Time"
  value="142"
  unit="ms"
/>`,
      },
    ],
    notes: [
      "The value renders in the primary theme colour at h3 size.",
      "The tile shows the noDataMessage when value is null or undefined.",
      "Supports loading state via isLoading prop.",
    ],
  },

  /* ---- Custom Tile --------------------------------------------- */
  "custom-tile": {
    name: "SapCustomTile",
    badge: "utility",
    description: "An open-ended tile that renders whatever children you provide inside the standard tile chrome. Use this when none of the specialised tiles fit your use case. Supports both selectable and deselectable modes.",
    importCode: `import { SapCustomTile } from ${IMPORT_PATH};`,
    props: [
      { name: "title", type: "string", default: "null", required: false, description: "Tile heading." },
      { name: "description", type: "string", default: "null", required: false, description: "Short description." },
      { name: "children", type: "ReactNode", default: "—", required: true, description: "Custom content to render inside the tile." },
      { name: "noDataMessage", type: "string", default: '"No data available"', required: false, description: "Shown when children is empty/null." },
      { name: "isSelectableTile", type: "boolean", default: "false", required: false, description: "Should the tile be selectable." },
      { name: "isDeselectableTile", type: "boolean", default: "false", required: false, description: "Requires isSelectableTile. When true, clicking a selected tile deselects it." },
      { name: "isTileSelected", type: "boolean", default: "false", required: false, description: "Controlled selection state." },
      { name: "onTileSelectedChanged", type: "() => void", default: "—", required: false, description: "Fired when the tile selection state changes." },
      ...SHARED_STYLE,
    ],
    examples: [
      {
        title: "Custom Content",
        code: `<SapCustomTile title="Weather" description="Current conditions">
  <div style={{ textAlign: "center", fontSize: 48 }}>☀️</div>
  <p style={{ textAlign: "center" }}>32°C — Clear skies</p>
</SapCustomTile>`,
      },
      {
        title: "Selectable & Deselectable",
        code: `<SapCustomTile
  title="Premium Plan"
  isSelectableTile
  isDeselectableTile
  isTileSelected={plan === "premium"}
  onTileSelectedChanged={() =>
    setPlan((p) => (p === "premium" ? null : "premium"))
  }
>
  <p>₹999 / month</p>
</SapCustomTile>`,
      },
    ],
    notes: [
      "Unlike other tiles, SapCustomTile supports deselection via isDeselectableTile.",
      "The noDataMessage only shows when children is missing entirely.",
      "Great for embedding charts from external libraries, images, or any custom layout.",
    ],
  },

  /* ---- Multi Tile ---------------------------------------------- */
  "multi-tile": {
    name: "SapMultiTile",
    badge: "data",
    description: "Container tile that wraps multiple dashboard tiles behind a tabbed interface. Only the active tab is visible. Supports tile selection and tab-change callbacks.",
    importCode: `import { SapMultiTile } from ${IMPORT_PATH};`,
    props: [
      { name: "tileTitles", type: "string[]", default: "[]", required: true, description: "Ordered array of tab labels — one per child tile." },
      { name: "children", type: "ReactNode", default: "—", required: true, description: "One tile component per tab." },
      { name: "noDataMessage", type: "string", default: '"No data available"', required: false, description: "Shown when no children are provided." },
      { name: "isSelectableTile", type: "boolean", default: "false", required: false, description: "Should the tile be selectable." },
      { name: "selectFirstItemOnClick", type: "boolean", default: "false", required: false, description: "Auto-select first item when tile is selected." },
      { name: "isTileSelected", type: "boolean", default: "false", required: false, description: "Controlled selection state." },
      { name: "onTileSelectedChanged", type: "() => void", default: "—", required: false, description: "Fired when tile is selected." },
      { name: "onSelectedTileIndexChange", type: "(index) => void", default: "—", required: false, description: "Fired when the active tab changes. Returns the new tab index." },
      ...SHARED_STYLE,
    ],
    examples: [
      {
        title: "Two Tiles in Tabs",
        code: `<SapMultiTile tileTitles={["By Category", "Top Providers"]}>
  <SapBarGraphTile
    title="Bookings by Category"
    items={categoryItems}
    onLabelSelectedChanged={handleSelect}
  />
  <SapListTile
    title="Top Providers"
    items={providerItems}
    onLabelSelectedChanged={handleSelect}
  />
</SapMultiTile>`,
      },
    ],
    notes: [
      "First child maps to tileTitles[0], second to tileTitles[1], etc.",
      "Give each embedded tile its full set of props.",
      "Tabs scroll horizontally on overflow.",
      "onSelectedTileIndexChange fires with the 0-based tab index.",
    ],
  },

  /* ---- Filter Chips -------------------------------------------- */
  "filter-chips": {
    name: "SapFilterChips",
    badge: "utility",
    description: 'Displays selected SapTileItem entries as removable MUI chips. Place in a table/list header so users can see active filters and dismiss them individually or clear all.',
    importCode: `import { SapFilterChips } from ${IMPORT_PATH};`,
    props: [
      { name: "filterChipData", type: "SapTileItem[]", default: "[]", required: true, description: "Full items array — only items with selected: true are shown." },
      { name: "onUnselectLabel", type: "(item) => void", default: "—", required: false, description: "Called when a chip's delete icon is clicked." },
      { name: "onUnselectAllLabels", type: "() => void", default: "—", required: false, description: 'Called when "Clear all" is clicked.' },
      { name: "sx", type: "object", default: "{}", required: false, description: "Additional MUI sx styles." },
    ],
    examples: [
      {
        title: "With a Table",
        code: `<SapFilterChips
  filterChipData={items}
  onUnselectLabel={handleRemoveOne}
  onUnselectAllLabels={handleClearAll}
/>
<DynamicTable header={headers} tableData={filtered} />`,
      },
    ],
    notes: [
      '"Clear all" only appears when 2+ chips are visible.',
      "Chip colour inherits from the item colour.",
      "Returns null when no items are selected.",
    ],
  },

  /* ---- Tile Wrapper --------------------------------------------- */
  "tile-wrapper": {
    name: "SapTileWrapper",
    badge: "utility",
    description: "The common card wrapper used internally by every SapZap tile. Handles title, description, loading spinner, tile selection border, header slot, and no-data placeholder. You can also use it directly for custom tile layouts.",
    importCode: `import { SapTileWrapper } from ${IMPORT_PATH};`,
    props: [
      ...SHARED_TILE_CHROME,
      { name: "children", type: "ReactNode", default: "—", required: true, description: "Card content." },
      { name: "hasData", type: "boolean", default: "true", required: false, description: "When false, shows noDataMessage instead of children." },
      { name: "isSelectableTile", type: "boolean", default: "false", required: false, description: "Enables tile-level selection." },
      { name: "isTileSelected", type: "boolean", default: "false", required: false, description: "Controlled selection state." },
      { name: "onTileSelectedChanged", type: "() => void", default: "—", required: false, description: "Fired on tile click when selectable." },
      ...SHARED_STYLE,
    ],
    examples: [
      {
        title: "Custom Metric Card",
        code: `<SapTileWrapper
  title="Conversion Rate"
  description="Last 30 days"
  isLoading={loading}
>
  <div style={{ textAlign: "center" }}>
    <h2>42%</h2>
  </div>
</SapTileWrapper>`,
      },
    ],
    notes: [
      "Uses MUI Paper elevation 2 with borderRadius 3.",
      "Selected state adds a primary-coloured 2px border.",
      "Loading state renders CircularProgress centred in the content area.",
      "All built-in tiles compose this wrapper.",
    ],
  },

  /* ---- Calendar ------------------------------------------------ */
  calendar: {
    name: "SapCalendar",
    badge: "layout",
    description: "A theme-aware calendar component built on FullCalendar (fullcalendar.io). Automatically adapts to the current MUI palette mode (light / dark), uses the project primary colour for events and buttons, and ships with Month, Week, Day, and List views. All FullCalendar props are forwarded for full customisation.",
    importCode: `import { SapCalendar } from "@/packages/core/component/Calendar";`,
    props: [
      { name: "events", type: "EventObject[]", default: "[]", required: false, description: "Array of event objects. Each needs at least { title, start }. See FullCalendar Event Object docs." },
      { name: "initialView", type: "string", default: '"dayGridMonth"', required: false, description: 'Starting view. Options: "dayGridMonth", "timeGridWeek", "timeGridDay", "listWeek".' },
      { name: "editable", type: "boolean", default: "false", required: false, description: "Allow events to be dragged and resized." },
      { name: "selectable", type: "boolean", default: "false", required: false, description: "Allow date range selection by clicking and dragging." },
      { name: "headerToolbar", type: "object", default: "{ left, center, right }", required: false, description: "Custom toolbar layout. Default shows prev/next/today, title, and all four view buttons." },
      { name: "height", type: 'string | number', default: '"auto"', required: false, description: 'Calendar height. Set to a pixel value, "auto", or "100%" for parent-fill.' },
      { name: "nowIndicator", type: "boolean", default: "true", required: false, description: "Show a red line at the current time in week/day views." },
      { name: "weekNumbers", type: "boolean", default: "false", required: false, description: "Show ISO week numbers on the left side." },
      { name: "noEventsMessage", type: "string", default: '"No events to display"', required: false, description: "Placeholder text for empty list view." },
      { name: "onDateClick", type: "(info) => void", default: "—", required: false, description: "Fired when a date cell is clicked. Receives { date, dateStr, allDay, view }." },
      { name: "onEventClick", type: "(info) => void", default: "—", required: false, description: "Fired when an event is clicked. Receives { event, el, jsEvent, view }." },
      { name: "onEventDrop", type: "(info) => void", default: "—", required: false, description: "Fired after an event is drag-and-dropped. Receives { event, oldEvent, delta, revert }." },
      { name: "onEventResize", type: "(info) => void", default: "—", required: false, description: "Fired after an event is resized. Receives { event, oldEvent, startDelta, endDelta, revert }." },
      { name: "onSelect", type: "(info) => void", default: "—", required: false, description: "Fired after a date range is selected. Receives { start, end, startStr, endStr, allDay }." },
      { name: "onEventsSet", type: "(events) => void", default: "—", required: false, description: "Fired whenever the calendar's event set changes." },
      { name: "wrapInPaper", type: "boolean", default: "true", required: false, description: "When true, wraps the calendar in an MUI Paper card with elevation and rounded corners." },
      { name: "sx", type: "object", default: "{}", required: false, description: "Additional MUI sx styles for the wrapper." },
      { name: "...rest", type: "any", default: "—", required: false, description: "All other FullCalendar props are forwarded. See fullcalendar.io/docs for the full list." },
    ],
    extras: [
      {
        type: "table",
        title: "Built-in Views",
        headers: ["View ID", "Description"],
        rows: [
          ["dayGridMonth", "Traditional month calendar grid"],
          ["timeGridWeek", "Week view with time slots"],
          ["timeGridDay", "Single day view with time slots"],
          ["listWeek", "Agenda-style event list for the week"],
        ],
      },
    ],
    examples: [
      {
        title: "Basic Month Calendar",
        code: `import { SapCalendar } from "@/packages/core/component/Calendar";

const MyPage = () => {
  const events = [
    { title: "Team Standup",    start: "2026-02-11T09:00:00" },
    { title: "Sprint Planning", start: "2026-02-12T10:00:00", end: "2026-02-12T12:00:00" },
    { title: "Design Review",   start: "2026-02-14", allDay: true },
  ];

  return (
    <SapCalendar
      events={events}
      onEventClick={(info) => alert(info.event.title)}
    />
  );
};`,
      },
      {
        title: "Editable with Date Selection",
        code: `<SapCalendar
  events={events}
  editable
  selectable
  initialView="timeGridWeek"
  weekNumbers
  onDateClick={(info) => console.log("Clicked:", info.dateStr)}
  onSelect={(info) => {
    console.log("Selected:", info.startStr, "to", info.endStr);
  }}
  onEventDrop={(info) => {
    console.log("Moved:", info.event.title, "to", info.event.startStr);
  }}
/>`,
      },
      {
        title: "Custom Toolbar & Fixed Height",
        code: `<SapCalendar
  events={events}
  height={600}
  headerToolbar={{
    left: "prev,next",
    center: "title",
    right: "dayGridMonth,listWeek",
  }}
  wrapInPaper={false}
/>`,
      },
      {
        title: "Custom Event Colours",
        code: `const events = [
  {
    title: "Urgent Fix",
    start: "2026-02-11",
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
  },
  {
    title: "Feature Work",
    start: "2026-02-12",
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  {
    title: "Maintenance",
    start: "2026-02-13",
    // Uses default theme primary colour
  },
];

<SapCalendar events={events} />`,
      },
    ],
    notes: [
      "Theme integration works via CSS custom properties mapped from the MUI palette. Switch light/dark mode and the calendar adapts automatically.",
      "All FullCalendar props are forwarded — anything from the official docs (fullcalendar.io/docs) can be passed directly.",
      "The component wraps the calendar in an MUI Paper card by default. Set wrapInPaper={false} for a borderless layout.",
      "Individual event colours can be overridden per-event via backgroundColor and borderColor fields.",
      "FullCalendar plugins loaded: @fullcalendar/daygrid, @fullcalendar/timegrid, @fullcalendar/list, @fullcalendar/interaction.",
      "Responsive: toolbar stacks vertically on mobile (< 600px).",
      "A ref to the FullCalendar instance is available via the calendarRef for imperative API calls.",
    ],
  },

  /* ---- Data Table (SapTable) ------------------------------------- */
  "data-table": {
    name: "SapTable",
    badge: "data",
    description: "Full-featured read-only data table with column sorting (client or server), pagination with configurable page sizes, search filtering, row selection with checkboxes, tree structure drill-down, sticky columns, sticky header, responsive mobile card layout, bulk actions, column visibility settings, filter chips, zebra striping, reports mode (compact), row hover, loading spinner, empty state with optional CTA button, and full MUI theming.",
    importCode: `import { SapTable } from "@/packages/core/component/Table";`,
    props: [
      { name: "tableData", type: "TableDataSource", default: "null", required: true, description: "Data source object. Must include { columns: ColumnDef[], data: object[] }. Columns define field, header, width, sortable, and render." },
      { name: "tableId", type: "string", default: '""', required: false, description: "HTML id for the table wrapper." },
      { name: "trackByField", type: "string", default: '""', required: false, description: "Row identity field for selection/tree tracking." },
      { name: "sortOnServer", type: "boolean", default: "false", required: false, description: "When true, sorting is handled externally via onExternalClientSort callback." },
      { name: "enableTableSettings", type: "boolean", default: "false", required: false, description: "Show the settings gear icon (column visibility, shade toggle)." },
      { name: "enableDropdownActions", type: "boolean", default: "false", required: false, description: "Show an actions column with a vertical-dots icon per row." },
      { name: "isShowTableHeader", type: "boolean", default: "true", required: false, description: "Show/hide the header toolbar." },
      { name: "enableCheckBoxColumn", type: "boolean", default: "false", required: false, description: "Show row-selection checkboxes with select-all." },
      { name: "enableFixedHeader", type: "boolean", default: "true", required: false, description: "Make the table header sticky on scroll." },
      { name: "enableStickyColumns", type: "boolean", default: "false", required: false, description: "Enable horizontally sticky columns." },
      { name: "stickyColumnCount", type: "number", default: "0", required: false, description: "Number of left-side columns to make sticky." },
      { name: "enableTreeStructure", type: "boolean", default: "false", required: false, description: 'Enable tree drill-down. Rows with Children array get expand/collapse. Case-sensitive "Children" key.' },
      { name: "enableSortDropdown", type: "boolean", default: "false", required: false, description: "Show a Sort By dropdown in the toolbar." },
      { name: "enableTableHeaderWrapping", type: "boolean", default: "false", required: false, description: "Allow column header text to wrap." },
      { name: "isReportsTable", type: "boolean", default: "false", required: false, description: "Compact mode: tighter padding and smaller font for wide reports." },
      { name: "isEnableShadeAltRows", type: "boolean", default: "false", required: false, description: "Zebra-striping on alternate rows." },
      { name: "isEnableRowHover", type: "boolean", default: "false", required: false, description: "Highlight rows on hover." },
      { name: "mobileCardState", type: "boolean", default: "true", required: false, description: "Render rows as cards on mobile." },
      { name: "useMobileCardsOnTablet", type: "boolean", default: "false", required: false, description: "Also use cards on tablet screens." },
      { name: "disableColumnSort", type: "boolean", default: "false", required: false, description: "Disable all column sorting." },
      { name: "doNotPaginate", type: "boolean", default: "false", required: false, description: "Show all rows without pagination." },
      { name: "isLoading", type: "boolean", default: "false", required: false, description: "Show a centred spinner instead of the table." },
      { name: "pageSize", type: "number", default: "25", required: false, description: "Rows per page." },
      { name: "pageSizeOptions", type: "number[]", default: "[25, 50, 100]", required: false, description: "Page size selector options." },
      { name: "isShowPageSizeOptions", type: "boolean", default: "false", required: false, description: "Show the rows-per-page selector." },
      { name: "addSearchBox", type: "boolean", default: "false", required: false, description: "Show a search input in the toolbar." },
      { name: "customColumnKeys", type: "string[]", default: "[]", required: false, description: "Restrict search to these data keys." },
      { name: "addTableCount", type: "boolean", default: "false", required: false, description: "Show a badge with total row count." },
      { name: "countEntityTypeSingular", type: "string", default: '"Item"', required: false, description: "Singular entity name for count badge." },
      { name: "countEntityTypePlural", type: "string", default: '"Items"', required: false, description: "Plural entity name for count badge." },
      { name: "bulkActionsList", type: "BulkAction[]", default: "[]", required: false, description: "Bulk action buttons when rows are selected. Each: { label, onClick, icon?, color? }." },
      { name: "showSaveButton", type: "boolean", default: "false", required: false, description: "Add a Save button to bulk actions." },
      { name: "filterChipData", type: "ChipItem[]", default: "null", required: false, description: "Array of filter chips to display. Items with selected: true are shown." },
      { name: "emptyTableString", type: "string", default: '""', required: false, description: "Message when table has no data." },
      { name: "emptyTableButtonString", type: "string", default: '""', required: false, description: "Optional CTA button label in the empty state." },
      { name: "filterGeneratedTable", type: "boolean", default: "false", required: false, description: "Mark as filter-based table (shows 'Apply filters' message)." },
      { name: "filterHasBeenSearched", type: "boolean", default: "false", required: false, description: "Whether the filter has been executed." },
      { name: "headerTemplate", type: "ReactNode", default: "null", required: false, description: "Custom header element replacing the default toolbar." },
      { name: "rowTemplate", type: "(row, idx, cols) => ReactNode", default: "null", required: false, description: "Custom row cell renderer." },
      { name: "mobileCardTemplate", type: "(row, idx) => ReactNode", default: "null", required: false, description: "Custom mobile card renderer." },
      { name: "actionsTemplate", type: "(row, idx) => ReactNode", default: "null", required: false, description: "Custom actions column content." },
      { name: "bulkActionDesktop", type: "ReactNode", default: "null", required: false, description: "Custom desktop bulk actions." },
      { name: "bulkActionMobile", type: "ReactNode", default: "null", required: false, description: "Custom mobile bulk actions." },
      { name: "onRowClick", type: "(row) => void", default: "—", required: false, description: "Fired when a row is clicked." },
      { name: "onExportClick", type: "() => void", default: "—", required: false, description: "Fired when Export button is clicked." },
      { name: "onPageChange", type: "(page) => void", default: "—", required: false, description: "Fired on page change." },
      { name: "onExternalClientSort", type: "({ field, dir }) => void", default: "—", required: false, description: "Fired when sorting changes (server-side mode)." },
      { name: "onSaveClick", type: "() => void", default: "—", required: false, description: "Fired when bulk-action Save is clicked." },
      { name: "onCancelClick", type: "() => void", default: "—", required: false, description: "Fired when bulk-action Cancel is clicked." },
      { name: "onTreeRowExpanded", type: "(row) => void", default: "—", required: false, description: "Fired when a tree row is expanded." },
      { name: "onTreeRowCollapsed", type: "(row) => void", default: "—", required: false, description: "Fired when a tree row is collapsed." },
      { name: "onUnselectLabel", type: "(chip) => void", default: "—", required: false, description: "Fired when a filter chip is removed." },
      { name: "onUnselectAllLabels", type: "() => void", default: "—", required: false, description: "Fired when all filter chips are cleared." },
      { name: "onEmptyTableButtonClick", type: "() => void", default: "—", required: false, description: "Fired when the empty-state button is clicked." },
      { name: "onCheckedAllChange", type: "(allChecked) => void", default: "—", required: false, description: "Fired when select-all checkbox changes." },
      { name: "onCheckedChange", type: "(row) => void", default: "—", required: false, description: "Fired when a single row checkbox changes." },
      { name: "sx", type: "object", default: "{}", required: false, description: "Additional MUI sx styles." },
    ],
    extras: [
      {
        type: "table",
        title: "Column Definition",
        headers: ["Field", "Type", "Default", "Description"],
        rows: [
          ["field", "string", "—", "Data key for this column (required)"],
          ["header", "string", "field", "Display name in the header"],
          ["width", "string | number", "auto", "Column width"],
          ["sortable", "boolean", "true", "Enable sorting for this column"],
          ["render", "(value, row, idx) => ReactNode", "null", "Custom cell render function"],
        ],
      },
      {
        type: "table",
        title: "Table Variants (from screenshots)",
        headers: ["Variant", "Key Props"],
        rows: [
          ["Sample Table", "Basic table with sorting, search, count badge, actions column"],
          ["Sticky Columns", "enableStickyColumns + stickyColumnCount for horizontal scroll"],
          ["Tree Table", "enableTreeStructure with Children arrays and expand/collapse"],
          ["Reports Table", "isReportsTable for compact mode + enableTableHeaderWrapping"],
          ["Auto-Persist", "autoPersistDataOnPage for IndexedDB storage"],
        ],
      },
    ],
    examples: [
      {
        title: "Basic Table with Sorting & Search",
        code: `import { SapTable } from "@/packages/core/component/Table";

const tableData = {
  columns: [
    { field: "assignee", header: "Assignee", width: 150 },
    { field: "job", header: "Job" },
    { field: "status", header: "Status" },
    { field: "property", header: "Property & Tenant", width: 200 },
    { field: "created", header: "Created" },
    { field: "due", header: "Due" },
    {
      field: "priority",
      header: "Priority",
      render: (val) => (
        <Chip label={val} size="small" color={
          val === "Urgent" ? "error" :
          val === "High" ? "warning" :
          val === "Medium" ? "info" : "default"
        } />
      ),
    },
    { field: "category", header: "Category" },
  ],
  data: assignees, // your data array
};

<SapTable
  tableData={tableData}
  addSearchBox
  addTableCount
  countEntityTypeSingular="Assignee"
  countEntityTypePlural="Assignees"
  enableCheckBoxColumn
  enableTableSettings
  enableDropdownActions
  actionsTemplate={(row) => <IconButton size="small">⋮</IconButton>}
  onRowClick={(row) => navigate(\`/assignee/\${row.id}\`)}
  isEnableRowHover
  pageSize={25}
  isShowPageSizeOptions
/>`,
      },
      {
        title: "Sticky Columns Table",
        code: `<SapTable
  tableData={wideTableData}
  enableStickyColumns
  stickyColumnCount={2}
  enableTableSettings
  addTableCount
  countEntityTypeSingular="Item"
  countEntityTypePlural="Items"
  enableCheckBoxColumn
  pageSize={25}
/>`,
      },
      {
        title: "Tree Table with Drill-down",
        code: `const treeData = {
  columns: [
    { field: "task", header: "Tasks", width: 200 },
    { field: "assignee", header: "Assignee" },
    { field: "status", header: "Status",
      render: (val) => <Chip label={val} size="small" color={
        val === "In Progress" ? "info" : val === "Scheduled" ? "warning" : "default"
      } />
    },
    { field: "scheduled", header: "Scheduled" },
    { field: "completion", header: "Scheduled Completion" },
    { field: "start", header: "Start" },
    { field: "comments", header: "Comments", width: 300 },
  ],
  data: [
    {
      task: "Audit Review", assignee: "John Smith", status: "In Progress",
      scheduled: "Feb 1, 2024", completion: "May 15, 2024",
      start: "Feb 5, 2024", comments: "Please proceed to next step",
      Children: [
        { task: "Review Internal App", assignee: "John Smith", status: "In Progress", ... },
        { task: "Review Client Facing App", assignee: "John Smith", status: "In Progress", ... },
      ],
    },
    ...
  ],
};

<SapTable
  tableData={treeData}
  enableTreeStructure
  enableCheckBoxColumn
  addSearchBox
  addTableCount
  countEntityTypeSingular="Primary task"
  countEntityTypePlural="Primary tasks"
  enableDropdownActions
  actionsTemplate={(row) => <IconButton size="small">⋮</IconButton>}
  onTreeRowExpanded={(row) => console.log("Expanded:", row.task)}
/>`,
      },
      {
        title: "Reports Table (Compact)",
        code: `<SapTable
  tableData={reportData}
  isReportsTable
  enableTableHeaderWrapping
  enableStickyColumns
  stickyColumnCount={3}
  addSearchBox
  addTableCount
  doNotPaginate
  isEnableRowHover
/>`,
      },
    ],
    notes: [
      "The tableData prop expects { columns: ColumnDef[], data: object[] }. Columns define the schema; data contains row objects.",
      "Client-side sorting uses locale-aware string comparison with numeric detection.",
      "The useSapTable hook is exported separately for building custom table UIs.",
      "Tree structure requires the case-sensitive 'Children' key in data objects.",
      "Sticky columns use position: sticky with calculated left offsets — works with horizontal scroll.",
      "Reports mode (isReportsTable) reduces padding and font size for dense data display.",
      "Mobile card layout is used by default on small screens. Set mobileCardState=false to keep the table on mobile.",
      "Loading state shows a centred CircularProgress spinner.",
      "Empty state supports both a message and an optional CTA button via emptyTableButtonString.",
      "Filter chips integrate with the KPI/dashboard tile selection system via filterChipData + onUnselectLabel.",
    ],
  },

  /* ---- Editable Table ------------------------------------------ */
  "editable-table": {
    name: "SapEditableTable",
    badge: "data",
    description: "A fully-featured editable data table built on MUI. Supports text/edit mode toggle, row selection with checkboxes, inline cell editing (text, number, select, date, boolean), add/delete/save/cancel operations, search filtering, tree drill-down, bulk actions, column visibility settings, mobile card layout, sticky footer, zebra-striping, and entity count.",
    importCode: `import { SapEditableTable } from "@/packages/core/component/Table";`,
    props: [
      { name: "data", type: "Array<object>", default: "[]", required: true, description: "Data array for the table. Each object is one row." },
      { name: "updatedata", type: "Array<object>", default: "null", required: false, description: "When set, the table data updates AND the table resets to default non-edit, unchecked state." },
      { name: "columns", type: "ColumnDef[]", default: "[]", required: true, description: "Column definitions array. See Column Definition section below." },
      { name: "newItemValue", type: "object", default: "{}", required: false, description: "Object containing default data for newly added rows." },
      { name: "tableId", type: "string", default: '""', required: false, description: "HTML id attribute for the table wrapper." },
      { name: "isSearchBox", type: "boolean", default: "false", required: false, description: "Show or hide the search box." },
      { name: "isDeleteSelectButton", type: "boolean", default: "true", required: false, description: "Show or hide the delete button for selected rows." },
      { name: "isAddNew", type: "boolean", default: "true", required: false, description: "Show or hide the Add New button in the footer." },
      { name: "addNewText", type: "string", default: '"Add New"', required: false, description: "Label text for the add-new button." },
      { name: "allowsEditing", type: "boolean", default: "true", required: false, description: "Show or hide the Edit button." },
      { name: "stickyFooter", type: "boolean", default: "false", required: false, description: "Make the footer button row sticky at the bottom." },
      { name: "mobileCardState", type: "boolean", default: "false", required: false, description: "Render rows as cards on mobile screens instead of a table." },
      { name: "isEnableTextMode", type: "boolean", default: "true", required: false, description: "When true, the table loads in read-only text mode. When false, it loads in edit mode." },
      { name: "enableCheckBoxColumn", type: "boolean", default: "true", required: false, description: "Show or hide the checkbox selection column." },
      { name: "isShowTableHeader", type: "boolean", default: "true", required: false, description: "Show or hide the entire header toolbar (search, buttons, settings)." },
      { name: "headerTemplate", type: "ReactNode", default: "null", required: false, description: "Custom header element. Replaces the standard edit/delete/cancel toolbar." },
      { name: "enableTableSettings", type: "boolean", default: "true", required: false, description: "Show or hide the column visibility settings dropdown." },
      { name: "enableFixedHeader", type: "boolean", default: "false", required: false, description: "Fix the table header to the page top when scrolled." },
      { name: "textMode", type: "boolean", default: "null", required: false, description: "Controlled toggle between input fields and plain text display." },
      { name: "isEnableShadeAltRows", type: "boolean", default: "false", required: false, description: "Zebra-striping on every other row." },
      { name: "customColumnKeys", type: "string[]", default: "[]", required: false, description: "When isSearchBox is true, specifies which data attributes to search. Falls back to column field attributes." },
      { name: "addTableCount", type: "boolean", default: "false", required: false, description: "Show the count of rows in the header." },
      { name: "countEntityTypeSingular", type: "string", default: '"Item"', required: false, description: 'Singular entity name for the count display (e.g. "User").' },
      { name: "countEntityTypePlural", type: "string", default: '"Items"', required: false, description: 'Plural entity name for the count display (e.g. "Users").' },
      { name: "bulkActionsList", type: "BulkAction[]", default: "[]", required: false, description: "Array of bulk action buttons shown when rows are selected. Each: { label, onClick, icon?, color? }." },
      { name: "showSaveButton", type: "boolean", default: "false", required: false, description: "Add a Save action to the bulk actions bar." },
      { name: "showEditDeleteCounts", type: "boolean", default: "true", required: false, description: "Show the count of affected items in Edit and Delete buttons." },
      { name: "enableTreeStructure", type: "boolean", default: "false", required: false, description: 'Enable drill-down tree rows. Rows with a Children array get expand/collapse arrows. Note: "Children" key is case-sensitive.' },
      { name: "bulkActionDesktop", type: "ReactNode", default: "null", required: false, description: "Custom bulk action element for desktop." },
      { name: "bulkActionMobile", type: "ReactNode", default: "null", required: false, description: "Custom bulk action element for mobile." },
      { name: "customButton", type: "ReactNode", default: "null", required: false, description: "Custom button element in the footer (right side)." },
      { name: "onChangeMode", type: "(isTextMode) => void", default: "—", required: false, description: "Fires whenever the text/edit mode changes." },
      { name: "onSave", type: "(data) => void", default: "—", required: false, description: "Fires when Save is clicked. Returns the updated data array." },
      { name: "onDelete", type: "(data) => void", default: "—", required: false, description: "Fires when Delete is clicked. Returns the remaining data." },
      { name: "onCancel", type: "() => void", default: "—", required: false, description: "Fires when Cancel is clicked (reverts to original data)." },
      { name: "onAdd", type: "(newRow) => void", default: "—", required: false, description: "Fires after a new row is added." },
      { name: "returnSelectedRows", type: "(ids) => void", default: "—", required: false, description: "Fires whenever selection changes. Returns array of selected row ids." },
      { name: "returnDeletedRows", type: "(rows) => void", default: "—", required: false, description: "Fires on deletion. Returns array of deleted row objects." },
      { name: "onCancelClick", type: "() => void", default: "—", required: false, description: "Fires when the bulk-actions Cancel button is clicked." },
      { name: "onTreeRowExpanded", type: "(row) => void", default: "—", required: false, description: "Fires when a tree row is expanded." },
      { name: "onTreeRowCollapsed", type: "(row) => void", default: "—", required: false, description: "Fires when a tree row is collapsed." },
      { name: "sx", type: "object", default: "{}", required: false, description: "Additional MUI sx styles for the Paper wrapper." },
    ],
    extras: [
      {
        type: "table",
        title: "Column Definition (ColumnDef)",
        headers: ["Field", "Type", "Default", "Description"],
        rows: [
          ["field", "string", "—", "Key in the data object for this column (required)"],
          ["header", "string", "—", "Display name in the table header"],
          ["type", '"text" | "number" | "select" | "date" | "boolean"', '"text"', "Cell editor type when in edit mode"],
          ["editable", "boolean", "true", "Whether the cell is editable"],
          ["width", "string | number", "auto", "Column width (px or CSS value)"],
          ["options", "{ label, value }[]", "[]", "Options for select-type columns"],
          ["render", "(value, row) => ReactNode", "null", "Custom cell render function (text mode)"],
          ["searchable", "boolean", "true", "Include in search filtering"],
          ["hidden", "boolean", "false", "Initially hidden (toggleable via settings)"],
        ],
      },
    ],
    examples: [
      {
        title: "Basic Editable Table",
        code: `import { SapEditableTable } from "@/packages/core/component/Table";

const columns = [
  { field: "name",   header: "Name",   type: "text" },
  { field: "email",  header: "Email",  type: "text" },
  { field: "role",   header: "Role",   type: "select",
    options: [
      { label: "Admin",  value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
    ]
  },
  { field: "active", header: "Active", type: "boolean" },
];

const data = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "admin",  active: true },
  { id: 2, name: "Bob",   email: "bob@example.com",   role: "editor", active: true },
  { id: 3, name: "Carol", email: "carol@example.com",  role: "viewer", active: false },
];

<SapEditableTable
  data={data}
  columns={columns}
  isSearchBox
  addTableCount
  countEntityTypeSingular="User"
  countEntityTypePlural="Users"
  onSave={(updated) => console.log("Saved:", updated)}
  onDelete={(remaining) => console.log("After delete:", remaining)}
/>`,
      },
      {
        title: "Tree Structure with Drill-down",
        code: `const treeData = [
  {
    id: 1, name: "Engineering", budget: 500000,
    Children: [
      { id: 11, name: "Frontend", budget: 200000 },
      { id: 12, name: "Backend",  budget: 300000,
        Children: [
          { id: 121, name: "API Team",  budget: 150000 },
          { id: 122, name: "DB Team",   budget: 150000 },
        ],
      },
    ],
  },
  { id: 2, name: "Design", budget: 200000 },
];

<SapEditableTable
  data={treeData}
  columns={[
    { field: "name",   header: "Department", type: "text" },
    { field: "budget", header: "Budget",     type: "number",
      render: (v) => \`₹\${v?.toLocaleString()}\`
    },
  ]}
  enableTreeStructure
  isAddNew={false}
  onTreeRowExpanded={(row) => console.log("Expanded:", row.name)}
/>`,
      },
      {
        title: "Bulk Actions with Custom Buttons",
        code: `<SapEditableTable
  data={orderData}
  columns={orderColumns}
  enableCheckBoxColumn
  isShowTableHeader
  bulkActionsList={[
    { label: "Archive",  onClick: handleArchive, color: "secondary" },
    { label: "Export",   onClick: handleExport },
  ]}
  showSaveButton
  stickyFooter
  customButton={<Button variant="contained">Generate Report</Button>}
/>`,
      },
      {
        title: "Mobile Card Layout",
        code: `<SapEditableTable
  data={data}
  columns={columns}
  mobileCardState
  isEnableShadeAltRows
  enableTableSettings={false}
  addTableCount
/>`,
      },
    ],
    notes: [
      "The table uses MUI's theme automatically — colours, backgrounds, and borders adapt to light/dark mode.",
      "The useEditableTable hook is exported separately if you need to build a custom table UI with the same state management.",
      "When updatedata prop changes, the table resets to text mode with no selections — useful after server-side saves.",
      'Tree structure requires the case-sensitive "Children" key in your data objects.',
      "Column visibility can be toggled via the settings gear icon. Hidden columns are not rendered.",
      "The headerTemplate prop completely replaces the default toolbar — use it for fully custom headers.",
      "Bulk actions mode activates automatically when bulkActionsList has entries. The classic Edit/Delete/Cancel bar is hidden in this mode.",
      "Search filters across all columns with a field attribute by default. Use customColumnKeys to restrict.",
    ],
  },

  /* ================================================================
     FORM CONTROLS
     ================================================================ */

  /* ---- Input --------------------------------------------------- */
  "control-input": {
    name: "SapControlInput",
    badge: "utility",
    description: "General-purpose text / password input with text-mode toggle, max/min length enforcement, SSN masking and validation, and full MUI theming. Supports controlled usage via value + onChange.",
    importCode: `import { SapControlInput } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: '""', required: false, description: "Current input value (controlled)." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on every keystroke with the current value." },
      { name: "onBlur", type: "(value) => void", default: "—", required: false, description: "Fires when the input loses focus." },
      { name: "onKeyDown", type: "(key) => void", default: "—", required: false, description: "Fires on key press with the key string." },
      { name: "type", type: "string", default: '"text"', required: false, description: 'HTML input type. Use "password" for password fields.' },
      { name: "maxLength", type: "number", default: "100", required: false, description: "Maximum character length. Negative values reset to 100." },
      { name: "disableMaxLength", type: "boolean", default: "false", required: false, description: "Disables the maxLength attribute and max-length error." },
      { name: "minLength", type: "number", default: "0", required: false, description: "Minimum character length. Negative values reset to 0." },
      { name: "readOnly", type: "boolean", default: "false", required: false, description: "Makes the input non-editable but focusable." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "When true, renders the value as plain text instead of an input field." },
      { name: "textModeEmptyState", type: "string", default: '""', required: false, description: "Placeholder text displayed in text mode when value is empty." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Marks the field as required. Shows validation error when empty." },
      { name: "placeholder", type: "string", default: '""', required: false, description: "Input placeholder text." },
      { name: "autoComplete", type: "string", default: '"on"', required: false, description: "HTML autocomplete attribute." },
      { name: "isSSN", type: "boolean", default: "false", required: false, description: "Enables SSN masking (XXX-XX-XXXX) and validation rules." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI TextField label." },
      { name: "error", type: "boolean", default: "false", required: false, description: "Force error state externally." },
      { name: "helperText", type: "string", default: "—", required: false, description: "Custom helper / error text below the input." },
      { name: "id", type: "string", default: '""', required: false, description: "HTML id attribute." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name attribute." },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disables the input." },
      { name: "fullWidth", type: "boolean", default: "true", required: false, description: "MUI fullWidth prop." },
      { name: "sx", type: "object", default: "{}", required: false, description: "Additional MUI sx styles." },
    ],
    examples: [
      { title: "Basic Input", code: `<SapControlInput\n  label="Full Name"\n  value={name}\n  onChange={setName}\n  required\n  placeholder="e.g. John Doe"\n/>` },
      { title: "Password Field", code: `<SapControlInput\n  label="Password"\n  type="password"\n  value={pw}\n  onChange={setPw}\n  maxLength={64}\n  required\n/>` },
      { title: "SSN Input", code: `<SapControlInput\n  label="Social Security Number"\n  isSSN\n  value={ssn}\n  onChange={setSsn}\n  required\n/>` },
      { title: "Text Mode", code: `<SapControlInput\n  label="Email"\n  value="john@example.com"\n  textMode\n  textModeEmptyState="Not provided"\n/>` },
    ],
    notes: [
      "SSN validation rejects area numbers 000, 666, or starting with 9; group 00; and serial 0000.",
      "The component auto-formats SSN values with dashes as the user types.",
      "maxLength is enforced both via the HTML attribute and by truncating in onChange.",
      "Validation errors appear after the first blur (touched state).",
    ],
  },

  /* ---- Email --------------------------------------------------- */
  "control-email": {
    name: "SapControlEmail",
    badge: "utility",
    description: "Email-specific input with built-in format validation, text-mode toggle, max length enforcement, and MUI theming.",
    importCode: `import { SapControlEmail } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: '""', required: false, description: "Current email value." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on change." },
      { name: "onBlur", type: "(value) => void", default: "—", required: false, description: "Fires on blur." },
      { name: "maxLength", type: "number", default: "100", required: false, description: "Maximum character length." },
      { name: "disableMaxLength", type: "boolean", default: "false", required: false, description: "Disables maxLength." },
      { name: "readOnly", type: "boolean", default: "false", required: false, description: "Non-editable state." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as plain text." },
      { name: "textModeEmptyState", type: "string", default: '""', required: false, description: "Empty text-mode placeholder." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "placeholder", type: "string", default: '""', required: false, description: "Placeholder text." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "id", type: "string", default: '""', required: false, description: "HTML id." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Basic Email", code: `<SapControlEmail\n  label="Work Email"\n  value={email}\n  onChange={setEmail}\n  required\n  placeholder="e.g. name@company.com"\n/>` },
    ],
    notes: [
      "Validates email format on blur using a standard regex pattern.",
      "Sets the HTML input type to 'email' for mobile keyboard optimisation.",
    ],
  },

  /* ---- Textarea ------------------------------------------------ */
  "control-textarea": {
    name: "SapControlTextarea",
    badge: "utility",
    description: "Multiline text input with character-count range display, max/min length enforcement, text-mode toggle, and MUI theming.",
    importCode: `import { SapControlTextarea } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: '""', required: false, description: "Current value." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on change." },
      { name: "onBlur", type: "(value) => void", default: "—", required: false, description: "Fires on blur." },
      { name: "rows", type: "number", default: "10", required: false, description: "Visible row count (height)." },
      { name: "maxLength", type: "number", default: "500", required: false, description: "Maximum character length." },
      { name: "disableMaxLength", type: "boolean", default: "false", required: false, description: "Disables maxLength." },
      { name: "minLength", type: "number", default: "0", required: false, description: "Minimum character length." },
      { name: "showRange", type: "boolean", default: "false", required: false, description: 'Shows "current / max" character counter below the field.' },
      { name: "disableMaxLengthError", type: "boolean", default: "false", required: false, description: "Disables the max-length validation error while keeping the attribute." },
      { name: "readOnly", type: "boolean", default: "false", required: false, description: "Non-editable state." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as plain text with whitespace preserved." },
      { name: "textModeEmptyState", type: "string", default: '""', required: false, description: "Empty text-mode placeholder." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "placeholder", type: "string", default: '""', required: false, description: "Placeholder text." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "id", type: "string", default: '""', required: false, description: "HTML id." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "With Range Counter", code: `<SapControlTextarea\n  label="Description"\n  value={desc}\n  onChange={setDesc}\n  maxLength={2000}\n  showRange\n  rows={6}\n  placeholder="Enter a detailed description…"\n/>` },
    ],
    notes: [
      "Text mode preserves whitespace formatting via CSS white-space: pre-wrap.",
      "showRange displays a live character counter (e.g. '142 / 2000') as helper text.",
      "maxLength defaults to 500 for textareas (vs 100 for regular inputs).",
    ],
  },

  /* ---- Number -------------------------------------------------- */
  "control-number": {
    name: "SapControlNumber",
    badge: "utility",
    description: "Numeric input with configurable decimal places, min/max constraints, non-negative validation, blank-to-zero display, text-mode toggle, and MUI theming.",
    importCode: `import { SapControlNumber } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "number | string", default: '""', required: false, description: "Current numeric value." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on change (string while typing, number on blur)." },
      { name: "onBlur", type: "(value) => void", default: "—", required: false, description: "Fires on blur with the parsed number." },
      { name: "onFocus", type: "() => void", default: "—", required: false, description: "Fires when the field receives focus." },
      { name: "decimals", type: "number", default: "2", required: false, description: "Number of decimal places displayed on blur." },
      { name: "min", type: "number", default: "null", required: false, description: "Minimum allowed value." },
      { name: "max", type: "number", default: "null", required: false, description: "Maximum allowed value." },
      { name: "nonNegative", type: "boolean", default: "false", required: false, description: "Validates that the value is not negative." },
      { name: "isBlank", type: "boolean", default: "false", required: false, description: "When true, shows 0.00 (with decimals) instead of an empty field when value is null." },
      { name: "readOnly", type: "boolean", default: "false", required: false, description: "Non-editable state." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as plain formatted number." },
      { name: "textModeEmptyState", type: "string", default: '""', required: false, description: "Empty text-mode placeholder." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "placeholder", type: "string", default: '""', required: false, description: "Placeholder text." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "id", type: "string", default: '""', required: false, description: "HTML id." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Currency Input", code: `<SapControlNumber\n  label="Amount"\n  value={amount}\n  onChange={setAmount}\n  decimals={2}\n  min={0}\n  nonNegative\n  isBlank\n  placeholder="0.00"\n/>` },
      { title: "Integer with Range", code: `<SapControlNumber\n  label="Quantity"\n  value={qty}\n  onChange={setQty}\n  decimals={0}\n  min={1}\n  max={999}\n  required\n/>` },
    ],
    notes: [
      "While focused the raw value is shown for easy editing. On blur the value is formatted to the specified decimal places.",
      "The component uses inputMode='decimal' for mobile numeric keyboards.",
      "Only valid numeric characters (digits, period, minus) are accepted.",
      "isBlank fills the display with '0.00' (matching decimals) when the value is null.",
    ],
  },

  /* ---- Checkbox ------------------------------------------------ */
  "control-checkbox": {
    name: "SapControlCheckbox",
    badge: "utility",
    description: "Themed checkbox with text-mode toggle, true/false value mapping, colour variants, inline alignment, indeterminate state, and MUI theming.",
    importCode: `import { SapControlCheckbox } from "@/packages/core/component/Form";`,
    props: [
      { name: "checked", type: "boolean", default: "false", required: false, description: "Checked state (controlled)." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires with the new checked boolean (or trueValue/falseValue)." },
      { name: "value", type: "string", default: '""', required: false, description: "HTML value attribute." },
      { name: "label", type: "string", default: "—", required: false, description: "Label text beside the checkbox." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as a read-only visual indicator." },
      { name: "alternateTextMode", type: "boolean", default: "false", required: false, description: "Lighter appearance in text mode." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "color", type: "string", default: '"primary"', required: false, description: 'Colour variant: "primary", "secondary", "success", "info", "danger", "warning".' },
      { name: "displayInline", type: "boolean", default: "false", required: false, description: "Display inline with sibling checkboxes." },
      { name: "isTrueFalse", type: "boolean", default: "false", required: false, description: "Enable true/false string value mapping." },
      { name: "trueValue", type: "string", default: '""', required: false, description: "Value when checked (requires isTrueFalse)." },
      { name: "falseValue", type: "string", default: '""', required: false, description: "Value when unchecked (requires isTrueFalse)." },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disables the checkbox." },
      { name: "readOnly", type: "boolean", default: "false", required: false, description: "Alternative to disabled." },
      { name: "indeterminate", type: "boolean", default: "false", required: false, description: "Show indeterminate (dash) state." },
      { name: "ariaLabel", type: "string", default: "—", required: false, description: "Custom aria-label." },
      { name: "id", type: "string", default: '""', required: false, description: "HTML id." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Basic Checkbox", code: `<SapControlCheckbox\n  label="I agree to the terms"\n  checked={agreed}\n  onChange={setAgreed}\n  required\n/>` },
      { title: "True/False Mapping", code: `<SapControlCheckbox\n  label="Active Status"\n  isTrueFalse\n  trueValue="Y"\n  falseValue="N"\n  value={status}\n  onChange={setStatus}\n  color="success"\n/>` },
      { title: "Inline Group", code: `<Box>\n  <SapControlCheckbox label="Read"   checked={perms.read}   onChange={(v) => setPerms({...perms, read: v})}   displayInline />\n  <SapControlCheckbox label="Write"  checked={perms.write}  onChange={(v) => setPerms({...perms, write: v})}  displayInline />\n  <SapControlCheckbox label="Admin"  checked={perms.admin}  onChange={(v) => setPerms({...perms, admin: v})}  displayInline color="danger" />\n</Box>` },
    ],
    notes: [
      "Colour names map to MUI palette: 'danger' maps to MUI 'error'.",
      "In isTrueFalse mode, onChange emits the trueValue/falseValue string instead of a boolean.",
      "Text mode renders a styled box with a checkmark — no interactive behaviour.",
      "alternateTextMode reduces opacity for de-emphasised read-only display.",
    ],
  },

  /* ---- Radio --------------------------------------------------- */
  "control-radio": {
    name: "SapControlRadio",
    badge: "utility",
    description: "Themed radio button with text-mode toggle, colour variants, inline alignment, and MUI theming. Wrap multiple instances in an MUI RadioGroup for mutual exclusion.",
    importCode: `import { SapControlRadio } from "@/packages/core/component/Form";`,
    props: [
      { name: "checked", type: "boolean", default: "false", required: false, description: "Whether this radio is selected." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires with the radio's value when selected." },
      { name: "value", type: "string", default: '""', required: false, description: "HTML value attribute." },
      { name: "label", type: "string", default: "—", required: false, description: "Label text beside the radio." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as read-only visual indicator." },
      { name: "alternateTextMode", type: "boolean", default: "false", required: false, description: "Lighter appearance in text mode." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "color", type: "string", default: '"primary"', required: false, description: 'Colour variant: "primary", "secondary", "success", "info", "danger", "warning".' },
      { name: "displayInline", type: "boolean", default: "false", required: false, description: "Display inline with sibling radios." },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disables the radio." },
      { name: "readOnly", type: "boolean", default: "false", required: false, description: "Alternative to disabled." },
      { name: "radioId", type: "string", default: '""', required: false, description: "HTML id for the radio input." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name attribute (groups radios)." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Radio Group", code: `const [plan, setPlan] = useState("basic");\n\n<Box>\n  <SapControlRadio\n    label="Basic"\n    value="basic"\n    checked={plan === "basic"}\n    onChange={setPlan}\n    name="plan"\n    displayInline\n  />\n  <SapControlRadio\n    label="Pro"\n    value="pro"\n    checked={plan === "pro"}\n    onChange={setPlan}\n    name="plan"\n    displayInline\n    color="secondary"\n  />\n  <SapControlRadio\n    label="Enterprise"\n    value="enterprise"\n    checked={plan === "enterprise"}\n    onChange={setPlan}\n    name="plan"\n    displayInline\n    color="success"\n  />\n</Box>` },
    ],
    notes: [
      "For mutual exclusion, give all radios in a group the same name prop.",
      "Alternatively, wrap in an MUI RadioGroup component for built-in group management.",
      "Text mode renders a styled circle with a filled dot — no interactive behaviour.",
      "Colour names map to MUI palette: 'danger' maps to MUI 'error'.",
    ],
  },

  /* ---- Date Picker --------------------------------------------- */
  "control-date": {
    name: "SapControlDate",
    badge: "utility",
    description: "Date picker using the native HTML date input with min/max constraints, configurable display format, text-mode toggle, required validation, and MUI theming.",
    importCode: `import { SapControlDate } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: '""', required: false, description: 'Date value in YYYY-MM-DD format.' },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on date change." },
      { name: "onBlur", type: "(value) => void", default: "—", required: false, description: "Fires on blur." },
      { name: "onSetTime", type: "(value) => void", default: "—", required: false, description: "Fires on both change and blur." },
      { name: "minDate", type: "string", default: '""', required: false, description: "Earliest allowed date (YYYY-MM-DD)." },
      { name: "maxDate", type: "string", default: '""', required: false, description: "Latest allowed date (YYYY-MM-DD)." },
      { name: "autoFormat", type: "string", default: '"MM/DD/YYYY"', required: false, description: "Display format for text mode." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as formatted text." },
      { name: "textModeEmptyState", type: "string", default: '""', required: false, description: "Empty text-mode placeholder." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "readOnly", type: "boolean", default: "false", required: false, description: "Non-editable." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "placeholder", type: "string", default: '""', required: false, description: "Placeholder." },
      { name: "id", type: "string", default: '""', required: false, description: "HTML id." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Basic Date Picker", code: `<SapControlDate\n  label="Start Date"\n  value={startDate}\n  onChange={setStartDate}\n  required\n/>` },
      { title: "With Min/Max Constraints", code: `<SapControlDate\n  label="Appointment"\n  value={appt}\n  onChange={setAppt}\n  minDate="2026-01-01"\n  maxDate="2026-12-31"\n/>` },
    ],
    notes: [
      "Uses the native HTML date input for broad browser support and mobile-optimised keyboards.",
      "autoFormat is used for text-mode display only — the input always uses YYYY-MM-DD internally.",
      "Validates min/max constraints on blur and shows appropriate error messages.",
    ],
  },

  /* ---- Date Range ---------------------------------------------- */
  "control-date-range": {
    name: "SapControlDateRange",
    badge: "utility",
    description: "Two-field date range picker (start + end) with cross-field validation (start must be before end), min/max constraints, text-mode toggle, and MUI theming.",
    importCode: `import { SapControlDateRange } from "@/packages/core/component/Form";`,
    props: [
      { name: "startValue", type: "string", default: '""', required: false, description: "Start date (YYYY-MM-DD)." },
      { name: "endValue", type: "string", default: '""', required: false, description: "End date (YYYY-MM-DD)." },
      { name: "onChange", type: "({ startDate, endDate }) => void", default: "—", required: false, description: "Fires with both dates on change." },
      { name: "onBlur", type: "({ startDate, endDate }) => void", default: "—", required: false, description: "Fires on blur." },
      { name: "onSetTime", type: "({ startDate, endDate }) => void", default: "—", required: false, description: "Fires on change and blur." },
      { name: "minDate", type: "string", default: '""', required: false, description: "Earliest allowed date." },
      { name: "maxDate", type: "string", default: '""', required: false, description: "Latest allowed date." },
      { name: "autoFormat", type: "string", default: '"MM/DD/YYYY"', required: false, description: "Display format for text mode." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as formatted text." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Both dates required." },
      { name: "label", type: "string", default: "—", required: false, description: "Base label (appended with Start/End)." },
      { name: "startPlaceholder", type: "string", default: '""', required: false, description: "Start field placeholder." },
      { name: "endPlaceholder", type: "string", default: '""', required: false, description: "End field placeholder." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Basic Date Range", code: `<SapControlDateRange\n  label="Report Period"\n  startValue={range.start}\n  endValue={range.end}\n  onChange={({ startDate, endDate }) =>\n    setRange({ start: startDate, end: endDate })\n  }\n  required\n/>` },
    ],
    notes: [
      "Validates that start date is before end date on blur.",
      "Renders two side-by-side date inputs with a 'to' label between them.",
      'Text mode shows "Start → End" formatted with autoFormat.',
    ],
  },

  /* ---- Date Range Single --------------------------------------- */
  "control-date-range-single": {
    name: "SapControlDateRangeSingle",
    badge: "utility",
    description: "Single-input date range picker with preset range buttons (Today, Last 7 days, Month to date, etc.) and a custom range calendar. Opens a dropdown menu with preset options.",
    importCode: `import { SapControlDateRangeSingle } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "{ startDate, endDate }", default: "null", required: false, description: "Current date range." },
      { name: "onChange", type: "(range) => void", default: "—", required: false, description: "Fires with resolved range." },
      { name: "onSetTime", type: "(range) => void", default: "—", required: false, description: "Fires on change." },
      { name: "ranges", type: "Preset[]", default: "9 built-in presets", required: false, description: "Custom preset ranges array. Each: { label, days?, months?, year?, wtd?, mtd?, ytd? }." },
      { name: "showCustomRangeLabel", type: "boolean", default: "false", required: false, description: "Show 'Custom Range' option with date inputs." },
      { name: "alwaysShowCalendars", type: "boolean", default: "true", required: false, description: "Show calendar controls when opened." },
      { name: "minDate", type: "string", default: '""', required: false, description: "Earliest allowed date." },
      { name: "maxDate", type: "string", default: '""', required: false, description: "Latest allowed date." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as formatted text." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "With Presets", code: `<SapControlDateRangeSingle\n  label="Reporting Period"\n  value={period}\n  onChange={setPeriod}\n  showCustomRangeLabel\n/>` },
      { title: "Custom Presets", code: `<SapControlDateRangeSingle\n  label="Filter"\n  value={filter}\n  onChange={setFilter}\n  ranges={[\n    { label: "Last Quarter", months: -3 },\n    { label: "Last Half Year", months: -6 },\n    { label: "Full Year", months: -12 },\n  ]}\n/>` },
    ],
    notes: [
      "Default presets: Today, Last 7/30 days, Last month/12 months/year, Week/Month/Year to date.",
      "Custom Range mode shows two inline date inputs with an Apply button.",
      'The display field shows the formatted range as "MM/DD/YYYY – MM/DD/YYYY".',
    ],
  },

  /* ---- Month Picker -------------------------------------------- */
  "control-post-month": {
    name: "SapControlPostMonth",
    badge: "utility",
    description: "Month + year picker using the native HTML month input. Displays the selected month in human-readable format (e.g. 'January 2026'). Supports text-mode and MUI theming.",
    importCode: `import { SapControlPostMonth } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: '""', required: false, description: 'Month value in YYYY-MM format.' },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on change." },
      { name: "onBlur", type: "(value) => void", default: "—", required: false, description: "Fires on blur." },
      { name: "onSetTime", type: "(value) => void", default: "—", required: false, description: "Fires on change." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as text (e.g. 'January 2026')." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "readOnly", type: "boolean", default: "false", required: false, description: "Non-editable." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "id", type: "string", default: '""', required: false, description: "HTML id." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Basic Month Picker", code: `<SapControlPostMonth\n  label="Post Month"\n  value={month}\n  onChange={setMonth}\n  required\n/>` },
    ],
    notes: [
      "Uses native HTML type='month' for browser-native month selection.",
      "Text mode displays full month name + year (e.g. 'March 2026').",
    ],
  },

  /* ---- Year Picker --------------------------------------------- */
  "control-year": {
    name: "SapControlYear",
    badge: "utility",
    description: "Year-only picker rendered as a select dropdown of years. Range defaults to current year -20 to +10 but is configurable via minYear/maxYear. Supports text-mode and MUI theming.",
    importCode: `import { SapControlYear } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "number | string", default: '""', required: false, description: "Selected year." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on change." },
      { name: "onBlur", type: "(value) => void", default: "—", required: false, description: "Fires on blur." },
      { name: "minYear", type: "number", default: "currentYear - 20", required: false, description: "Earliest year in the dropdown." },
      { name: "maxYear", type: "number", default: "currentYear + 10", required: false, description: "Latest year in the dropdown." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as text." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "id", type: "string", default: '""', required: false, description: "HTML id." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Basic Year Picker", code: `<SapControlYear\n  label="Fiscal Year"\n  value={year}\n  onChange={setYear}\n  minYear={2020}\n  maxYear={2030}\n  required\n/>` },
    ],
    notes: [
      "Years are listed in descending order (newest first).",
      "Includes a blank '— Select Year —' option at the top.",
    ],
  },

  /* ---- Dropdown ------------------------------------------------ */
  "control-dropdown": {
    name: "SapControlDropdown",
    badge: "utility",
    description: "Searchable dropdown with single or multi-select, clearable selection, configurable id/display props, text-mode toggle, and MUI theming. Multi-select renders selected items as chips.",
    importCode: `import { SapControlDropdown } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "any", default: '""', required: false, description: "Selected value(s). Array for multiple mode." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on selection change." },
      { name: "onBlur", type: "(value) => void", default: "—", required: false, description: "Fires on blur." },
      { name: "onFocus", type: "() => void", default: "—", required: false, description: "Fires on focus." },
      { name: "onToggle", type: "(isOpen) => void", default: "—", required: false, description: "Fires when dropdown opens/closes." },
      { name: "items", type: "object[]", default: "[]", required: true, description: "Array of option objects. E.g. [{ id: 'US', name: 'United States' }]." },
      { name: "idProp", type: "string", default: '"id"', required: false, description: "Key in items for the option value." },
      { name: "displayProp", type: "string", default: '"name"', required: false, description: "Key in items for the display label." },
      { name: "multiple", type: "boolean", default: "false", required: false, description: "Allow multiple selections." },
      { name: "enableSearchBox", type: "boolean", default: "false", required: false, description: "Show search-as-you-type filter inside the dropdown." },
      { name: "clearable", type: "boolean", default: "false", required: false, description: "Show a clear (✕) button." },
      { name: "fullObject", type: "boolean", default: "false", required: false, description: "Emit the full item object instead of just the id." },
      { name: "disableBlankItem", type: "boolean", default: "false", required: false, description: 'Hide the default blank "— Select —" option.' },
      { name: "closeOnSelect", type: "boolean", default: "auto", required: false, description: "Close dropdown on select. Defaults to true for single, false for multiple." },
      { name: "clearSearchOnAdd", type: "boolean", default: "false", required: false, description: "Clear search input after a multi-select pick." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as plain text." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable the dropdown." },
      { name: "label", type: "string", default: '"— Select —"', required: false, description: "MUI label." },
      { name: "placeholder", type: "string", default: '""', required: false, description: "Placeholder when nothing selected." },
      { name: "id", type: "string", default: '""', required: false, description: "HTML id." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Basic Dropdown", code: `<SapControlDropdown\n  label="Country"\n  items={[\n    { id: "US", name: "United States" },\n    { id: "CA", name: "Canada" },\n    { id: "UK", name: "United Kingdom" },\n  ]}\n  value={country}\n  onChange={setCountry}\n  enableSearchBox\n  clearable\n  required\n/>` },
      { title: "Multi-Select with Chips", code: `<SapControlDropdown\n  label="Tags"\n  items={allTags}\n  value={selectedTags}\n  onChange={setSelectedTags}\n  multiple\n  enableSearchBox\n  clearable\n  clearSearchOnAdd\n/>` },
    ],
    notes: [
      "The search box is sticky at the top of the dropdown list.",
      "Multi-select renders selected values as MUI Chip components.",
      "fullObject mode emits the entire item object instead of just the idProp value.",
      "The dropdown max-height is 300px with internal scroll.",
    ],
  },

  /* ---- Select (Grouped) ---------------------------------------- */
  "control-select": {
    name: "SapControlSelect",
    badge: "utility",
    description: "Grouped, searchable select dropdown with single or multi-select, inline search, clearable selection, item grouping via groupBy, text-mode toggle, and MUI theming.",
    importCode: `import { SapControlSelect } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "any", default: '""', required: false, description: "Selected value(s)." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on selection change." },
      { name: "onToggle", type: "(isOpen) => void", default: "—", required: false, description: "Fires when dropdown opens/closes." },
      { name: "items", type: "object[]", default: "[]", required: true, description: "Array of option objects. E.g. [{ id: 1, name: 'Cat A', group: 'Group 1' }]." },
      { name: "idProp", type: "string", default: '"id"', required: false, description: "Key for the option value." },
      { name: "displayProp", type: "string", default: '"name"', required: false, description: "Key for the display label." },
      { name: "groupBy", type: "string", default: "null", required: false, description: "Key to group items by. Renders ListSubheader for each group." },
      { name: "multiple", type: "boolean", default: "false", required: false, description: "Allow multiple selections." },
      { name: "fullObject", type: "boolean", default: "false", required: false, description: "Emit full item objects." },
      { name: "clearable", type: "boolean", default: "true", required: false, description: "Show a clear (✕) button." },
      { name: "inlineSearchable", type: "boolean", default: "true", required: false, description: "Show inline search input at the top of the dropdown." },
      { name: "defaultLabel", type: "string", default: '""', required: false, description: "Fallback label for items missing the displayProp." },
      { name: "defaultValue", type: "string", default: '""', required: false, description: "Fallback value for items missing the idProp." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as plain text." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable the select." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "placeholder", type: "string", default: '""', required: false, description: "Placeholder." },
      { name: "id", type: "string", default: '""', required: false, description: "HTML id." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Grouped Select", code: `<SapControlSelect\n  label="Category"\n  items={[\n    { id: 1, name: "Frontend",  group: "Engineering" },\n    { id: 2, name: "Backend",   group: "Engineering" },\n    { id: 3, name: "UX Design", group: "Design" },\n    { id: 4, name: "Branding",  group: "Design" },\n  ]}\n  value={category}\n  onChange={setCategory}\n  groupBy="group"\n  inlineSearchable\n  clearable\n/>` },
      { title: "Multi-Select without Groups", code: `<SapControlSelect\n  label="Skills"\n  items={skillItems}\n  value={selectedSkills}\n  onChange={setSelectedSkills}\n  multiple\n  inlineSearchable\n/>` },
    ],
    notes: [
      "When groupBy is set, items are grouped under ListSubheader labels.",
      "Group items are indented for visual hierarchy.",
      "Inline search filters across all groups simultaneously.",
      "defaultLabel / defaultValue provide fallback values for items missing the expected keys.",
    ],
  },

  /* ---- Phone Number -------------------------------------------- */
  "phone-number": {
    name: "SapPhoneNumber",
    badge: "utility",
    description: "Formatted phone-number input with automatic (XXX) XXX-XXXX formatting as the user types, max-length enforcement, phone validation, text-mode toggle, and MUI theming.",
    importCode: `import { SapPhoneNumber } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: '""', required: false, description: "Current phone value." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on change." },
      { name: "onBlur", type: "(value) => void", default: "—", required: false, description: "Fires on blur." },
      { name: "maxLength", type: "number", default: "100", required: false, description: "Max characters." },
      { name: "disableMaxLength", type: "boolean", default: "false", required: false, description: "Disable max-length." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as text." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "readOnly", type: "boolean", default: "false", required: false, description: "Non-editable." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "placeholder", type: "string", default: '"(555) 123-4567"', required: false, description: "Placeholder." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [{ title: "Basic Phone", code: `<SapPhoneNumber label="Phone" value={phone} onChange={setPhone} required />` }],
    notes: ["Auto-formats to (XXX) XXX-XXXX as the user types.", "Uses inputMode='tel' for mobile numeric keyboards."],
  },

  /* ---- International Phone ------------------------------------- */
  "control-phone": {
    name: "SapControlPhone",
    badge: "utility",
    description: "International phone input with country flag emoji prefix, dial-code display, optional country dropdown selector, trimFirstZero option, text-mode toggle, and MUI theming.",
    importCode: `import { SapControlPhone } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: '""', required: false, description: "Phone number (without dial code)." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on change." },
      { name: "initCountry", type: "string", default: '"US"', required: false, description: "Initial country code (e.g. 'CA', 'IN', 'GB')." },
      { name: "allowDropdown", type: "boolean", default: "false", required: false, description: "Show country selector dropdown." },
      { name: "trimFirstZero", type: "boolean", default: "false", required: false, description: "Remove leading zero from input." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as text with flag." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "With Country Dropdown", code: `<SapControlPhone\n  label="Mobile"\n  value={mobile}\n  onChange={setMobile}\n  initCountry="IN"\n  allowDropdown\n  required\n/>` },
    ],
    notes: ["Ships with 12 built-in country codes (US, CA, GB, IN, AU, DE, FR, JP, CN, BR, MX, AE).", "The country selector uses flag emoji for zero-dependency display."],
  },

  /* ---- DateTime ------------------------------------------------ */
  "control-datetime": {
    name: "SapControlDatetime",
    badge: "utility",
    description: "Combined date + time picker using native datetime-local input. Supports min/max constraints, minute step granularity, text-mode toggle, and MUI theming.",
    importCode: `import { SapControlDatetime } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: '""', required: false, description: "Datetime value (YYYY-MM-DDTHH:MM)." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on change." },
      { name: "minDate", type: "string", default: '""', required: false, description: "Earliest allowed datetime." },
      { name: "maxDate", type: "string", default: '""', required: false, description: "Latest allowed datetime." },
      { name: "minuteStep", type: "number", default: "5", required: false, description: "Time step in minutes." },
      { name: "autoFormat", type: "string", default: '"MM/DD/YYYY"', required: false, description: "Date display format for text mode." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as text." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [{ title: "Basic DateTime", code: `<SapControlDatetime\n  label="Meeting Start"\n  value={meetingStart}\n  onChange={setMeetingStart}\n  minuteStep={15}\n  required\n/>` }],
    notes: ["minuteStep is applied as the HTML step attribute (step = minuteStep * 60 seconds).", "Text mode shows formatted date + time."],
  },

  /* ---- Time Picker --------------------------------------------- */
  "control-timepicker": {
    name: "SapControlTimePicker",
    badge: "utility",
    description: "Time-only picker rendered as a select dropdown of time slots. Supports minute-step granularity, min/max time constraints, disabling specific times, text-mode toggle, and MUI theming.",
    importCode: `import { SapControlTimePicker } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: '""', required: false, description: 'Selected time (HH:MM).' },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on change." },
      { name: "minuteStep", type: "number", default: "5", required: false, description: "Minutes between each slot." },
      { name: "minTime", type: "string", default: '""', required: false, description: "Earliest allowed time (HH:MM)." },
      { name: "maxTime", type: "string", default: '""', required: false, description: "Latest allowed time (HH:MM)." },
      { name: "disabledTimes", type: "string[]", default: "[]", required: false, description: 'Specific times to disable. E.g. ["08:00", "09:35"].' },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as text." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [{ title: "Business Hours Only", code: `<SapControlTimePicker\n  label="Appointment"\n  value={time}\n  onChange={setTime}\n  minuteStep={15}\n  minTime="09:00"\n  maxTime="17:00"\n  disabledTimes={["12:00", "12:15", "12:30", "12:45"]}\n/>` }],
    notes: ["Generates time slots by iterating 0–1440 minutes with the given step.", "Disabled times are shown in the dropdown but are non-selectable."],
  },

  /* ---- Autocomplete -------------------------------------------- */
  "control-autocomplete": {
    name: "SapControlAutocomplete",
    badge: "utility",
    description: "Searchable autocomplete input with debounced search, single or multi-select (chip display), custom async search function support, text-mode toggle, and MUI theming.",
    importCode: `import { SapControlAutocomplete } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "any", default: "null", required: false, description: "Selected value(s). Object or array for multiselect." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on selection change." },
      { name: "items", type: "object[]", default: "[]", required: false, description: "Static option items." },
      { name: "search", type: "(term) => Promise<items[]>", default: "null", required: false, description: "Custom async search function. Overrides static items filtering." },
      { name: "displayField", type: "string", default: '"label"', required: false, description: "Key for display text in items." },
      { name: "idField", type: "string", default: '"value"', required: false, description: "Key for unique id in items." },
      { name: "type", type: '"singleselect" | "multiselect"', default: '"singleselect"', required: false, description: "Selection mode." },
      { name: "searchDebounceTime", type: "number", default: "300", required: false, description: "Debounce delay in ms." },
      { name: "inputMinLength", type: "number", default: "1", required: false, description: "Minimum input chars before search triggers." },
      { name: "autoSelectFirstItem", type: "boolean", default: "true", required: false, description: "Auto-select first result." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as text." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "placeholder", type: "string", default: '"Type to search…"', required: false, description: "Placeholder." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Static Items", code: `<SapControlAutocomplete\n  label="City"\n  items={cities}\n  displayField="name"\n  idField="id"\n  value={selectedCity}\n  onChange={setSelectedCity}\n/>` },
      { title: "Async Search", code: `<SapControlAutocomplete\n  label="User"\n  search={async (term) => {\n    const res = await fetch(\`/api/users?q=\${term}\`);\n    return res.json();\n  }}\n  displayField="fullName"\n  idField="userId"\n  value={user}\n  onChange={setUser}\n  searchDebounceTime={500}\n/>` },
    ],
    notes: ["When a custom search function is provided, items filtering is bypassed.", "Multi-select renders selected values as removable Chip components.", "The dropdown positions absolutely below the input."],
  },

  /* ---- Tag Input ----------------------------------------------- */
  "control-tag": {
    name: "SapControlTag",
    badge: "utility",
    description: "Tag/chip input with a searchable dropdown of available tags, multi-select as chips, custom identifyBy/displayBy fields, text-mode toggle, and MUI theming.",
    importCode: `import { SapControlTag } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "any[]", default: "[]", required: false, description: "Array of selected tags." },
      { name: "onChange", type: "(tags) => void", default: "—", required: false, description: "Fires when tags change." },
      { name: "tags", type: "object[]", default: "[]", required: true, description: 'Available tags. E.g. [{ value: "t1", display: "Tag 1" }].' },
      { name: "identifyBy", type: "string", default: '"value"', required: false, description: "Key for tag id." },
      { name: "displayBy", type: "string", default: '"display"', required: false, description: "Key for tag label." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Read-only chip display." },
      { name: "required", type: "boolean", default: "false", required: false, description: "At least one tag required." },
      { name: "label", type: "string", default: "—", required: false, description: "Label text." },
      { name: "placeholder", type: "string", default: '"Add a tag…"', required: false, description: "Placeholder." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [{ title: "Basic Tags", code: `<SapControlTag\n  label="Skills"\n  tags={[\n    { value: "react", display: "React" },\n    { value: "node", display: "Node.js" },\n    { value: "python", display: "Python" },\n  ]}\n  value={skills}\n  onChange={setSkills}\n/>` }],
    notes: ["Already-selected tags are hidden from the dropdown.", "Search filters available tags as the user types.", "Text mode renders tags as outlined Chip components."],
  },

  /* ---- Rich Text Editor ---------------------------------------- */
  "control-editor": {
    name: "SapControlEditor",
    badge: "utility",
    description: "Rich-text editor using a contentEditable div with a formatting toolbar (bold, italic, underline, strikethrough, lists, alignment) and HTML source view toggle. Fully MUI themed.",
    importCode: `import { SapControlEditor } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: '""', required: false, description: "HTML content." },
      { name: "onChange", type: "(html) => void", default: "—", required: false, description: "Fires on content change." },
      { name: "onBlur", type: "(event) => void", default: "—", required: false, description: "Fires on blur." },
      { name: "onFocus", type: "(event) => void", default: "—", required: false, description: "Fires on focus." },
      { name: "onViewModeChange", type: "(isVisual) => void", default: "—", required: false, description: "Fires when toggling between visual and HTML mode." },
      { name: "config", type: "object", default: "See defaults", required: false, description: "Editor config: editable, spellcheck, height, minHeight, maxHeight, showToolbar, placeholder, fonts, toolbarPosition." },
      { name: "placeholder", type: "string", default: '"Enter text here..."', required: false, description: "Placeholder text." },
      { name: "tabIndex", type: "number", default: "null", required: false, description: "Tab index for the editor." },
      { name: "label", type: "string", default: "—", required: false, description: "Label above the editor." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [{ title: "Basic Editor", code: `<SapControlEditor\n  label="Description"\n  value={html}\n  onChange={setHtml}\n  config={{ minHeight: "200px" }}\n/>` }],
    notes: ["Uses document.execCommand for formatting — works in all modern browsers.", "HTML mode shows a raw textarea for direct HTML editing.", "Zero external dependencies — no separate editor library needed."],
  },

  /* ---- Colour Picker ------------------------------------------- */
  "control-colorpicker": {
    name: "SapControlColorPicker",
    badge: "utility",
    description: "Colour picker with a 20-colour preset swatch grid, native HTML colour input for custom colours, hex text input, and popover display.",
    importCode: `import { SapControlColorPicker } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: "—", required: false, description: "Selected hex colour." },
      { name: "onChange", type: "(hex) => void", default: "—", required: false, description: "Fires when colour changes." },
      { name: "onEvent", type: "(event) => void", default: "—", required: false, description: "Fires on open/close/slider events." },
      { name: "label", type: "string", default: "—", required: false, description: "Label text." },
      { name: "presetColors", type: "string[]", default: "20 built-in", required: false, description: "Custom preset colour array." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [{ title: "Basic Colour Picker", code: `<SapControlColorPicker\n  label="Brand Colour"\n  value={brandColor}\n  onChange={setBrandColor}\n/>` }],
    notes: ["Clicking the swatch opens a Popover with presets + custom input.", "The native colour input provides a full colour wheel on all platforms.", "Hex can also be typed directly into the text field."],
  },

  /* ---- Slider -------------------------------------------------- */
  "control-slider": {
    name: "SapControlSlider",
    badge: "utility",
    description: "Range slider using MUI Slider. Supports single value or range (two thumbs), configurable floor/ceil, step size, marks, text-mode toggle, and MUI theming.",
    importCode: `import { SapControlSlider } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "number | [number, number]", default: "options.floor", required: false, description: "Current value. Array of two for range mode." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on change." },
      { name: "options", type: "{ floor, ceil }", default: "{ floor: 0, ceil: 100 }", required: false, description: "Min/max range." },
      { name: "step", type: "number", default: "1", required: false, description: "Step increment." },
      { name: "marks", type: "boolean", default: "false", required: false, description: "Show step marks." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as text." },
      { name: "label", type: "string", default: "—", required: false, description: "Label text." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Single Slider", code: `<SapControlSlider\n  label="Volume"\n  value={volume}\n  onChange={setVolume}\n  options={{ floor: 0, ceil: 100 }}\n/>` },
      { title: "Range Slider", code: `<SapControlSlider\n  label="Price Range"\n  value={[minPrice, maxPrice]}\n  onChange={([min, max]) => { setMinPrice(min); setMaxPrice(max); }}\n  options={{ floor: 0, ceil: 10000 }}\n  step={100}\n/>` },
    ],
    notes: ["Pass a two-element array for range mode (two thumbs).", "Text mode displays the value or range as plain text."],
  },

  /* ---- Currency ------------------------------------------------ */
  "currency": {
    name: "SapCurrency",
    badge: "utility",
    description: "Currency input with configurable prefix symbol ($, €, ₹, etc.), decimal precision, thousands-separator formatting on blur, text-mode toggle, and MUI theming.",
    importCode: `import { SapCurrency } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "number | string", default: '""', required: false, description: "Current value." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires on change." },
      { name: "onBlur", type: "(value) => void", default: "—", required: false, description: "Fires on blur with parsed number." },
      { name: "onFocus", type: "() => void", default: "—", required: false, description: "Fires on focus." },
      { name: "prefix", type: "string", default: '"$"', required: false, description: "Currency symbol prefix." },
      { name: "precision", type: "number", default: "2", required: false, description: "Decimal places." },
      { name: "align", type: "string", default: '"right"', required: false, description: "Text alignment." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Display as formatted text." },
      { name: "required", type: "boolean", default: "false", required: false, description: "Required validation." },
      { name: "readOnly", type: "boolean", default: "false", required: false, description: "Non-editable." },
      { name: "label", type: "string", default: "—", required: false, description: "MUI label." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [{ title: "Basic Currency", code: `<SapCurrency\n  label="Amount"\n  value={amount}\n  onChange={setAmount}\n  prefix="₹"\n  precision={2}\n  required\n/>` }],
    notes: ["While focused, shows raw digits for easy editing. On blur, formats with thousands separators.", "Uses InputAdornment for the currency prefix.", "inputMode='decimal' provides mobile numeric keyboard."],
  },

  /* ---- Slide Toggle -------------------------------------------- */
  "control-slidetoggle": {
    name: "SapControlSlideToggle",
    badge: "utility",
    description: "On/off slide toggle using MUI Switch. Supports custom on/off bar colours, text-mode (disabled but visible), colour variants (primary, secondary, danger), and MUI theming.",
    importCode: `import { SapControlSlideToggle } from "@/packages/core/component/Form";`,
    props: [
      { name: "checked", type: "boolean", default: "false", required: false, description: "Toggle state." },
      { name: "onChange", type: "(checked) => void", default: "—", required: false, description: "Fires on toggle." },
      { name: "textMode", type: "boolean", default: "false", required: false, description: "Disabled but visible to show state." },
      { name: "label", type: "string", default: "—", required: false, description: "Label text." },
      { name: "color", type: "string", default: '"primary"', required: false, description: 'MUI colour: "primary", "secondary", "danger".' },
      { name: "onColor", type: "string", default: '""', required: false, description: "Custom bar colour when on (overrides colour)." },
      { name: "offColor", type: "string", default: '""', required: false, description: "Custom bar colour when off." },
      { name: "id", type: "string", default: '""', required: false, description: "HTML id." },
      { name: "name", type: "string", default: '""', required: false, description: "HTML name." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Basic Toggle", code: `<SapControlSlideToggle\n  label="Dark Mode"\n  checked={darkMode}\n  onChange={setDarkMode}\n/>` },
      { title: "Custom Colours", code: `<SapControlSlideToggle\n  label="Feature Flag"\n  checked={enabled}\n  onChange={setEnabled}\n  onColor="#22c55e"\n  offColor="#ef4444"\n/>` },
    ],
    notes: ["onColor/offColor override the MUI colour prop.", "textMode disables interaction but keeps the toggle visible."],
  },

  /* ---- Inline Editor ------------------------------------------- */
  "control-inlineeditor": {
    name: "SapControlInlineEditor",
    badge: "utility",
    description: "Inline text editor that toggles between a read-only label (click to edit) and an editable input with save (✓) and cancel (✕) buttons. Supports Enter to save and Escape to cancel.",
    importCode: `import { SapControlInlineEditor } from "@/packages/core/component/Form";`,
    props: [
      { name: "value", type: "string", default: '""', required: false, description: "Current value." },
      { name: "onChange", type: "(value) => void", default: "—", required: false, description: "Fires when save is clicked." },
      { name: "onSave", type: "(value) => void", default: "—", required: false, description: "Fires on save with the new value." },
      { name: "onCancel", type: "(value) => void", default: "—", required: false, description: "Fires on cancel with the original value." },
      { name: "maxLength", type: "number", default: "100", required: false, description: "Max character length." },
      { name: "disableMaxLength", type: "boolean", default: "false", required: false, description: "Disable max-length." },
      { name: "placeholder", type: "string", default: '""', required: false, description: "Placeholder when value is empty." },
      { name: "label", type: "string", default: "—", required: false, description: "Label prefix in read mode." },
      { name: "readOnly", type: "boolean", default: "false", required: false, description: "Disable editing entirely." },
      { name: "sx", type: "object", default: "{}", required: false, description: "MUI sx styles." },
    ],
    examples: [
      { title: "Editable Title", code: `<SapControlInlineEditor\n  value={title}\n  onChange={setTitle}\n  onSave={(v) => saveToServer(v)}\n  placeholder="Untitled"\n/>` },
      { title: "With Label", code: `<SapControlInlineEditor\n  label="Project"\n  value={projectName}\n  onChange={setProjectName}\n/>` },
    ],
    notes: [
      "Click the text to enter edit mode. A pencil icon (✎) hints at editability.",
      "Press Enter to save, Escape to cancel — no mouse needed.",
      "Read-only mode hides the pencil icon and disables click-to-edit.",
    ],
  },
};
