import { Skeleton } from "../ui/skeleton";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DuplicateRow from "./duplicateRow";
import { BitacoraRecord } from "@/types/bitacoraTable";
import { type Table as TanstackTable, ColumnDef } from "@tanstack/react-table";

type BitacoraTableBodyProps = {
  loading: boolean;
  table: TanstackTable<BitacoraRecord>;
  columns: ColumnDef<BitacoraRecord, unknown>[];
};

export const BitacoraTableBody = ({
  loading,
  table,
  columns,
}: BitacoraTableBodyProps) => {
  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }
  return (
    <Table
      className="table-fixed"
      style={{ width: table.getCenterTotalSize() }}
    >
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="group/head relative h-10 select-none last:[&>.cursor-col-resize]:opacity-0 text-sm bg-zinc-50"
                  {...{
                    colSpan: header.colSpan,
                    style: {
                      width: header.getSize(),
                    },
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  {header.column.getCanResize() && (
                    <div
                      key={header.id}
                      {...{
                        onDoubleClick: () => header.column.resetSize(),
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className:
                          "group-last/head:hidden absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:translate-x-px",
                      }}
                    />
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <DuplicateRow key={row.id} id={row.original.id}>
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="text-md whitespace-normal"
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            </DuplicateRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No hay datos (╥﹏╥)
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
