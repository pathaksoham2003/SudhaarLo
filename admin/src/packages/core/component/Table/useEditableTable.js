import { useState, useCallback, useMemo, useEffect } from "react";

/**
 * useEditableTable
 *
 * State-management hook for SapEditableTable.
 * Handles edit/text mode, row selection, search filtering,
 * CRUD operations, tree expansion, and column visibility.
 */
const useEditableTable = ({
  data = [],
  updatedata,
  columns = [],
  newItemValue = {},
  customColumnKeys = [],
  isEnableTextMode = true,
  textMode: controlledTextMode,
}) => {
  /* ---- Internal unique id helper ---- */
  const ensureIds = useCallback(
    (rows) =>
      (rows || []).map((r, i) => ({
        ...r,
        _sapId: r._sapId || r.id || `row-${i}-${Date.now()}`,
      })),
    []
  );

  /* ---- Core state ---- */
  const [tableData, setTableData] = useState(() => ensureIds(data));
  const [originalData, setOriginalData] = useState(() => ensureIds(data));
  const [isTextMode, setIsTextMode] = useState(isEnableTextMode);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRowIds, setExpandedRowIds] = useState(new Set());
  const [hiddenColumns, setHiddenColumns] = useState(
    () => new Set(columns.filter((c) => c.hidden).map((c) => c.field))
  );

  /* ---- Sync controlled textMode ---- */
  useEffect(() => {
    if (controlledTextMode !== null && controlledTextMode !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTextMode(controlledTextMode);
    }
  }, [controlledTextMode]);

  /* ---- Sync data prop ---- */
  useEffect(() => {
    if (data) {
      const d = ensureIds(data);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTableData(d);
       
      setOriginalData(d);
    }
  }, [data, ensureIds]);

  /* ---- Sync updatedata (resets state) ---- */
  useEffect(() => {
    if (updatedata) {
      const d = ensureIds(updatedata);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTableData(d);
       
      setOriginalData(d);
       
      setIsTextMode(true);
       
      setSelectedRowIds([]);
    }
  }, [updatedata, ensureIds]);

  /* ---- Search ---- */
  const searchableFields = useMemo(
    () =>
      customColumnKeys.length
        ? customColumnKeys
        : columns.filter((c) => c.field && c.searchable !== false).map((c) => c.field),
    [customColumnKeys, columns]
  );

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return tableData;
    const term = searchTerm.toLowerCase();
    return tableData.filter((row) =>
      searchableFields.some((field) => {
        const val = row[field];
        return val != null && String(val).toLowerCase().includes(term);
      })
    );
  }, [tableData, searchTerm, searchableFields]);

  /* ---- Selection ---- */
  const toggleSelectRow = useCallback((rowId) => {
    setSelectedRowIds((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    const allIds = filteredData.map((r) => r._sapId);
    setSelectedRowIds((prev) =>
      prev.length === allIds.length ? [] : [...allIds]
    );
  }, [filteredData]);

  const isAllSelected = useMemo(
    () => filteredData.length > 0 && selectedRowIds.length === filteredData.length,
    [filteredData, selectedRowIds]
  );

  const isSomeSelected = useMemo(
    () => selectedRowIds.length > 0 && selectedRowIds.length < filteredData.length,
    [filteredData, selectedRowIds]
  );

  /* ---- Edit mode ---- */
  const enterEditMode = useCallback(() => {
    setOriginalData([...tableData]);
    setIsTextMode(false);
  }, [tableData]);

  const cancelEdit = useCallback(() => {
    setTableData([...originalData]);
    setIsTextMode(true);
    setSelectedRowIds([]);
  }, [originalData]);

  const saveEdit = useCallback(() => {
    setOriginalData([...tableData]);
    setIsTextMode(true);
    setSelectedRowIds([]);
    return [...tableData];
  }, [tableData]);

  /* ---- Cell update ---- */
  const updateCell = useCallback((rowId, field, value) => {
    setTableData((prev) =>
      prev.map((r) => (r._sapId === rowId ? { ...r, [field]: value } : r))
    );
  }, []);

  /* ---- Add row ---- */
  const addRow = useCallback(() => {
    const newRow = { _sapId: `new-${Date.now()}`, ...newItemValue };
    setTableData((prev) => [...prev, newRow]);
    return newRow;
  }, [newItemValue]);

  /* ---- Delete selected ---- */
  const deleteSelectedRows = useCallback(() => {
    const deleted = tableData.filter((r) => selectedRowIds.includes(r._sapId));
    const remaining = tableData.filter((r) => !selectedRowIds.includes(r._sapId));
    setTableData(remaining);
    setSelectedRowIds([]);
    return { remaining, deleted };
  }, [tableData, selectedRowIds]);

  /* ---- Tree ---- */
  const toggleTreeRow = useCallback((rowId) => {
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      next.has(rowId) ? next.delete(rowId) : next.add(rowId);
      return next;
    });
  }, []);

  /* ---- Column visibility ---- */
  const toggleColumn = useCallback((field) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      next.has(field) ? next.delete(field) : next.add(field);
      return next;
    });
  }, []);

  const visibleColumns = useMemo(
    () => columns.filter((c) => !hiddenColumns.has(c.field)),
    [columns, hiddenColumns]
  );

  return {
    tableData,
    filteredData,
    isTextMode,
    selectedRowIds,
    searchTerm,
    expandedRowIds,
    hiddenColumns,
    visibleColumns,
    isAllSelected,
    isSomeSelected,
    setSearchTerm,
    setIsTextMode,
    enterEditMode,
    cancelEdit,
    saveEdit,
    toggleSelectRow,
    toggleSelectAll,
    updateCell,
    addRow,
    deleteSelectedRows,
    toggleTreeRow,
    toggleColumn,
  };
};

export default useEditableTable;
