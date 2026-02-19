# SapZap Dashboard Tiles

Complete reference for every tile component. All tiles share a consistent card appearance provided by `SapTileWrapper` and accept the standard `sx` / `className` props.

---

## Data Model — `SapTileItem`

```js
{
  label: string,       // Display label (required)
  value: number,       // Numeric value (required)
  color?: string,      // Custom hex colour (optional)
  selected?: boolean,  // Selection state (optional — undefined = active)
}
```

---

## SapBarGraphTile

Vertical bar chart. Bar height is proportional to the maximum value in the dataset.

### Import

```jsx
import { SapBarGraphTile } from "@/packages/core/component/Dashboard";
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Chart heading |
| `description` | `string` | — | Short description below the title |
| `items` | `SapTileItem[]` | `[]` | Data to visualise |
| `onLabelSelectedChanged` | `(item) => void` | — | Fired when a bar is clicked; receives item with toggled `selected` |
| `className` | `string` | `"carousel-tile"` | CSS class |
| `sx` | `object` | `{}` | Additional MUI sx styles |

### Example

```jsx
<SapBarGraphTile
  title="Bookings by Category"
  description="This quarter"
  items={[
    { label: "Plumbing", value: 120 },
    { label: "Electrical", value: 85 },
    { label: "Cleaning", value: 200 },
  ]}
  onLabelSelectedChanged={(item) => console.log(item)}
/>
```

---

## SapDonutGraphTile

Ring (donut) chart with a centre total. Ideal for showing proportional distribution with a clear total count.

### Import

```jsx
import { SapDonutGraphTile } from "@/packages/core/component/Dashboard";
```

### Props

Same as [SapBarGraphTile](#props) above.

### Example

```jsx
<SapDonutGraphTile
  title="Service Distribution"
  items={serviceItems}
  onLabelSelectedChanged={handleSelect}
/>
```

### Notes

- The centre of the donut displays the **sum** of all item values.
- For a single-item dataset, a full ring is rendered with a filled circle + inner cutout.

---

## SapPieGraphTile

Traditional pie chart. Each wedge's angle is proportional to its share of the total. The legend shows percentage values.

### Import

```jsx
import { SapPieGraphTile } from "@/packages/core/component/Dashboard";
```

### Props

Same as [SapBarGraphTile](#props) above.

### Example

```jsx
<SapPieGraphTile
  title="Market Share"
  items={marketItems}
  onLabelSelectedChanged={handleSelect}
/>
```

---

## SapListTile

Coloured label–value list. Each row has a colour dot, a label, and the numeric value on the right.

### Import

```jsx
import { SapListTile } from "@/packages/core/component/Dashboard";
```

### Props

Same as [SapBarGraphTile](#props) above.

### Example

```jsx
<SapListTile
  title="Top Services"
  description="Ranked by bookings"
  items={topServices}
  onLabelSelectedChanged={handleSelect}
/>
```

### Notes

- Selected items get a subtle background highlight (`action.selected`).
- Long labels are truncated with ellipsis.

---

## SapNumericTile

Displays one or two big-number KPIs with an optional from/to date range strip underneath.

### Import

```jsx
import { SapNumericTile } from "@/packages/core/component/Dashboard";
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Tile heading |
| `description` | `string` | — | Short description |
| `itemOne` | `{ label, value, unit? }` | — | Left / primary numeric display |
| `itemTwo` | `{ label, value, unit? }` | — | Right / secondary numeric display |
| `fromLabel` | `{ label, value, unit? }` | — | "From" marker in the range strip |
| `toLabel` | `{ label, value, unit? }` | — | "To" marker in the range strip |
| `className` | `string` | `"carousel-tile"` | CSS class |
| `sx` | `object` | `{}` | Additional MUI sx styles |

### Example

```jsx
<SapNumericTile
  title="Revenue Overview"
  itemOne={{ label: "Total Revenue", value: 245000, unit: "₹" }}
  itemTwo={{ label: "Orders", value: 1284 }}
  fromLabel={{ label: "From", value: "Jan 2026" }}
  toLabel={{ label: "To", value: "Dec 2026" }}
/>
```

---

## SapMultiTile

A container tile that wraps multiple tiles behind a **tabbed interface**. Only the active tab's tile is visible at any time.

### Import

```jsx
import { SapMultiTile } from "@/packages/core/component/Dashboard";
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tileTitles` | `string[]` | `[]` | Ordered array of tab labels |
| `children` | `ReactNode` | — | One tile component per tab |
| `className` | `string` | `"carousel-tile"` | CSS class |
| `sx` | `object` | `{}` | Additional MUI sx styles |

### Example

```jsx
<SapMultiTile tileTitles={["By Category", "Top Providers"]}>
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
</SapMultiTile>
```

### Notes

- Each child is displayed as its own tab panel. The first child corresponds to `tileTitles[0]`, and so on.
- Give each embedded tile its full set of props just as if it were a standalone tile.
- Tabs scroll horizontally when there are too many to fit.

---

## Shared Behaviour

### Selection

All graph / list tiles support an `onLabelSelectedChanged` callback:

1. When the user clicks a bar, slice, or list row, the callback fires with the item's `selected` property toggled.
2. You manage selection state in your page component and pass the updated `items` array back down.
3. Items with `selected: false` appear dimmed; all others appear at full opacity.

### Colours

If an item has no `color` property, a colour is automatically assigned from the built-in 10-colour palette. You can override any item's colour by setting the `color` field to a hex string.

### Empty State

All tiles gracefully render a "No data available" message when `items` is an empty array.
