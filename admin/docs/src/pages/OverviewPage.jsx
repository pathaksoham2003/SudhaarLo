import React from "react";
import CodeBlock from "../components/CodeBlock";
import { NoteBox } from "../components/PropsTable";

const CARDS = [
  { id: "carousel",     icon: "🎠", title: "Dashboard Carousel",  desc: "Responsive paginated tile container" },
  { id: "calendar",     icon: "📅", title: "Calendar",             desc: "Theme-aware FullCalendar integration" },
  { id: "bar-graph",    icon: "📊", title: "Bar Graph Tile",      desc: "Vertical bar chart with legend list" },
  { id: "donut-graph",  icon: "🍩", title: "Donut Graph Tile",    desc: "Ring chart with centre total" },
  { id: "pie-graph",    icon: "🥧", title: "Pie Graph Tile",      desc: "Traditional pie chart with percentages" },
  { id: "list-tile",    icon: "📋", title: "List Tile",           desc: "Scrollable or paged label–value list" },
  { id: "numeric-tile", icon: "🔢", title: "Numeric Tile",        desc: "Big-number display with range strip" },
  { id: "text-tile",    icon: "🔤", title: "Text Tile",           desc: "Single text value with optional unit" },
  { id: "multi-tile",   icon: "🗂️", title: "Multi Tile",          desc: "Tabbed multi-tile container" },
  { id: "custom-tile",  icon: "🧩", title: "Custom Tile",         desc: "Open-ended tile for custom content" },
  { id: "editable-table", icon: "📝", title: "Editable Table",   desc: "Full CRUD data table with edit mode" },
  { id: "filter-chips", icon: "🏷️", title: "Filter Chips",        desc: "Removable filter tag bar" },
  { id: "tile-wrapper", icon: "📦", title: "Tile Wrapper",        desc: "Shared card wrapper base" },
];

const OverviewPage = ({ onNavigate }) => {
  return (
    <>
      {/* Hero */}
      <h1 className="page-title">SapZap Dashboard Components</h1>
      <p className="page-subtitle">
        A modular React component library for building rich, interactive admin
        dashboards. Built on Material-UI with responsive design, selection
        interactions, and zero extra charting dependencies.
      </p>

      {/* Quick start */}
      <div className="section">
        <h2 className="section-title">Quick Start</h2>
        <p className="doc-text">
          Import any component from the barrel export inside your admin pages:
        </p>
        <CodeBlock
          label="Import"
          code={`import {
  SapDashboardCarousel,
  SapBarGraphTile,
  SapDonutGraphTile,
  SapPieGraphTile,
  SapListTile,
  SapNumericTile,
  SapTextTile,
  SapCustomTile,
  SapMultiTile,
  SapFilterChips,
  SapTileWrapper,
} from "@/packages/core/component/Dashboard";`}
        />
      </div>

      {/* Data model */}
      <div className="section">
        <h2 className="section-title">Data Model — SapTileItem</h2>
        <p className="doc-text">
          All graph and list tiles accept an array of <code>SapTileItem</code>{" "}
          objects. This is the common shape used across every tile:
        </p>
        <CodeBlock
          label="SapTileItem shape"
          code={`{
  label: "Plumbing",      // Display label  (required)
  value: 42,              // Numeric value  (required)
  color: "#CA1551",       // Custom colour  (optional — hex string)
  selected: true,         // Selection flag  (optional — undefined = active)
}`}
        />

        <NoteBox variant="info">
          When <code>selected</code> is explicitly <code>false</code> the item
          renders dimmed. When <code>true</code> or <code>undefined</code> it
          renders at full opacity. This lets you drive filtering UX simply by
          toggling the flag.
        </NoteBox>
      </div>

      {/* Selection behaviour */}
      <div className="section">
        <h2 className="section-title">Selection Behaviour</h2>
        <p className="doc-text">
          Every graph and list tile fires an{" "}
          <code>onLabelSelectedChanged</code> callback when the user clicks a
          bar, slice, or row. The callback receives the item with its{" "}
          <code>selected</code> property toggled:
        </p>
        <CodeBlock
          label="Handling selection"
          code={`const handleLabelSelected = (toggledItem) => {
  setItems((prev) =>
    prev.map((item) =>
      item.label === toggledItem.label
        ? { ...item, selected: toggledItem.selected }
        : item
    )
  );
};`}
        />
        <p className="doc-text">
          Pair this with <code>SapFilterChips</code> to show active filters
          above a table, letting users remove individual filters or clear all.
        </p>
      </div>

      {/* Colour palette */}
      <div className="section">
        <h2 className="section-title">Default Colour Palette</h2>
        <p className="doc-text">
          Items without a custom <code>color</code> are automatically assigned
          from a 10-colour palette. Override any item by setting its{" "}
          <code>color</code> field to a hex string.
        </p>
        <CodeBlock
          label="chartUtils.js"
          code={`const DEFAULT_COLORS = [
  "#21b584",   // green
  "#ffc527",   // amber
  "#0072ce",   // blue
  "#00bdff",   // cyan
  "#ff5b27",   // orange
  "#005290",   // navy
  "#707070",   // grey
  "#303030",   // charcoal
  "#de3500",   // red
];`}
        />
      </div>

      {/* Component grid */}
      <div className="section">
        <h2 className="section-title">All Components</h2>
        <p className="doc-text">
          Click any card below to jump to its full documentation:
        </p>
        <div className="card-grid">
          {CARDS.map((card) => (
            <div
              key={card.id}
              className="doc-card"
              onClick={() => onNavigate(card.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onNavigate(card.id)}
            >
              <div className="doc-card-icon">{card.icon}</div>
              <div className="doc-card-title">{card.title}</div>
              <div className="doc-card-desc">{card.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* File structure */}
      <div className="section">
        <h2 className="section-title">File Structure</h2>
        <CodeBlock
          label="Directory"
          code={`admin/src/packages/core/component/Dashboard/
├── chartUtils.js            # Colour palette & SVG helpers
├── useSapTileData.js        # Shared hook (sort, limit, "Other")
├── index.js                 # Barrel export
├── SapTileWrapper.jsx       # Shared card wrapper
├── SapTileItemList.jsx      # Shared legend sub-component
├── SapDashboardCarousel.jsx # Responsive carousel
├── SapBarGraphTile.jsx      # Bar chart tile
├── SapDonutGraphTile.jsx    # Donut chart tile
├── SapPieGraphTile.jsx      # Pie chart tile
├── SapListTile.jsx          # List tile (scroll / paged)
├── SapNumericTile.jsx       # Numeric display tile
├── SapTextTile.jsx          # Text value tile
├── SapCustomTile.jsx        # Custom content tile
├── SapMultiTile.jsx         # Tabbed multi-tile
└── SapFilterChips.jsx       # Filter chip bar`}
        />
      </div>

      {/* Full example */}
      <div className="section">
        <h2 className="section-title">Full Dashboard Example</h2>
        <p className="doc-text">
          Here is a complete page wiring up a carousel, several tiles, filter
          chips, and a data table:
        </p>
        <CodeBlock
          label="Dashboard.jsx"
          code={`import React, { useState, useCallback } from "react";
import {
  SapDashboardCarousel,
  SapBarGraphTile,
  SapDonutGraphTile,
  SapListTile,
  SapNumericTile,
  SapFilterChips,
} from "@/packages/core/component/Dashboard";
import DynamicTable from "@/packages/core/component/Table/DynamicTable";

const Dashboard = () => {
  const [items, setItems] = useState([
    { label: "Plumbing",   value: 120 },
    { label: "Electrical", value: 85 },
    { label: "Cleaning",   value: 200 },
    { label: "Painting",   value: 65 },
    { label: "Carpentry",  value: 42 },
  ]);

  const handleSelect = useCallback((toggled) => {
    setItems((prev) =>
      prev.map((i) =>
        i.label === toggled.label ? { ...i, selected: toggled.selected } : i
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    setItems((prev) => prev.map((i) => ({ ...i, selected: undefined })));
  }, []);

  const clearOne = useCallback((item) => {
    setItems((prev) =>
      prev.map((i) =>
        i.label === item.label ? { ...i, selected: undefined } : i
      )
    );
  }, []);

  return (
    <div>
      <SapDashboardCarousel>
        <SapBarGraphTile
          title="Bookings"
          items={items}
          onLabelSelectedChanged={handleSelect}
        />
        <SapDonutGraphTile
          title="Distribution"
          items={items}
          onLabelSelectedChanged={handleSelect}
        />
        <SapListTile
          title="Top Services"
          items={items}
          onLabelSelectedChanged={handleSelect}
        />
        <SapNumericTile
          title="Totals"
          itemOne={{ label: "Bookings", value: 512 }}
          itemTwo={{ label: "Revenue", value: 24500, unit: "₹" }}
        />
      </SapDashboardCarousel>

      <SapFilterChips
        filterChipData={items}
        onUnselectLabel={clearOne}
        onUnselectAllLabels={clearAll}
      />

      <DynamicTable
        header={["Service", "Bookings"]}
        tableData={{ item: [] }}
      />
    </div>
  );
};

export default Dashboard;`}
        />
      </div>
    </>
  );
};

export default OverviewPage;
