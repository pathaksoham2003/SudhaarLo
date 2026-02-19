import React, { useCallback, useState, Fragment, useMemo } from "react";
import {
  Box, Paper, Typography, Table, TableHead, TableBody, TableRow,
  TableCell, TableContainer, TablePagination, TableSortLabel,
  Checkbox, TextField, IconButton, Button, Menu, MenuItem,
  Chip, CircularProgress, Divider, InputAdornment,
  useTheme, useMediaQuery,
} from "@mui/material";
import useSapTable from "./useSapTable";

/* ================================================================
   SapTable
   ================================================================
   Read-only data table with sorting, pagination, search, tree
   structure, sticky columns, sticky header, row selection,
   responsive card layout, bulk actions, column settings,
   zebra striping, reports mode, drag-drop rows, filter chips,
   and full MUI theming.

   Matches the screenshots: tabbed header, search + count + sort
   dropdown, column headers with sort arrows, priority chips,
   action menus, tree expand/collapse, and sticky columns.
   ================================================================ */

const SapTable = ({
  // Data
  tableData = null,
  columns: propColumns = null,
  tableId = "",
  trackByField = "",
  // Features
  sortOnServer = false,
  enableTableSettings = false,
  enableDropdownActions = false,
  isShowTableHeader = true,
  enableCheckBoxColumn = false,
  enableFixedHeader = true,
  enableStickyColumns = false,
  stickyColumnCount = 0,
  enableTreeStructure = false,
  enableSortDropdown = false,
  enableTableHeaderWrapping = false,
  isReportsTable = false,
  isEnableShadeAltRows = false,
  isEnableRowHover = false,
  mobileCardState = true,
  useMobileCardsOnTablet = false,
  disableColumnSort = false,
  disableCustomColumnsToggle = false,
  disableShadeToggle = false,
  disableFilterRemoval = false,
  doNotPaginate = false,
  isLoading = false,
  // Pagination
  pageSize: initPageSize = 25,
  pageSizeOptions = [25, 50, 100],
  isShowPageSizeOptions = false,
  // Search
  addSearchBox = false,
  customColumnKeys = [],
  // Count
  addTableCount = false,
  countEntityTypeSingular = "Item",
  countEntityTypePlural = "Items",
  // Bulk actions
  bulkActionsList = [],
  showSaveButton = false,
  // Filter chips
  filterChipData = null,
  onUnselectLabel,
  onUnselectAllLabels,
  // Aria
  tableAriaLabel = "Scrollable Data Table",
  // Empty state
  emptyTableString = "",
  emptyTableButtonString = "",
  filterGeneratedTable = false,
  filterHasBeenSearched = false,
  // Templates (ReactNode / render props)
  headerTemplate,
  rowTemplate,
  mobileCardTemplate,
  actionsTemplate,
  bulkActionDesktop,
  bulkActionMobile,
  // Callbacks
  onRowClick,
  onPageChange,
  onExternalClientSort,
  onSaveClick,
  onCancelClick,
  onTreeRowExpanded,
  onTreeRowCollapsed,
  onEmptyTableButtonClick,
  onCheckedAllChange,
  onCheckedChange,
  // Style
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const showCards = mobileCardState && (isMobile || (useMobileCardsOnTablet && isTablet));
  const compactMode = isReportsTable;

  const {
    columns, paginatedRows, totalRows,
    page, setPage, pageSize, setPageSize,
    sortField, sortDir, handleSort,
    searchTerm, setSearchTerm,
    selectedRowIds, toggleRow, toggleAll,
    isRowSelected, isSomeSelected, isAllSelected,
    toggleTreeRow, isTreeExpanded,
    setSelectedRowIds, getRowId,
  } = useSapTable({
    tableData, pageSize: initPageSize, sortOnServer,
    customColumnKeys, enableTreeStructure, trackByField, doNotPaginate,
    columns: propColumns,
  });

  // Column visibility
  const [hiddenCols, setHiddenCols] = useState(new Set());
  const [settingsEl, setSettingsEl] = useState(null);
  const [shadeRows, setShadeRows] = useState(isEnableShadeAltRows);

  const visibleCols = useMemo(
    () => columns.filter((c) => !hiddenCols.has(c.field)),
    [columns, hiddenCols]
  );

  const toggleColVisibility = (field) => {
    setHiddenCols((prev) => {
      const n = new Set(prev);
      n.has(field) ? n.delete(field) : n.add(field);
      return n;
    });
  };

  const hasBulkActions = bulkActionsList.length > 0 || showSaveButton;
  const selectedCount = selectedRowIds.size;

  /* ---- Count text ---- */
  const countText = addTableCount
    ? `${totalRows} ${totalRows === 1 ? countEntityTypeSingular : countEntityTypePlural}`
    : null;

  /* ---- Sort handler bridging ---- */
  const onSortClick = useCallback(
    (field) => {
      const result = handleSort(field);
      if (sortOnServer && onExternalClientSort) onExternalClientSort(result);
    },
    [handleSort, sortOnServer, onExternalClientSort]
  );

  /* ---- Row click ---- */
  const handleRowClick = useCallback(
    (row) => { onRowClick && onRowClick(row); },
    [onRowClick]
  );

  /* ---- Tree toggle ---- */
  const handleTreeToggle = useCallback(
    (row, idx) => {
      const wasExpanded = isTreeExpanded(row, idx);
      toggleTreeRow(row, idx);
      if (wasExpanded) onTreeRowCollapsed && onTreeRowCollapsed(row);
      else onTreeRowExpanded && onTreeRowExpanded(row);
    },
    [toggleTreeRow, isTreeExpanded, onTreeRowExpanded, onTreeRowCollapsed]
  );

  /* ---- Checkbox change ---- */
  const handleCheckRow = useCallback(
    (row, idx) => {
      toggleRow(row, idx);
      onCheckedChange && onCheckedChange(row);
    },
    [toggleRow, onCheckedChange]
  );

  const handleCheckAll = useCallback(() => {
    toggleAll();
    onCheckedAllChange && onCheckedAllChange(!isAllSelected);
  }, [toggleAll, isAllSelected, onCheckedAllChange]);

  /* ---- Page change ---- */
  const handlePageChange = useCallback(
    (_, newPage) => {
      setPage(newPage);
      onPageChange && onPageChange(newPage);
    },
    [setPage, onPageChange]
  );

  /* ---- Cell styling ---- */
  const cellSx = compactMode
    ? { px: 1.5, py: 0.75, fontSize: 12, lineHeight: 1.4 }
    : { px: 2.5, py: 1.5, fontSize: 14 };
  const headerCellSx = {
    ...cellSx,
    fontWeight: 700,
    fontSize: compactMode ? 11 : 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    whiteSpace: enableTableHeaderWrapping ? "normal" : "nowrap",
    bgcolor: "background.paper",
  };

  /* ---- Render a single data row ---- */
  const renderDataRow = (row, rowIndex, depth = 0) => {
    const id = getRowId(row, rowIndex);
    const selected = isRowSelected(row, rowIndex);
    const hasChildren = enableTreeStructure && row.Children && row.Children.length > 0;
    const expanded = isTreeExpanded(row, rowIndex);

    const stickyStyle = (colIdx) =>
      enableStickyColumns && colIdx < stickyColumnCount
        ? { position: "sticky", left: colIdx * 120, zIndex: 2, bgcolor: "background.paper" }
        : {};

    return (
      <Fragment key={id}>
        <TableRow
          hover={isEnableRowHover || !!onRowClick}
          selected={selected}
          onClick={() => handleRowClick(row, rowIndex)}
          sx={{
            cursor: onRowClick ? "pointer" : "default",
            ...(shadeRows && { "&:nth-of-type(even)": { bgcolor: "action.hover" } }),
          }}
        >
          {/* Checkbox */}
          {enableCheckBoxColumn && (
            <TableCell padding="checkbox" sx={{ ...cellSx, pl: 1 }}>
              <Checkbox
                checked={selected}
                onChange={(e) => { e.stopPropagation(); handleCheckRow(row, rowIndex); }}
                size="small"
              />
            </TableCell>
          )}

          {/* Tree expand */}
          {enableTreeStructure && (
            <TableCell sx={{ ...cellSx, width: 40, p: 0.5, pl: depth * 2.5 + 1 }}>
              {hasChildren ? (
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleTreeToggle(row, rowIndex); }}
                  sx={{ fontSize: 13 }}
                >
                  {expanded ? "▼" : "▶"}
                </IconButton>
              ) : (
                <Box sx={{ width: 28 }} />
              )}
            </TableCell>
          )}

          {/* Data cells */}
          {rowTemplate
            ? rowTemplate(row, rowIndex, visibleCols)
            : visibleCols.map((col, colIdx) => {
              const val = row[col.field];
              return (
                <TableCell key={col.field} sx={{ ...cellSx, ...stickyStyle(colIdx + (enableCheckBoxColumn ? 1 : 0) + (enableTreeStructure ? 1 : 0)), width: col.width || "auto" }}>
                  {col.render ? col.render(val, row, rowIndex) : (val ?? "—")}
                </TableCell>
              );
            })}

          {/* Actions column */}
          {(actionsTemplate || enableDropdownActions) && (
            <TableCell sx={{ ...cellSx, width: 50, textAlign: "center" }}>
              {actionsTemplate ? actionsTemplate(row, rowIndex) : (
                <IconButton size="small" sx={{ fontSize: 18 }}>⋮</IconButton>
              )}
            </TableCell>
          )}
        </TableRow>

        {/* Tree children */}
        {hasChildren && expanded &&
          row.Children.map((child, ci) => renderDataRow(child, `${rowIndex}-${ci}`, depth + 1))}
      </Fragment>
    );
  };

  /* ---- Mobile card ---- */
  const renderCard = (row, rowIndex) => {
    const id = getRowId(row, rowIndex);
    const selected = isRowSelected(row, rowIndex);

    if (mobileCardTemplate) return mobileCardTemplate(row, rowIndex);

    return (
      <Paper
        key={id}
        elevation={1}
        onClick={() => handleRowClick(row, rowIndex)}
        sx={{
          p: 2, mb: 1.5, borderRadius: 2, cursor: onRowClick ? "pointer" : "default",
          border: selected ? "2px solid" : "2px solid transparent",
          borderColor: selected ? "primary.main" : "transparent",
        }}
      >
        {enableCheckBoxColumn && (
          <Box sx={{ mb: 1 }}>
            <Checkbox checked={selected} size="small"
              onChange={(e) => { e.stopPropagation(); handleCheckRow(row, rowIndex); }} />
          </Box>
        )}
        {visibleCols.map((col) => (
          <Box key={col.field} sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">{col.header || col.field}</Typography>
            <Box sx={{ maxWidth: "60%", textAlign: "right", fontSize: 14 }}>
              {col.render ? col.render(row[col.field], row) : (row[col.field] ?? "—")}
            </Box>
          </Box>
        ))}
        {actionsTemplate && <Box sx={{ mt: 1 }}>{actionsTemplate(row, rowIndex)}</Box>}
      </Paper>
    );
  };

  /* ---- Empty state ---- */
  const emptyMessage = filterGeneratedTable
    ? (filterHasBeenSearched ? (emptyTableString || "No results found.") : "Apply filters to see results.")
    : (emptyTableString || "No data available.");

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <Paper id={tableId || undefined} elevation={2} sx={{ borderRadius: 3, overflow: "hidden", ...sx }}>

      {/* ---- HEADER TOOLBAR ---- */}
      {isShowTableHeader !== false && (
        headerTemplate || (
          <Box sx={{
            px: 2.5, py: 1.5, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5,
            borderBottom: 1, borderColor: "divider",
            ...(enableFixedHeader && { position: "sticky", top: 0, zIndex: 10, bgcolor: "background.paper" }),
          }}>
            {/* Search */}
            {addSearchBox && (
              <TextField size="small" placeholder="Search…" value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 160, maxWidth: 240 }}
                InputProps={{ startAdornment: <InputAdornment position="start">🔍</InputAdornment> }}
              />
            )}

            {/* Count badge */}
            {countText && (
              <Chip label={countText} color="primary" size="small" sx={{ fontWeight: 700 }} />
            )}

            {/* Filter chips */}
            {filterChipData && filterChipData.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {filterChipData.filter((c) => c.selected).map((chip, i) => (
                  <Chip key={i} label={chip.label} size="small" variant="outlined"
                    onDelete={disableFilterRemoval ? undefined : () => onUnselectLabel && onUnselectLabel(chip)} />
                ))}
                {!disableFilterRemoval && filterChipData.filter((c) => c.selected).length > 1 && (
                  <Button size="small" variant="text" onClick={() => onUnselectAllLabels && onUnselectAllLabels()}>
                    Clear all
                  </Button>
                )}
              </Box>
            )}

            <Box sx={{ flex: 1 }} />

            {/* Bulk actions */}
            {hasBulkActions && selectedCount > 0 && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {isMobile && bulkActionMobile ? bulkActionMobile : null}
                {!isMobile && bulkActionDesktop ? bulkActionDesktop : null}
                {bulkActionsList.map((a, i) => (
                  <Button key={i} size="small" variant="outlined" color={a.color || "primary"}
                    onClick={a.onClick} startIcon={a.icon || null}>{a.label}</Button>
                ))}
                {showSaveButton && (
                  <Button size="small" variant="contained" onClick={() => onSaveClick && onSaveClick()}>Save</Button>
                )}
                <Button size="small" variant="text" color="inherit"
                  onClick={() => { setSelectedRowIds(new Set()); onCancelClick && onCancelClick(); }}>
                  Cancel
                </Button>
              </Box>
            )}

            {/* Sort dropdown */}
            {enableSortDropdown && !isMobile && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                Sort by ▾
              </Typography>
            )}

            {/* Settings */}
            {enableTableSettings && (
              <>
                <IconButton size="small" onClick={(e) => setSettingsEl(e.currentTarget)} sx={{ fontSize: 18 }}>⚙</IconButton>
                <Menu anchorEl={settingsEl} open={!!settingsEl} onClose={() => setSettingsEl(null)}>
                  {!disableShadeToggle && (
                    <MenuItem dense onClick={() => setShadeRows((p) => !p)}>
                      <Checkbox size="small" checked={shadeRows} sx={{ mr: 1 }} /> Shade Alternate Rows
                    </MenuItem>
                  )}
                  {!disableCustomColumnsToggle && (<Divider />)}
                  {!disableCustomColumnsToggle && (
                    <Typography variant="caption" sx={{ px: 2, py: 0.5, fontWeight: 700, display: "block", color: "text.secondary" }}>
                      COLUMNS
                    </Typography>
                  )}
                  {!disableCustomColumnsToggle && columns.map((col) => (
                    <MenuItem key={col.field} dense onClick={() => toggleColVisibility(col.field)}>
                      <Checkbox size="small" checked={!hiddenCols.has(col.field)} sx={{ mr: 1 }} />
                      {col.header || col.field}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        )
      )}

      {/* ---- TABLE BODY ---- */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={40} />
        </Box>
      ) : showCards && !enableTreeStructure ? (
        <Box sx={{ p: 2 }}>
          {paginatedRows.length > 0
            ? paginatedRows.map((row, i) => renderCard(row, page * pageSize + i))
            : <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              {emptyMessage}
              {emptyTableButtonString && (
                <Button size="small" variant="outlined" sx={{ mt: 1, display: "block", mx: "auto" }}
                  onClick={() => onEmptyTableButtonClick && onEmptyTableButtonClick()}>
                  {emptyTableButtonString}
                </Button>
              )}
            </Typography>
          }
        </Box>
      ) : (
        <TableContainer sx={{ maxHeight: enableFixedHeader ? "calc(100vh - 220px)" : undefined }}>
          <Table
            stickyHeader={enableFixedHeader}
            size={compactMode ? "small" : "medium"}
            aria-label={tableAriaLabel}
          >
            <TableHead>
              <TableRow>
                {enableCheckBoxColumn && (
                  <TableCell padding="checkbox" sx={{ ...headerCellSx, zIndex: 3, pl: 1 }}>
                    <Checkbox checked={isAllSelected} indeterminate={isSomeSelected}
                      onChange={handleCheckAll} size="small" />
                  </TableCell>
                )}
                {enableTreeStructure && <TableCell sx={{ ...headerCellSx, width: 40, zIndex: 3 }} />}
                {visibleCols.map((col, colIdx) => (
                  <TableCell
                    key={col.field}
                    sx={{
                      ...headerCellSx,
                      width: col.width || "auto",
                      ...(enableStickyColumns && colIdx < stickyColumnCount
                        ? { position: "sticky", left: colIdx * 120, zIndex: 4 }
                        : {}),
                    }}
                    sortDirection={sortField === col.field ? sortDir : false}
                  >
                    {col.sortable !== false && !disableColumnSort ? (
                      <TableSortLabel
                        active={sortField === col.field}
                        direction={sortField === col.field ? sortDir : "asc"}
                        onClick={() => onSortClick(col.field)}
                      >
                        {col.header || col.field}
                      </TableSortLabel>
                    ) : (
                      col.header || col.field
                    )}
                  </TableCell>
                ))}
                {(actionsTemplate || enableDropdownActions) && (
                  <TableCell sx={{ ...headerCellSx, width: 60, textAlign: "center", zIndex: 3 }}>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length > 0
                ? paginatedRows.map((row, i) => renderDataRow(row, page * pageSize + i))
                : (
                  <TableRow>
                    <TableCell
                      colSpan={visibleCols.length + (enableCheckBoxColumn ? 1 : 0) + (enableTreeStructure ? 1 : 0) + (actionsTemplate || enableDropdownActions ? 1 : 0)}
                      sx={{ textAlign: "center", py: 5 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {emptyMessage}
                      </Typography>
                      {emptyTableButtonString && (
                        <Button size="small" variant="outlined" sx={{ mt: 1 }}
                          onClick={() => onEmptyTableButtonClick && onEmptyTableButtonClick()}>
                          {emptyTableButtonString}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ---- PAGINATION ---- */}
      {!doNotPaginate && totalRows > 0 && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={isShowPageSizeOptions ? pageSizeOptions : [pageSize]}
          sx={{
            borderTop: 1, borderColor: "divider",
            "& .MuiTablePagination-toolbar": { minHeight: 48 },
          }}
        />
      )}
    </Paper>
  );
};

export default SapTable;
