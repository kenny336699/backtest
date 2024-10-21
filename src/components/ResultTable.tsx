import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { BacktestData } from "../types";

interface ResultTableProps {
  data: BacktestData[];
  onRemoveItem: (id: number) => void;
}

const ResultTable: React.FC<ResultTableProps> = ({ data, onRemoveItem }) => {
  const columns: ColumnDef<BacktestData>[] = React.useMemo(
    () => [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "time", header: "Time" },
      { accessorKey: "symbol", header: "Symbol" },
      { accessorKey: "pattern", header: "Pattern" },
      { accessorKey: "support", header: "Support" },
      { accessorKey: "additional", header: "Additional" },
      { accessorKey: "r", header: "R" },
      { accessorKey: "feeling", header: "Feeling" },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            onClick={() => {
              onRemoveItem(row.original.id);
            }}
            variant="destructive"
            size="sm"
          >
            Remove
          </Button>
        ),
      },
    ],
    [onRemoveItem]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Backtest Results");
    XLSX.writeFile(wb, "backtest_results.xlsx");
  };

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={exportToExcel} className="mt-4">
        Export to Excel
      </Button>
    </div>
  );
};

export default ResultTable;
