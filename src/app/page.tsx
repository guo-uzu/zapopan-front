"use client"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"

import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { getDataChartsAreaEstatal, getDataChartsGeneral, getPendientesTotal, getPendientesUser } from "@/hooks/fetch-data"
import { Skeleton } from "@/components/ui/skeleton"
import { subDays } from "date-fns"

import { Pie, PieChart } from "recharts"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table"


export type AreaResponsableTable = {
  date: string
  count: number
  area_name: string // This key must match your data!
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

type UserProfile = {
  id: string
  full_name: string
  email?: string
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

// Robust parser (handles ISO strings, timestamps, Date, or nulls)
const toTimestamp = (v: unknown): number | null => {
  if (v == null) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v.getTime();
  if (typeof v === "number") return isNaN(v) ? null : v;                 // already ms
  const d = new Date(String(v));                                         // string -> Date
  return isNaN(d.getTime()) ? null : d.getTime();
};
import { Row } from "@tanstack/react-table"

export function dateRangeFilterFn<TData>(
  row: Row<TData>,
  columnId: string,
  range: DateRange | undefined
) {
  // 1. Si no hay rango seleccionado, mostrar todo
  if (!range || (!range.from && !range.to)) return true

  // 2. SOLUCIÓN A "WHOLE DATA":
  // En lugar de usar row.getValue(columnId), usamos row.original
  // para acceder al string exacto que viene de Supabase.
  // Nota: Asegúrate que 'date' sea el nombre real de tu campo en la BD.
  const rawDateString = (row.original as any).date

  if (!rawDateString) return false

  // 3. SOLUCIÓN AL "DÍA ANTERIOR":
  // Creamos la fecha, pero forzamos la interpretación "Local" de los componentes UTC.
  // Esto evita que JS le reste las 6 horas de México.
  const dateParts = new Date(rawDateString)

  // Creamos una nueva fecha usando getUTCFullYear, etc.
  // Esto crea una fecha "Local" que coincide numéricamente con la fecha UTC.
  const rowDate = new Date(
    dateParts.getUTCFullYear(),
    dateParts.getUTCMonth(),
    dateParts.getUTCDate(),
    0, 0, 0, 0
  )

  const rowTime = rowDate.getTime()

  // 4. Calcular límites (Normalizando horas para evitar errores de precisión)
  // Usamos setHours(0,0,0,0) para comparar manzanas con manzanas (días completos)
  const min = range.from ? new Date(range.from).setHours(0, 0, 0, 0) : -Infinity
  const max = range.to ? new Date(range.to).setHours(23, 59, 59, 999) : Infinity

  // 5. Comparar
  return rowTime >= min && rowTime <= max
}

export const columns: ColumnDef<AreaResponsableTable>[] = [

  {
    accessorKey: "area_name",
    header: "Área responsable",
    cell: ({ row }) => {
      return <div className="w-full whitespace-nowrap overflow-hidden truncate">{row.original.area_name}</div>
    }
  },
  {
    accessorKey: "count",
    header: "Reportes",
  },
  {
    accessorKey: "date",
    accessorFn: (row) => toTimestamp(row.date),
    header: "Date",
    filterFn: dateRangeFilterFn,
    cell: ({ row }) => {
      const rawDate = new Date(row.getValue("date"))
      const day = ("0" + rawDate.getDate()).slice(-2)
      const month = ("0" + (rawDate.getMonth() + 1)).slice(-2)
      return <div className="text-center">{day} / {month} / {rawDate.getFullYear()}</div>
    },
  }
]

import { getFilteredRowModel } from "@tanstack/react-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ColumnFilter {
  id: string
  value: unknown
}

type ColumnFiltersState = ColumnFilter[]
import { type DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

interface PendientesTotal {
  pendientesT: number | null
  resueltosT: number | null
  enProcesoT: number | null
  direccionT: number | null
}

export default function Home() {
  const [generalChartData, setGeneralChartData] = useState<AreaResponsableTable[]>([])
  const [chartAreaEstatal, setChartAreaEstatal] = useState<AreaResponsableTable[]>([])
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [pendientes, setPendientes] = useState<number | null>(null)
  const [resueltos, setResueltos] = useState<number | null>(null)
  const [enProceso, setEnProceso] = useState<number | null>(null)
  const [direccion, setDireccion] = useState<number | null>(null)
  const [pendientesTotal, setPendientesTotal] = useState<PendientesTotal>({
    pendientesT: null,
    resueltosT: null,
    enProcesoT: null,
    direccionT: null
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7), // 7 days ago
    to: new Date(), // Today
  });

  const formatDataFrom = () => {
    const day = String(dateRange?.from?.getDate()).padStart(2, "0")
    const month = dateRange?.from?.toLocaleDateString("es-MX", { month: "short" })
    return `${day}/${month}/${dateRange?.from?.getFullYear()}`
  }

  const formatDataTo = () => {
    const day = String(dateRange?.to?.getDate()).padStart(2, "0")
    const month = dateRange?.to?.toLocaleDateString("es-MX", { month: "short" })
    return `${day}/${month}/${dateRange?.to?.getFullYear()}`
  }

  const table = useReactTable({
    data: generalChartData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      columnVisibility: {
        date: false
      }
    }
  })

  const tableEstatales = useReactTable({
    data: chartAreaEstatal,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      columnVisibility: {
        date: false
      }
    }
  })

  const supabase = createClient()
  const handleFetchData = async () => {
    const data = await getDataChartsGeneral()
    if (data) setGeneralChartData(data)
  }

  const handleFetchChartAreaEstatal = async () => {
    const data = await getDataChartsAreaEstatal()
    if (data) setChartAreaEstatal(data)
  }

  const handleUserData = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) throw authError
    if (!user) return // User is not logged in

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    if (profileError) throw profileError

    // --- STEP 3: Set the Data ---
    if (profile) {
      // If they have a profile AND a name, use that
      setUserData(profile)
    } else {
      // Otherwise, just fall back to their email
      setUserData(profile.email)
    }
  }

  const handlePendientes = async () => {
    const { counts, error } = await getPendientesUser()
    if (error) {
      throw Error("Error fetching the data. Try again")
    }
    setPendientes(counts.status0)
    setEnProceso(counts.status1)
    setResueltos(counts.status2)
    setDireccion(counts.status3)
  }

  const handlePendientesTotal = async () => {
    const { counts, error } = await getPendientesTotal()
    if (error) {
      throw Error("Error fetching the data. Try again")
    }
    setPendientesTotal({
      pendientesT: counts.status0,
      enProcesoT: counts.status1,
      resueltosT: counts.status2,
      direccionT: counts.status3
    })
  }

  useEffect(() => {
    handleFetchData()
    handleFetchChartAreaEstatal()
    handleUserData()
    handlePendientes()
    handlePendientesTotal()
  }, [supabase])

  const chartConfig = {
    count: {
      label: "Reportes",
    },
  } satisfies ChartConfig

  const chartPieConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
    },
    safari: {
      label: "Safari",
    },
    firefox: {
      label: "Firefox",
      color: "var(--chart-3)",
    },
    edge: {
      label: "Edge",
      color: "var(--chart-4)",
    },
    other: {
      label: "Other",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  useEffect(() => {
    const col = table.getColumn("date");
    if (col) {
      if (!dateRange || (!dateRange.from && !dateRange.to)) {
        col.setFilterValue(undefined);
      } else {
        col.setFilterValue(dateRange);
      }
    }
  }, [dateRange, table]); // dependency on dateRange updates the table

  const filteredRows = table.getFilteredRowModel().rows;
  const totalReportes = filteredRows.reduce((acc, row) => {
    return acc + (Number(row.original.count) || 0)
  }, 0)

  useEffect(() => {
    console.log(columnFilters)
    console.log(filteredRows)
  }, [columnFilters])

  const chartData = filteredRows.map(row => row.original)

  const filteredRowsEstatales = tableEstatales.getFilteredRowModel().rows;
  const totalReportesEstatales = filteredRowsEstatales.reduce((acc, row) => {
    return acc + (Number(row.original.count) || 0)
  }, 0)
  const chartDataEstatales = filteredRowsEstatales.map(row => row.original)

  const chartPieData = [
    { status: "Pendientes", count: pendientes, fill: "oklch(79.5% 0.184 86.047)" },
    { status: "En Proceso", count: enProceso, fill: "oklch(63.7% 0.237 25.331)" },
    { status: "Resueltos", count: resueltos, fill: "oklch(72.3% 0.219 149.579)" },
    { status: "Dirección", count: direccion, fill: "oklch(70.5% 0.213 47.604)" },
  ]

  const chartPieDataTotal = [
    { status: "Pendientes", count: pendientesTotal.pendientesT, fill: "oklch(79.5% 0.184 86.047)" },
    { status: "En Proceso", count: pendientesTotal.enProcesoT, fill: "oklch(63.7% 0.237 25.331)" },
    { status: "Resueltos", count: pendientesTotal.resueltosT, fill: "oklch(72.3% 0.219 149.579)" },
    { status: "Dirección", count: pendientesTotal.direccionT, fill: "oklch(70.5% 0.213 47.604)" },
  ]
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col">
              <span className=" text-xl font-light">Bienvenid@</span>
              {
                !userData ?
                  <Skeleton className="bg-zinc-200/90 w-[300px] h-[40] rounded-full" />
                  :
                  <span className="font-black text-2xl">{userData.full_name}</span>
              }
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl p-4 h-full">
              <p className="font-light text-xl">Estatus de respuestas | Total</p>
              <div className="w-full h-full flex">
                <ChartContainer
                  config={chartPieConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie data={chartPieDataTotal} dataKey="count" nameKey="status" />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video h-full rounded-xl p-4">
              <p className="font-light text-xl">Estatus de respuestas | Individual</p>
              <div className="w-full h-full flex">
                <ChartContainer
                  config={chartPieConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie data={chartPieData} dataKey="count" nameKey="status" />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 flex flex-col gap-4 p-4 rounded-xl">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4 flex flex-col">
                <div className="flex items-center py-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant='outline' size='icon'>
                        <CalendarDays />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-full'>
                      <Calendar
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange} // Just update state, useEffect handles the rest
                        numberOfMonths={2}
                        className="rounded-lg border shadow-sm"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center mx-auto w-full font-black">Solicitudes de áreas municipales</CardTitle>
                    <CardDescription className="flex gap-2 w-full justify-center">
                      <span>{formatDataFrom()}</span>
                      <span>-</span>
                      <span>{formatDataTo()}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="max-h-[400px] overflow-y-auto">
                      <Table className="">
                        <TableHeader className="sticky h-10 top-0 z-20">
                          {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => {
                                return (
                                  <TableHead key={header.id}>
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
                                className="whitespace-nowrap overflow-hidden truncate"
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                              >
                                {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow className="sticky bottom-0 z-20 bg-background">
                              <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell className="font-bold ">Total</TableCell>
                            <TableCell className="font-bold">{totalReportes}</TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-8 flex">
                <ChartContainer config={chartConfig} className="max-h-[500px] w-full">
                  <BarChart accessibilityLayer data={chartData} >
                    <CartesianGrid vertical={true} />
                    <XAxis
                      dataKey="area_name"
                      tickLine={true}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 10)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel={false} indicator="dot" />}
                    />
                    <Bar dataKey="count" fill="oklch(70.7% 0.165 254.624)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4 flex flex-col">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center mx-auto w-full font-black">Reportes de áreas estatales</CardTitle>
                    <CardDescription className="flex gap-2 w-full justify-center">
                      <span>{formatDataFrom()}</span>
                      <span>-</span>
                      <span>{formatDataTo()}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="max-h-[400px] overflow-y-auto">
                      <Table>
                        <TableHeader className="sticky h-10 top-0 z-20">
                          {tableEstatales.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => {
                                return (
                                  <TableHead key={header.id}>
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
                          {tableEstatales.getRowModel().rows?.length ? (
                            tableEstatales.getRowModel().rows.map((row) => (
                              <TableRow
                                className="whitespace-nowrap overflow-hidden truncate"
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                              >
                                {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow className="sticky bottom-0 z-20 bg-background">
                              <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell className="font-bold ">Total</TableCell>
                            {/* This now shows the dynamic total */}
                            <TableCell className="font-bold">{totalReportesEstatales}</TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-8 flex">
                <ChartContainer config={chartConfig} className="max-h-[500px] w-full">
                  <BarChart accessibilityLayer data={chartDataEstatales} >
                    <CartesianGrid vertical={true} />
                    <XAxis
                      dataKey="area_name"
                      tickLine={true}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 10)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel={false} indicator="dot" />}
                    />
                    <Bar dataKey="count" fill="oklch(70.7% 0.165 254.624)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </div >
      </SidebarInset >
    </SidebarProvider >
  );
}
