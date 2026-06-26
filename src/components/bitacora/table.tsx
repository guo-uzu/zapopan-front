"use client"
import { useCallback, useEffect, useState } from "react";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "../ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import FormBitacora from "./form";
import useBitacoraTable from "@/hooks/bitacora/useBitacoraTable";
import { BitacoraRecord } from "@/types/bitacoraTable";
import goNextPage from "@/utils/bitacora/goNextPage";
import goPreviousPage from "@/utils/bitacora/goPreviousPage";
import FiltersResponsive from "./FiltersResponsive";
import FilterDesktop from "./filterDesktop";
import FilterUsers from "./filterUsers";
import CalendarFilter from "./calendarFilter";
import DuplicateRow from "./duplicateRow";
import { useBitacoraUpdateData } from "@/hooks/bitacora/useBitacoraUpdateData";
import { Inputs } from "@/hooks/types";

/**
 * @param columns are the columns of the table, coming from app/bitacora/page.tsx
 * @param idFilter is the id of the row that is selected to share with other one
 * @returns DataTable is the function that prints the table in the DOM and shows all of the rows or individually
 */

export function DataTable({
  columns,
  idFilter,
}: { columns: ColumnDef<BitacoraRecord, unknown>[], idFilter: string | null }) {
  const [manualRefresh, setManualRefresh] = useState(0)
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
    setPagination,
    uiPagination
  } = useBitacoraUpdateData(idFilter, manualRefresh)

  const [open, setOpen] = useState(false);
  const [defaultData, setDefaultData] = useState<Partial<Inputs>>({});
  const [toEdit, setToEdit] = useState<boolean>(false);
  const handleOpenForm = () => setOpen(true);
  const handleToEdit = () => setToEdit(prev => !prev);

  const { table } = useBitacoraTable(
    dataBitacora,
    columns,
    {
      handleOpenForm,
      handleToEdit,
      setDefaultData,
      debouncedGlobal,
      setManualRefresh
    },
  );

  const down = useCallback((e: KeyboardEvent) => {
    if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  }, [])

  // handler Command Form
  useEffect(() => {
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [down]);

  return (
    <>
      <Card className="flex flex-col h-[calc(98vh-64px)]">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <div className="flex items-center">
              <Input
                placeholder="Busca en la bitácora"
                onChange={(e) =>
                  setGlobalFilter(String(e.target.value))
                }
                className="max-w-sm"
              />
            </div>
            <FiltersResponsive filters={filters} onChangeFilter={onChangeFilter} />
            <FilterUsers filters={filters} onChangeFilter={onChangeFilter} />
            <FilterDesktop placeholder="Cuentas" idFilterItem="account" idColumnBitacora="account_id" filters={filters} onChangeFilter={onChangeFilter} />
            <FilterDesktop placeholder="Area" idFilterItem="area" idColumnBitacora="area_id" filters={filters} onChangeFilter={onChangeFilter} />
            <FilterDesktop placeholder="Canal" idFilterItem="channel" idColumnBitacora="channel" filters={filters} onChangeFilter={onChangeFilter} />
            <FilterDesktop placeholder="Categoría" idFilterItem="category" idColumnBitacora="category" filters={filters} onChangeFilter={onChangeFilter} />
            <FilterDesktop placeholder="Redes sociales" idFilterItem="socialNetwork" idColumnBitacora="social_network" filters={filters} onChangeFilter={onChangeFilter} />
            <FilterDesktop placeholder="Prioridad" idFilterItem="priority" idColumnBitacora="priority" filters={filters} onChangeFilter={onChangeFilter} />
            <FilterDesktop placeholder="Estatus" idFilterItem="status" idColumnBitacora="status" filters={filters} onChangeFilter={onChangeFilter} />
            <CalendarFilter dateRange={dateRange} setDateRange={setDateRange} onChangeFilter={onChangeFilter} />
          </div>
          {
            // Container right corner card
          }
          <div className="flex flex-row items-center gap-4">
            {
              // Command trigger draw (form)
            }
            <div>
              <p className="text-muted-foreground text-sm">
                Formulario{" "}
                <kbd onClick={() => setOpen(o => !o)} className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                  <span className="text-xs">⌘</span>J
                </kbd>
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden relative">
          <div className="flex h-full w-full overflow-x-auto">
            {
              loading ? <Skeleton className="w-full h-full" />
                :
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
                                  header.column
                                    .columnDef
                                    .header,
                                  header.getContext(),
                                )}
                              {header.column.getCanResize() && (
                                <div
                                  key={header.id}
                                  {...{
                                    onDoubleClick:
                                      () =>
                                        header.column.resetSize(),
                                    onMouseDown:
                                      header.getResizeHandler(),
                                    onTouchStart:
                                      header.getResizeHandler(),
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
                        <DuplicateRow key={row.id} id={row.original.id} >
                          <TableRow
                            key={row.id}
                            data-state={
                              row.getIsSelected() &&
                              "selected"
                            }
                          >
                            {row
                              .getVisibleCells()
                              .map((cell) => (
                                <TableCell
                                  key={cell.id}
                                  className="text-md whitespace-normal"
                                  style={{
                                    width: cell.column.getSize(),
                                  }}
                                >
                                  {flexRender(
                                    cell.column
                                      .columnDef.cell,
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

            }
          </div>
        </CardContent>
        <CardFooter className="flex flex-row justify-between">
          {
            // Control pagination btns
          }
          <div className="flex items-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goPreviousPage(setPagination, pagination)}
              disabled={pagination.pageIndex === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goNextPage(setPagination, pagination)}
              disabled={
                (pagination.pageIndex + 1) * pagination.pageSize >= rowCount
              }
            >
              Siguiente
            </Button>
          </div>
          <div>
            {
              loading ? <Skeleton className="w-20 h-10" />
                :
                <span className="text-sm font-bold text-zinc-500">{uiPagination.from}-{uiPagination.to} de {rowCount}</span>
            }
          </div>
        </CardFooter>
      </Card>
      <FormBitacora
        toEdit={toEdit}
        defaultData={defaultData}
        setOpen={setOpen}
        open={open}
        handleToEdit={handleToEdit}
        setDefaultData={setDefaultData}
        onSuccess={() => setManualRefresh(prev => prev + 1)}
      />
    </>
  );
}
