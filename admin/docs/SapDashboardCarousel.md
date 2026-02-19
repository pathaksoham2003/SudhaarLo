# SapDashboardCarousel

A responsive paginated carousel that displays dashboard tiles in a horizontal grid. Automatically adapts to screen size and shows navigation controls when tiles overflow the visible area.

## Import

```jsx
import { SapDashboardCarousel } from "@/packages/core/component/Dashboard";
```

## Responsive Breakpoints

| Screen Size | Tiles per Page |
|---|---|
| **Desktop** (≥ 960px) | 5 |
| **Tablet** (600–959px) | 2 |
| **Mobile** (< 600px) | 1 |

When the total number of tiles exceeds the visible count, left/right arrows and dot-page indicators appear.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Tile components to display inside the carousel |
| `sx` | `object` | `{}` | Additional MUI `sx` styles applied to the root container |

## Basic Usage

```jsx
<SapDashboardCarousel>
  <SapBarGraphTile
    title="Revenue"
    items={revenueItems}
    onLabelSelectedChanged={handleSelect}
  />
  <SapDonutGraphTile
    title="Distribution"
    items={distItems}
    onLabelSelectedChanged={handleSelect}
  />
  <SapListTile
    title="Top Items"
    items={topItems}
    onLabelSelectedChanged={handleSelect}
  />
</SapDashboardCarousel>
```

## Controlling Layout

Each child is placed in its own grid cell. You can pass `sx` to the carousel to adjust spacing:

```jsx
<SapDashboardCarousel sx={{ my: 3, px: 2 }}>
  {/* tiles */}
</SapDashboardCarousel>
```

## Notes

- Tile components do **not** need to be wrapped in additional containers; each child is automatically placed in the grid.
- The carousel handles pagination internally — no external state management is needed.
- Navigation arrows use HTML entities (◀ ▶) and do not require `@mui/icons-material`.
- Dot indicators are keyboard-accessible (focusable, Enter key support).
