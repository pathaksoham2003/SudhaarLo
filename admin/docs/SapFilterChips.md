# SapFilterChips

Displays selected `SapTileItem` entries as removable Material-UI chips. Designed to sit in a table or list header so users can see which tile labels are actively filtering the data and can dismiss them individually or all at once.

## Import

```jsx
import { SapFilterChips } from "@/packages/core/component/Dashboard";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `filterChipData` | `SapTileItem[]` | `[]` | Full items array — only items with `selected: true` are rendered as chips |
| `onUnselectLabel` | `(item) => void` | — | Called when a single chip's delete icon is clicked |
| `onUnselectAllLabels` | `() => void` | — | Called when the "Clear all" link is clicked |
| `sx` | `object` | `{}` | Additional MUI sx styles |

## Basic Usage

```jsx
<SapFilterChips
  filterChipData={items}
  onUnselectLabel={handleRemoveOne}
  onUnselectAllLabels={handleClearAll}
/>
```

## Wiring with a Table

The filter chips component is typically placed above a `DynamicTable` (or any data table). You need to implement three handler functions at the page level:

```jsx
import React, { useState, useCallback, useMemo } from "react";
import { SapBarGraphTile, SapFilterChips } from "@/packages/core/component/Dashboard";
import DynamicTable from "@/packages/core/component/Table/DynamicTable";

const BookingsPage = () => {
  const allBookings = [ /* ... full dataset ... */ ];

  const [items, setItems] = useState([
    { label: "Plumbing", value: 120 },
    { label: "Electrical", value: 85 },
    { label: "Cleaning", value: 200 },
  ]);

  // 1. Toggle selection when a tile label is clicked
  const handleLabelSelected = useCallback((toggledItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.label === toggledItem.label
          ? { ...item, selected: toggledItem.selected }
          : item
      )
    );
  }, []);

  // 2. Remove a single filter chip
  const handleUnselectOne = useCallback((item) => {
    setItems((prev) =>
      prev.map((i) =>
        i.label === item.label ? { ...i, selected: undefined } : i
      )
    );
  }, []);

  // 3. Clear all filter chips
  const handleUnselectAll = useCallback(() => {
    setItems((prev) => prev.map((i) => ({ ...i, selected: undefined })));
  }, []);

  // Derive filtered table data
  const selectedLabels = items.filter((i) => i.selected).map((i) => i.label);
  const filteredBookings = useMemo(() => {
    if (!selectedLabels.length) return allBookings;
    return allBookings.filter((b) => selectedLabels.includes(b.category));
  }, [selectedLabels, allBookings]);

  return (
    <div>
      {/* Tile */}
      <SapBarGraphTile
        title="Bookings by Category"
        items={items}
        onLabelSelectedChanged={handleLabelSelected}
      />

      {/* Chips + Table */}
      <SapFilterChips
        filterChipData={items}
        onUnselectLabel={handleUnselectOne}
        onUnselectAllLabels={handleUnselectAll}
      />

      <DynamicTable
        header={["Service", "Provider", "Date"]}
        tableData={{ item: filteredBookings }}
      />
    </div>
  );
};

export default BookingsPage;
```

## Interaction Flow

```
User clicks bar in SapBarGraphTile
  → onLabelSelectedChanged fires with { ...item, selected: true }
  → Page updates items state
  → SapFilterChips renders the newly selected item as a chip
  → Table data is filtered to matching rows

User clicks chip delete icon
  → onUnselectLabel fires with the chip's item
  → Page sets that item's selected back to undefined
  → Chip disappears, table data re-expands

User clicks "Clear all"
  → onUnselectAllLabels fires
  → Page resets all items to selected: undefined
  → All chips disappear, table shows full data
```

## Notes

- The "Clear all" link only appears when **2 or more** chips are visible.
- Chips inherit their border colour from the item's colour (custom or from the default palette).
- The component renders `null` when no items are selected, so it is safe to always include in your layout.
