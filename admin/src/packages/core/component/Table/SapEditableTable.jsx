import React, { useEffect, useState, useCallback, Fragment } from "react";
import {
  Box, Paper, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Checkbox, TextField,
  Select, MenuItem, Button, IconButton, InputAdornment,
  Menu, Chip, Collapse, Divider, useTheme, useMediaQuery,
} from "@mui/material";
import useEditableTable from "./useEditableTable";

/* ================================================================
   SapEditableTable
   ================================================================
   A fully-featured editable data table built on MUI.
   Supports edit/text mode toggle, row selection with checkboxes,
   add/delete/save/cancel, search, tree drill-down, bulk actions,
   column visibility settings, mobile card layout, sticky footer,
   zebra-striping, entity count, and custom render props.
   ================================================================ */

const SapEditableTable = ({
  // Data
  data = [],
  updatedata,
  columns = [],
  newItemValue = {},
  tableId = "",
  // Feature flags
  isSearchBox = false,
  isDeleteSelectButton = true,
  isAddNew = true,
  addNewText = "Add New",
  allowsEditing = true,
  stickyFooter = false,
  mobileCardState = false,
  isEnableTextMode = true,
  enableCheckBoxColumn = true,
  isShowTableHeader = true,
  enableTableSettings = true,
  enableFixedHeader = false,
  isEnableShadeAltRows = false,
  enableTreeStructure = false,
  textMode: controlledTextMode,
  customColumnKeys = [],
  // Table count
  addTableCount = false,
  countEntityTypeSingular = "Item",
  countEntityTypePlural = "Items",
  // Bulk actions
  bulkActionsList = [],
  showSaveButton = false,
  showEditDeleteCounts = true,
  // Templates (React elements / render props)
  headerTemplate,
  bulkActionDesktop,
  bulkActionMobile,
  customButton,
  // Callbacks
  onChangeMode,
  onSave,
  onDelete,
  onCancel,
  onAdd,
  returnSelectedRows,
  returnDeletedRows,
  onCancelClick,
  onTreeRowExpanded,
  onTreeRowCollapsed,
  // Style
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const showCards = mobileCardState && isMobile;

  const {
    filteredData, isTextMode, selectedRowIds, searchTerm,
    expandedRowIds, visibleColumns, hiddenColumns,
    isAllSelected, isSomeSelected,
    setSearchTerm, enterEditMode, cancelEdit, saveEdit,
    toggleSelectRow, toggleSelectAll, updateCell,
    addRow, deleteSelectedRows, toggleTreeRow, toggleColumn,
  } = useEditableTable({
    data, updatedata, columns, newItemValue,
    customColumnKeys, isEnableTextMode, textMode: controlledTextMode,
  });

  // Settings menu anchor
  const [settingsEl, setSettingsEl] = useState(null);

  // Determine if new bulk actions are in use
  const useBulkActions = bulkActionsList.length > 0 || showSaveButton;

  /* ---- Fire callbacks ---- */
  useEffect(() => {
    returnSelectedRows && returnSelectedRows(selectedRowIds);
  }, [selectedRowIds]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onChangeMode && onChangeMode(isTextMode);
  }, [isTextMode]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- Handlers ---- */
  const handleEdit = () => enterEditMode();
  const handleSave = () => { const d = saveEdit(); onSave && onSave(d); };
  const handleDelete = () => {
    const { remaining, deleted } = deleteSelectedRows();
    onDelete && onDelete(remaining);
    returnDeletedRows && returnDeletedRows(deleted);
  };
  const handleCancel = () => { cancelEdit(); onCancel && onCancel(); };
  const handleAdd = () => { const r = addRow(); onAdd && onAdd(r); };
  const handleBulkCancel = () => { cancelEdit(); onCancelClick && onCancelClick(); };

  const handleTreeToggle = useCallback(
    (row) => {
      const id = row._sapId;
      const wasExpanded = expandedRowIds.has(id);
      toggleTreeRow(id);
      if (wasExpanded) {
        onTreeRowCollapsed && onTreeRowCollapsed(row);
      } else {
        onTreeRowExpanded && onTreeRowExpanded(row);
      }
    },
    [expandedRowIds, toggleTreeRow, onTreeRowExpanded, onTreeRowCollapsed]
  );

  /* ---- Cell renderer ---- */
  const renderCell = (row, col) => {
    const value = row[col.field];

    if (isTextMode || col.editable === false) {
      if (col.render) return col.render(value, row);
      if (typeof value === "boolean") return value ? "Yes" : "No";
      if (value instanceof Date) return value.toLocaleDateString();
      return value ?? "—";
    }

    const common = { size: "small", fullWidth: true, variant: "outlined" };

    switch (col.type) {
      case "select":
        return (
          <Select {...common} value={value ?? ""} onChange={(e) => updateCell(row._sapId, col.field, e.target.value)}>
            {(col.options || []).map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </Select>
        );
      case "boolean":
        return <Checkbox checked={!!value} onChange={(e) => updateCell(row._sapId, col.field, e.target.checked)} />;
      case "number":
        return <TextField {...common} type="number" value={value ?? ""} onChange={(e) => updateCell(row._sapId, col.field, Number(e.target.value))} />;
      case "date":
        return <TextField {...common} type="date" value={value ?? ""} onChange={(e) => updateCell(row._sapId, col.field, e.target.value)} InputLabelProps={{ shrink: true }} />;
      default:
        return <TextField {...common} value={value ?? ""} onChange={(e) => updateCell(row._sapId, col.field, e.target.value)} />;
    }
  };

  /* ---- Tree row renderer ---- */
  const renderRows = (rows, depth = 0) =>
    rows.map((row) => {
      const id = row._sapId;
      const isSelected = selectedRowIds.includes(id);
      const hasChildren = enableTreeStructure && row.Children && row.Children.length > 0;
      const isExpanded = expandedRowIds.has(id);

      return (
        <Fragment key={id}>
          <TableRow
            hover
            selected={isSelected}
            sx={{
              ...(isEnableShadeAltRows && { "&:nth-of-type(even)": { bgcolor: "action.hover" } }),
              ...(isSelected && { bgcolor: "action.selected" }),
            }}
          >
            {/* Checkbox */}
            {enableCheckBoxColumn && (
              <TableCell padding="checkbox" sx={{ pl: depth > 0 ? 2 + depth * 2 : 1 }}>
                <Checkbox checked={isSelected} onChange={() => toggleSelectRow(id)} />
              </TableCell>
            )}

            {/* Tree toggle */}
            {enableTreeStructure && (
              <TableCell sx={{ width: 40, p: 0.5, pl: depth * 2.5 }}>
                {hasChildren ? (
                  <IconButton size="small" onClick={() => handleTreeToggle(row)} sx={{ fontSize: 14 }}>
                    {isExpanded ? "▼" : "▶"}
                  </IconButton>
                ) : (
                  <Box sx={{ width: 28 }} />
                )}
              </TableCell>
            )}

            {/* Data cells */}
            {visibleColumns.map((col) => (
              <TableCell key={col.field} sx={{ px: 2, py: 1.25, fontSize: 14, width: col.width || "auto" }}>
                {renderCell(row, col)}
              </TableCell>
            ))}
          </TableRow>

          {/* Tree children */}
          {hasChildren && isExpanded && renderRows(row.Children, depth + 1)}
        </Fragment>
      );
    });

  /* ---- Mobile card renderer ---- */
  const renderCard = (row) => {
    const id = row._sapId;
    const isSelected = selectedRowIds.includes(id);
    return (
      <Paper
        key={id}
        elevation={1}
        sx={{
          p: 2, borderRadius: 2, mb: 1.5,
          border: isSelected ? "2px solid" : "2px solid transparent",
          borderColor: isSelected ? "primary.main" : "transparent",
        }}
      >
        {enableCheckBoxColumn && (
          <Box sx={{ mb: 1 }}>
            <Checkbox checked={isSelected} onChange={() => toggleSelectRow(id)} size="small" />
          </Box>
        )}
        {visibleColumns.map((col) => (
          <Box key={col.field} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">{col.header}</Typography>
            <Box sx={{ maxWidth: "60%", textAlign: "right" }}>{renderCell(row, col)}</Box>
          </Box>
        ))}
      </Paper>
    );
  };

  /* ---- Entity count text ---- */
  const countText = addTableCount
    ? `${filteredData.length} ${filteredData.length === 1 ? countEntityTypeSingular : countEntityTypePlural}`
    : null;

  /* ---- Has data? ---- */
  const hasData = filteredData.length > 0;

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <Paper id={tableId || undefined} elevation={2} sx={{ borderRadius: 3, overflow: "hidden", ...sx }}>
      {/* ---- TABLE HEADER ---- */}
      {isShowTableHeader && (
        headerTemplate || (
          <Box
            sx={{
              px: 2.5, py: 1.5,
              display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5,
              borderBottom: 1, borderColor: "divider",
              ...(enableFixedHeader && { position: "sticky", top: 0, zIndex: 10, bgcolor: "background.paper" }),
            }}
          >
            {/* Search */}
            {isSearchBox && (
              <TextField
                size="small"
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 180, maxWidth: 260 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
                }}
              />
            )}

            {/* Count */}
            {countText && (
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {countText}
              </Typography>
            )}

            <Box sx={{ flex: 1 }} />

            {/* Bulk actions (v2 mode) */}
            {useBulkActions && selectedRowIds.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {isMobile && bulkActionMobile ? bulkActionMobile : null}
                {!isMobile && bulkActionDesktop ? bulkActionDesktop : null}
                {bulkActionsList.map((action, i) => (
                  <Button key={i} size="small" variant="outlined" color={action.color || "primary"}
                    onClick={action.onClick} startIcon={action.icon || null}>
                    {action.label}
                  </Button>
                ))}
                {(showSaveButton || useBulkActions) && !isTextMode && (
                  <Button size="small" variant="contained" onClick={handleSave}>Save</Button>
                )}
                <Button size="small" variant="text" color="inherit" onClick={handleBulkCancel}>Cancel</Button>
              </Box>
            )}

            {/* Classic action buttons */}
            {!useBulkActions && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {allowsEditing && isTextMode && (
                  <Button size="small" variant="outlined" onClick={handleEdit}>Edit</Button>
                )}
                {!isTextMode && (
                  <>
                    <Button size="small" variant="contained" onClick={handleSave}>
                      Save
                    </Button>
                    <Button size="small" variant="text" color="inherit" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
                {isDeleteSelectButton && selectedRowIds.length > 0 && (
                  <Button size="small" variant="outlined" color="error" onClick={handleDelete}>
                    Delete{showEditDeleteCounts ? ` (${selectedRowIds.length})` : ""}
                  </Button>
                )}
              </Box>
            )}

            {/* Settings dropdown */}
            {enableTableSettings && (
              <>
                <IconButton size="small" onClick={(e) => setSettingsEl(e.currentTarget)}
                  sx={{ ml: 0.5, fontSize: 18 }}>
                  ⚙
                </IconButton>
                <Menu anchorEl={settingsEl} open={!!settingsEl} onClose={() => setSettingsEl(null)}>
                  <Typography variant="caption" sx={{ px: 2, py: 0.5, fontWeight: 700, display: "block", color: "text.secondary" }}>
                    COLUMNS
                  </Typography>
                  {columns.map((col) => (
                    <MenuItem key={col.field} dense onClick={() => toggleColumn(col.field)}>
                      <Checkbox size="small" checked={!hiddenColumns.has(col.field)} sx={{ mr: 1 }} />
                      {col.header}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        )
      )}

      {/* ---- TABLE BODY ---- */}
      {showCards ? (
        <Box sx={{ p: 2 }}>
          {hasData ? filteredData.map(renderCard) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              No data available
            </Typography>
          )}
        </Box>
      ) : (
        <TableContainer sx={{ maxHeight: enableFixedHeader ? "calc(100vh - 200px)" : undefined }}>
          <Table stickyHeader={enableFixedHeader} size="small">
            <TableHead>
              <TableRow>
                {enableCheckBoxColumn && (
                  <TableCell padding="checkbox" sx={{ bgcolor: "background.paper" }}>
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isSomeSelected}
                      onChange={toggleSelectAll}
                    />
                  </TableCell>
                )}
                {enableTreeStructure && <TableCell sx={{ width: 40, bgcolor: "background.paper" }} />}
                {visibleColumns.map((col) => (
                  <TableCell
                    key={col.field}
                    sx={{
                      fontWeight: 700, px: 2, py: 1.5, fontSize: 13,
                      width: col.width || "auto",
                      bgcolor: "background.paper",
                      textTransform: "uppercase", letterSpacing: 0.5,
                    }}
                  >
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {hasData ? renderRows(filteredData) : (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + (enableCheckBoxColumn ? 1 : 0) + (enableTreeStructure ? 1 : 0)}
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    <Typography variant="body2" color="text.secondary">No data available</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ---- FOOTER ---- */}
      {(isAddNew || customButton) && (
        <Box
          sx={{
            px: 2.5, py: 1.5,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderTop: 1, borderColor: "divider",
            ...(stickyFooter && { position: "sticky", bottom: 0, bgcolor: "background.paper", zIndex: 5 }),
          }}
        >
          {isAddNew && (
            <Button size="small" variant="outlined" onClick={handleAdd}>
              + {addNewText}
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          {customButton && <Box>{customButton}</Box>}
        </Box>
      )}
    </Paper>
  );
};

export default SapEditableTable;
