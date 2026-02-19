# SapZap Dashboard Components

A modular set of React components for building rich, interactive admin dashboards. Built on Material-UI and designed to work seamlessly with the SudhaarLo admin application.

## Quick Start

Import any component from the barrel export:

```jsx
import {
  SapDashboardCarousel,
  SapBarGraphTile,
  SapDonutGraphTile,
  SapPieGraphTile,
  SapListTile,
  SapNumericTile,
  SapMultiTile,
  SapFilterChips,
  SapTileWrapper,
} from "@/packages/core/component/Dashboard";
```

## Data Model — `SapTileItem`

All graph and list tiles accept an array of **SapTileItem** objects:

```js
{
  label: "Plumbing",   // Display label
  value: 42,           // Numeric value
  color: "#CA1551",    // Optional — custom colour (hex)
  selected: true,      // Optional — selection state (default: undefined = active)
}
```

> When `selected` is explicitly `false`, the item appears dimmed.  
> When `selected` is `true` or `undefined`, the item appears at full opacity.

## Component Overview

| Component | Purpose |
|---|---|
| [`SapDashboardCarousel`](./SapDashboardCarousel.md) | Responsive paginated carousel container |
| [`SapBarGraphTile`](./SapDashboardTiles.md#sapbargraphtile) | Vertical bar chart tile |
| [`SapDonutGraphTile`](./SapDashboardTiles.md#sapdonutgraphtile) | Donut (ring) chart tile |
| [`SapPieGraphTile`](./SapDashboardTiles.md#sappiegraphtile) | Pie chart tile |
| [`SapListTile`](./SapDashboardTiles.md#saplisttile) | Coloured list tile |
| [`SapNumericTile`](./SapDashboardTiles.md#sapnumerictile) | Big-number display tile |
| [`SapMultiTile`](./SapDashboardTiles.md#sapmultitile) | Tabbed multi-tile container |
| [`SapFilterChips`](./SapFilterChips.md) | Removable filter chip bar |
| `SapTileWrapper` | Low-level card wrapper (used internally) |

## Full Example

```jsx
import React, { useState, useCallback } from "react";
import {
  SapDashboardCarousel,
  SapBarGraphTile,
  SapDonutGraphTile,
  SapPieGraphTile,
  SapListTile,
  SapNumericTile,
  SapFilterChips,
} from "@/packages/core/component/Dashboard";
import DynamicTable from "@/packages/core/component/Table/DynamicTable";

const Dashboard = () => {
  const [items, setItems] = useState([
    { label: "Plumbing", value: 120 },
    { label: "Electrical", value: 85 },
    { label: "Cleaning", value: 200 },
    { label: "Painting", value: 65 },
    { label: "Carpentry", value: 42 },
  ]);

  const handleLabelSelected = useCallback((toggledItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.label === toggledItem.label
          ? { ...item, selected: toggledItem.selected }
          : item
      )
    );
  }, []);

  const handleUnselectAll = useCallback(() => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: undefined })));
  }, []);

  const handleUnselectOne = useCallback((item) => {
    setItems((prev) =>
      prev.map((i) =>
        i.label === item.label ? { ...i, selected: undefined } : i
      )
    );
  }, []);

  return (
    <div>
      {/* Carousel with tiles */}
      <SapDashboardCarousel>
        <SapBarGraphTile
          title="Bookings by Service"
          description="Monthly breakdown"
          items={items}
          onLabelSelectedChanged={handleLabelSelected}
        />
        <SapDonutGraphTile
          title="Service Distribution"
          items={items}
          onLabelSelectedChanged={handleLabelSelected}
        />
        <SapPieGraphTile
          title="Market Share"
          items={items}
          onLabelSelectedChanged={handleLabelSelected}
        />
        <SapListTile
          title="Top Services"
          items={items}
          onLabelSelectedChanged={handleLabelSelected}
        />
        <SapNumericTile
          title="Overview"
          itemOne={{ label: "Total Bookings", value: 512, unit: "" }}
          itemTwo={{ label: "Revenue", value: 24500, unit: "₹" }}
          fromLabel={{ label: "Start", value: "Jan 1" }}
          toLabel={{ label: "End", value: "Dec 31" }}
        />
      </SapDashboardCarousel>

      {/* Filter chips above a table */}
      <SapFilterChips
        filterChipData={items}
        onUnselectLabel={handleUnselectOne}
        onUnselectAllLabels={handleUnselectAll}
      />

      <DynamicTable header={["Service", "Bookings"]} tableData={{ item: [] }} />
    </div>
  );
};

export default Dashboard;
```

## File Structure

```
admin/src/packages/core/component/Dashboard/
├── chartUtils.js            # Shared colour palette & SVG path helpers
├── index.js                 # Barrel export
├── SapBarGraphTile.jsx      # Bar chart tile
├── SapDashboardCarousel.jsx # Responsive carousel
├── SapDonutGraphTile.jsx    # Donut chart tile
├── SapFilterChips.jsx       # Filter chip bar
├── SapListTile.jsx          # List tile
├── SapMultiTile.jsx         # Multi-tile with tabs
├── SapNumericTile.jsx       # Numeric display tile
├── SapPieGraphTile.jsx      # Pie chart tile
└── SapTileWrapper.jsx       # Shared card wrapper
```

## Detailed Docs

- [SapDashboardCarousel](./SapDashboardCarousel.md) — carousel setup, responsive breakpoints
- [SapDashboardTiles](./SapDashboardTiles.md) — every tile type with props, examples & tips
- [SapFilterChips](./SapFilterChips.md) — wiring filter chips with tables
