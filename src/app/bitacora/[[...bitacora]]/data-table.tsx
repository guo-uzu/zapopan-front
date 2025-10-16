"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { createClient } from "@/utils/supabase/client"
import Form from "./form"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  VisibilityState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { fetchData } from "@/hooks/fetch-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
}
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"


export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {

  const { userId, isLoaded } = useAuth()
  const supabase = createClient()
  const [dataFetch, setDataFetch] = useState<TData[]>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState<any>([])
  const [open, setOpen] = useState(false)


  const table = useReactTable({
    data: dataFetch,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    columnResizeMode: 'onChange',
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      columnVisibility,
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,

  })
  // handler Command Form
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])


  // Fetch data
  useEffect(() => {
    handleFetchData()
  }, [])

  const handleFetchData = async () => {
    const { data } = await fetchData()
    if (data) setDataFetch(data as TData[])
  }

  // Realtime updates
  useEffect(() => {
    if (!isLoaded || !userId) return
    const subscription = supabase
      .channel("changes")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "bitacora"
      }, () => {
        handleFetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [isLoaded, userId])

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex flex-row justify-between">
            <div className="flex items-center py-4">
              <Input
                placeholder="Busca en la bitácora"
                onChange={e => table.setGlobalFilter(String(e.target.value))}
                className="max-w-sm"
              />
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
                  Formulario {" "}
                  <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                    <span className="text-xs">⌘</span>J
                  </kbd>
                </p>
              </div>
              {
                // Visibility component
              }
              <div className="flex items-center py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto hidden h-8 lg:flex"
                    >
                      <Settings2 />
                      Vistas
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-full">
                    <DropdownMenuLabel>Oculta/Muestra columnas</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {table
                      .getAllColumns()
                      .filter(
                        (column) =>
                          typeof column.accessorFn !== "undefined" && column.getCanHide()
                      )
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          {
            // Table component
          }
          <Table className="table-fixed" style={{ width: table.getCenterTotalSize() }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="group/head relative h-10 select-none last:[&>.cursor-col-resize]:opacity-0 text-md"
                        {...{
                          colSpan: header.colSpan,
                          style: {
                            width: header.getSize()
                          }
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        {header.column.getCanResize() && (
                          <div
                            {...{
                              onDoubleClick: () => header.column.resetSize(),
                              onMouseDown: header.getResizeHandler(),
                              onTouchStart: header.getResizeHandler(),
                              className:
                                'group-last/head:hidden absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:translate-x-px'
                            }}
                          />
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      < TableCell key={cell.id} className="text-md whitespace-normal break-all" style={{ width: cell.column.getSize() }} >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center" >
                    Cargando datos...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {
            // Control pagination btns
          }
          <div className="flex items-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </CardContent>
      </Card>
      <Sheet open={open} onOpenChange={setOpen} >
        <SheetContent side="right" className="overflow-y-scroll overflow-x-hidden max-w-[40rem]!">
          <Form />
        </SheetContent>
      </Sheet>
    </>
  )
}
