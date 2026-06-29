"use client";
import { useCallback, useEffect, useState } from "react";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { Skeleton } from "../ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";

import FormBitacora from "./form";
import useBitacoraTable from "@/hooks/bitacora/useBitacoraTable";
import { BitacoraRecord } from "@/types/bitacoraTable";
import DuplicateRow from "./duplicateRow";
import { useBitacoraUpdateData } from "@/hooks/bitacora/useBitacoraUpdateData";
import { Inputs } from "@/hooks/types";
import { TableToolbar } from "./TableToolbar";
import { TablePagination } from "./TablePagination";

/**
 * @param columns are the columns of the table, coming from app/bitacora/page.tsx
 * @param idFilter is the id of the row that is selected to share with other one
 * @returns DataTable is the function that prints the table in the DOM and shows all of the rows or individually
 */

export function DataTable({
  columns,
  idFilter,
}: {
  columns: ColumnDef<BitacoraRecord, unknown>[];
  idFilter: string | null;
}) {
  const [manualRefresh, setManualRefresh] = useState(0);

  const {
    dataBitacora,
    debouncedGlobal,
    setGlobalFilter,
    filters,
    onChangeFilter,
    dateRange,
    setDateRange,
    loading,
    pagination,
    rowCount,
    uiPagination,
    goNextPage,
    goPreviousPage,
  } = useBitacoraUpdateData(idFilter, manualRefresh);

  const [open, setOpen] = useState(false);
  const [defaultData, setDefaultData] = useState<Partial<Inputs>>({});
  const [toEdit, setToEdit] = useState<boolean>(false);
  const handleOpenForm = () => setOpen(true);
  const handleToEdit = () => setToEdit((prev) => !prev);

  const { table } = useBitacoraTable(dataBitacora, columns, {
    handleOpenForm,
    handleToEdit,
    setDefaultData,
    debouncedGlobal,
    setManualRefresh,
  });

  const down = useCallback((e: KeyboardEvent) => {
    if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  }, []);

  // handler Command Form
  useEffect(() => {
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [down]);

  return (
    <>
      <Card className="flex flex-col h-[calc(98vh-64px)]">
        <TableToolbar
          filters={filters}
          setGlobalFilter={setGlobalFilter}
          dateRange={dateRange}
          onChangeFilter={onChangeFilter}
          setDateRange={setDateRange}
          setOpen={setOpen}
        />
        <CardContent className="flex-1 overflow-hidden relative">
          <div className="flex h-full w-full overflow-x-auto">
            {loading ? (
              <Skeleton className="w-full h-full" />
            ) : (
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
                                  onDoubleClick: () =>
                                    header.column.resetSize(),
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
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      </DuplicateRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center"
                      >
                        No hay datos (╥﹏╥)
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
        <TablePagination
          goPreviousPage={goPreviousPage}
          goNextPage={goNextPage}
          loading={loading}
          pagination={pagination}
          rowCount={rowCount}
          uiPagination={uiPagination}
        />
      </Card>
      <FormBitacora
        toEdit={toEdit}
        defaultData={defaultData}
        setOpen={setOpen}
        open={open}
        handleToEdit={handleToEdit}
        setDefaultData={setDefaultData}
        onSuccess={() => setManualRefresh((prev) => prev + 1)}
      />
    </>
  );
}
