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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
}
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
interface ColumnFilter {
  id: string,
  value: unknown
}
type ColumnFilterState = ColumnFilter[]

import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns"

import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays, InfoIcon, Settings2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {

  const { userId, isLoaded } = useAuth()
  const supabase = createClient()
  const [dataFetch, setDataFetch] = useState<TData[]>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState<any>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFilterState>([])
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
      globalFilter,
      columnFilters
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters
  })
  console.log(table.getState().columnFilters)
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

  const getValueFilter = (filterName: string) => (table.getState().columnFilters.find(f => f.id === filterName)?.value as string) ?? ""
  const onChangeFilter = (filterName: string, value: string) => {
    const columnId = filterName;
    if (!value || value === "all") {
      table.setColumnFilters(old => old.filter(f => f.id !== columnId));
    } else {
      table.setColumnFilters(old => {
        const others = old.filter(f => f.id !== columnId);
        return [...others, { id: columnId, value }];
      });
    }
  }

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex flex-row justify-between">
            {
              // filters
            }
            <div className="flex flex-row gap-2">
              <div className="flex items-center py-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='outline' size='icon'>
                      <InfoIcon />
                      <span className='sr-only'>About Shadcn Studio</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-80'>
                    <div className='grid gap-4'>
                      <div className='space-y-1.5 text-center'>
                        <div className='text-lg font-semibold'>About Shadcn Studio</div>
                        <p className='text-muted-foreground text-sm'>
                          Welcome to Shadcn Studio — your toolkit for building sleek, customizable UI components with ease!
                        </p>
                      </div>
                      <Button size='sm' asChild>
                        <a
                          href='https://shadcnstudio.com/docs/getting-started/introduction'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Learn More
                        </a>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="icon" variant="outline">
                      <CalendarDays />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-80' data-side="right">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range);
                        const col = table.getColumn("created_at");
                        if (!col) return;
                        // Store the DateRange object in the column filter
                        if (!range || (!range.from && !range.to)) col.setFilterValue(undefined);
                        else col.setFilterValue(range);
                      }}
                      numberOfMonths={2}
                      className="rounded-lg border shadow-sm bg-red-500"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center py-4">
                <Input
                  placeholder="Busca en la bitácora"
                  onChange={e => table.setGlobalFilter(String(e.target.value))}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center py-4">
                <Select
                  value={getValueFilter("account name")}
                  onValueChange={(value: string) => onChangeFilter("account name", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cuentas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {
                      ColumnsBitacoraOpts.account.map((e) => (
                        <SelectItem value={e.value}>{e.value}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center py-4">
                <Select
                  value={getValueFilter("area")}
                  onValueChange={(value: string) => onChangeFilter("area", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {
                      ColumnsBitacoraOpts.area_responsable.map((e) => (
                        <SelectItem value={e.value}>{e.value}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center py-4">
                <Select
                  value={getValueFilter("channel")}
                  onValueChange={(value: string) => onChangeFilter("channel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {
                      ColumnsBitacoraOpts.channel.map((e) => (
                        <SelectItem value={e.value}>{e.value}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center py-4">
                <Select
                  value={getValueFilter("category")}
                  onValueChange={(value: string) => onChangeFilter("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {
                      ColumnsBitacoraOpts.category.map((e) => (
                        <SelectItem value={e.value}>{e.value}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center py-4">
                <Select
                  value={getValueFilter("priority")}
                  onValueChange={(value: string) => onChangeFilter("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {
                      ColumnsBitacoraOpts.priority.map((e) => (
                        <SelectItem value={e.value}>{e.value}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center py-4">
                <Select
                  value={getValueFilter("status")}
                  onValueChange={(value: string) => onChangeFilter("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {
                      ColumnsBitacoraOpts.status.map((e) => (
                        <SelectItem value={e.value}>{e.value}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                      < TableCell key={cell.id} className="text-md whitespace-normal break-all" style={{ width: cell.column.getSize() }}>
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
      </Card >
      <Sheet open={open} onOpenChange={setOpen} >
        <SheetContent side="right" className="overflow-y-scroll overflow-x-hidden max-w-[40rem]!">
          <Form />
        </SheetContent>
      </Sheet>
    </>
  )
}
