import { useState, useCallback, useMemo, useEffect } from "react";

/**
 * useSapTable
 *
 * Comprehensive state-management hook for the SapTable component.
 * Handles pagination, column sorting (client + server), search
 * filtering, row selection (checkbox), and tree row expansion.
 */
const useSapTable = ({
  tableData = null,
  columns: propColumns = null,
  pageSize: initialPageSize = 25,
  sortOnServer = false,
  customColumnKeys = [],
  trackByField = "",
  doNotPaginate = false,
}) => {
  /* ---- Derive rows from YardiTableDataSource-like structure ---- */
  const rawRows = useMemo(() => {
    if (!tableData) return [];
    if (Array.isArray(tableData)) return tableData;
    if (tableData.data) return tableData.data;
    if (tableData.item) return tableData.item;
    return [];
  }, [tableData]);

  const columns = useMemo(() => {
    if (propColumns) return propColumns;
    if (!tableData) return [];
    if (tableData.columns) return tableData.columns;
    return [];
  }, [tableData, propColumns]);

  /* ---- Internal state ---- */
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortField, setSortField] = useState("");
  const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [expandedRowIds, setExpandedRowIds] = useState(new Set());
  const [checkedAll, setCheckedAll] = useState(false);

  /* ---- Search filter ---- */
  const searchableKeys = useMemo(() => {
    if (customColumnKeys.length) return customColumnKeys;
    return columns.filter((c) => c.field).map((c) => c.field);
  }, [customColumnKeys, columns]);

  const searchedRows = useMemo(() => {
    if (!searchTerm.trim()) return rawRows;
    const term = searchTerm.toLowerCase();
    return rawRows.filter((row) =>
      searchableKeys.some((key) => {
        const val = row[key];
        return val != null && String(val).toLowerCase().includes(term);
      })
    );
  }, [rawRows, searchTerm, searchableKeys]);

  /* ---- Client-side sort ---- */
  const sortedRows = useMemo(() => {
    if (sortOnServer || !sortField) return searchedRows;
    const sorted = [...searchedRows];
    sorted.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === "number" && typeof bVal === "number")
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [searchedRows, sortField, sortDir, sortOnServer]);

  /* ---- Pagination ---- */
  const totalRows = sortedRows.length;
  const totalPages = doNotPaginate ? 1 : Math.max(1, Math.ceil(totalRows / pageSize));

  const paginatedRows = useMemo(() => {
    if (doNotPaginate) return sortedRows;
    const start = page * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page, pageSize, doNotPaginate]);

  // Clamp page when data shrinks
  useEffect(() => {
    if (page >= totalPages && totalPages > 0) setPage(totalPages - 1);
  }, [page, totalPages]);

  /* ---- Sort handler ---- */
  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("asc");
      }
      setPage(0);
      return { field, dir: sortField === field ? (sortDir === "asc" ? "desc" : "asc") : "asc" };
    },
    [sortField, sortDir]
  );

  /* ---- Selection ---- */
  const getRowId = useCallback(
    (row, idx) => (trackByField && row[trackByField] != null ? row[trackByField] : row._sapId || row.id || idx),
    [trackByField]
  );

  const toggleRow = useCallback(
    (row, idx) => {
      const id = getRowId(row, idx);
      setSelectedRowIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    },
    [getRowId]
  );

  const toggleAll = useCallback(() => {
    if (checkedAll) {
      setSelectedRowIds(new Set());
      setCheckedAll(false);
    } else {
      const ids = new Set(paginatedRows.map((r, i) => getRowId(r, i)));
      setSelectedRowIds(ids);
      setCheckedAll(true);
    }
  }, [checkedAll, paginatedRows, getRowId]);

  const isRowSelected = useCallback(
    (row, idx) => selectedRowIds.has(getRowId(row, idx)),
    [selectedRowIds, getRowId]
  );

  const isSomeSelected = selectedRowIds.size > 0 && selectedRowIds.size < paginatedRows.length;
  const isAllSelected = paginatedRows.length > 0 && selectedRowIds.size >= paginatedRows.length;

  /* ---- Tree ---- */
  const toggleTreeRow = useCallback((row, idx) => {
    const id = getRowId(row, idx);
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, [getRowId]);

  const isTreeExpanded = useCallback(
    (row, idx) => expandedRowIds.has(getRowId(row, idx)),
    [expandedRowIds, getRowId]
  );

  /* ---- Flatten tree for counting ---- */
  const flattenTree = useCallback((rows) => {
    let count = 0;
    const walk = (list) => { list.forEach((r) => { count++; if (r.Children) walk(r.Children); }); };
    walk(rows);
    return count;
  }, []);

  return {
    // Data
    columns,
    paginatedRows,
    sortedRows,
    totalRows,
    // Pagination
    page, setPage,
    pageSize, setPageSize,
    totalPages,
    // Sort
    sortField, sortDir, handleSort,
    // Search
    searchTerm, setSearchTerm,
    // Selection
    selectedRowIds, toggleRow, toggleAll,
    isRowSelected, isSomeSelected, isAllSelected,
    setSelectedRowIds, checkedAll,
    // Tree
    expandedRowIds, toggleTreeRow, isTreeExpanded,
    flattenTree,
    // Utilities
    getRowId,
  };
};

export default useSapTable;
