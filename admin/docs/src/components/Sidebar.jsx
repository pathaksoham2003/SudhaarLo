import React from "react";

const NAV = [
  {
    group: "Getting Started",
    items: [{ id: "overview", label: "Overview" }],
  },
  {
    group: "Layout",
    items: [
      { id: "carousel", label: "Dashboard Carousel" },
      { id: "calendar", label: "Calendar" },
    ],
  },
  {
    group: "Chart Tiles",
    items: [
      { id: "bar-graph", label: "Bar Graph Tile" },
      { id: "donut-graph", label: "Donut Graph Tile" },
      { id: "pie-graph", label: "Pie Graph Tile" },
    ],
  },
  {
    group: "Data Tiles",
    items: [
      { id: "list-tile", label: "List Tile" },
      { id: "numeric-tile", label: "Numeric Tile" },
      { id: "text-tile", label: "Text Tile" },
      { id: "multi-tile", label: "Multi Tile" },
    ],
  },
  {
    group: "Form Controls",
    items: [
      { id: "control-input", label: "Input" },
      { id: "control-email", label: "Email" },
      { id: "control-textarea", label: "Textarea" },
      { id: "control-number", label: "Number" },
      { id: "control-checkbox", label: "Checkbox" },
      { id: "control-radio", label: "Radio" },
      { id: "control-date", label: "Date Picker" },
      { id: "control-date-range", label: "Date Range" },
      { id: "control-date-range-single", label: "Date Range (Single)" },
      { id: "control-post-month", label: "Month Picker" },
      { id: "control-year", label: "Year Picker" },
      { id: "control-dropdown", label: "Dropdown" },
      { id: "control-select", label: "Select" },
      { id: "phone-number", label: "Phone Number" },
      { id: "control-phone", label: "Phone (Intl)" },
      { id: "control-datetime", label: "Date & Time" },
      { id: "control-timepicker", label: "Time Picker" },
      { id: "control-autocomplete", label: "Autocomplete" },
      { id: "control-tag", label: "Tag Input" },
      { id: "control-editor", label: "Rich Text Editor" },
      { id: "control-colorpicker", label: "Colour Picker" },
      { id: "control-slider", label: "Slider" },
      { id: "currency", label: "Currency" },
      { id: "control-slidetoggle", label: "Slide Toggle" },
      { id: "control-inlineeditor", label: "Inline Editor" },
    ],
  },
  {
    group: "Tables",
    items: [
      { id: "data-table", label: "Data Table" },
      { id: "editable-table", label: "Editable Table" },
    ],
  },
  {
    group: "Utilities",
    items: [
      { id: "custom-tile", label: "Custom Tile" },
      { id: "filter-chips", label: "Filter Chips" },
      { id: "tile-wrapper", label: "Tile Wrapper" },
    ],
  },
];

const Sidebar = ({ activePage, onNavigate, isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo" onClick={() => onNavigate("overview")}>
          <div className="sidebar-brand-icon">S</div>
          <div>
            <div className="sidebar-brand-name">SapZap</div>
            <div className="sidebar-brand-tag">Dashboard Docs</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV.map((group) => (
          <div key={group.group} className="sidebar-group">
            <div className="sidebar-group-title">{group.group}</div>
            {group.items.map((item) => (
              <div
                key={item.id}
                className={`sidebar-link ${activePage === item.id ? "active" : ""}`}
                onClick={() => onNavigate(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onNavigate(item.id)}
              >
                {item.label}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
