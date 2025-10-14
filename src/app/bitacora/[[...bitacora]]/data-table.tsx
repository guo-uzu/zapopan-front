"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { createClient } from "@/utils/supabase/client"

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

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {

  const { userId, isLoaded } = useAuth()
  const supabase = createClient()
  const [dataFetch, setDataFetch] = useState<TData[]>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data: dataFetch,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      columnVisibility,
      columnFilters,
    }
  })

  useEffect(() => {
    handleFetchData()
  }, [])

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

  const handleFetchData = async () => {
    const { data } = await fetchData()
    if (data) setDataFetch(data as TData[])
  }

  return (
    <Card>

      <CardContent>
        <div className="flex flex-row justify-between">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filtro de nombre"
              value={(table.getColumn("link")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("link")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          {
            // Visibility component
          }
          <div>
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
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-md">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                    < TableCell key={cell.id} className="text-md" >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="">
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
  )
}
