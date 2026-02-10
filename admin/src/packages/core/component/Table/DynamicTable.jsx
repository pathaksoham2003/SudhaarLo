import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
} from "@mui/material";

const DynamicTable = ({
  header = [],
  tableData = { item: [] },
  formatCell: customFormatCell,
  onRowClick: customRowClick,
  columnWidths = [], // array of numbers summing up to 1
}) => {
  const { item = [] } = tableData;

  const defaultFormatCell = (cell) => {
    if (typeof cell === "string" && /^\d{4}-\d{2}-\d{2}T/.test(cell)) {
      return new Date(cell).toLocaleDateString();
    }

    if (Array.isArray(cell)) {
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {cell.map((entry, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: "#E0E0E0",
                padding: "2px 6px",
                borderRadius: 8,
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              {entry.split("/").join(" | ")}
            </span>
          ))}
        </div>
      );
    }

    return cell ?? "—";
  };

  const formatCell = customFormatCell ?? defaultFormatCell;
  const defaultRowClick = () => {};
  const onRowClick = customRowClick ?? defaultRowClick;

  if (!header.length || !item.length) {
    return <p style={{ textAlign: "center", padding: "16px" }}>No data available</p>;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        maxHeight: 500,
        overflowY: "auto",
        width: "100%",
      }}
    >
      <Table stickyHeader sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            {header.map((col, idx) => (
              <TableCell
                key={idx}
                sx={{
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  fontSize: 14,
                  width: columnWidths[idx] ? `${columnWidths[idx] * 100}%` : "auto",
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {item.map((row, rowIndex) => (
            <TableRow
              key={row.id}
              hover={!!customRowClick}
              onClick={() => onRowClick({ item_id: row.id, row_number: rowIndex })}
              sx={{ cursor: customRowClick ? "pointer" : "default" }}
            >
              {row.data.map((cell, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    px: 3,
                    py: 1.5,
                    fontSize: 14,
                    width: columnWidths[idx] ? `${columnWidths[idx] * 100}%` : "auto",
                  }}
                >
                  {formatCell(cell, idx, row.id)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DynamicTable;
