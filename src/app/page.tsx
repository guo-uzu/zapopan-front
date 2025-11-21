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
import { getDataChartsGeneral, getPendientesUser } from "@/hooks/fetch-data"
import { Skeleton } from "@/components/ui/skeleton"


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
  date: Date
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

export const columns: ColumnDef<AreaResponsableTable>[] = [
  {
    accessorKey: "date",
    header: "Fecha",

  },
  {
    accessorKey: "area_name",
    header: "Área responsable",
  },
  {
    accessorKey: "count",
    header: "Reportes",
  }
]



export default function Home() {

  const [generalChartData, setGeneralChartData] = useState<AreaResponsableTable[]>([])
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [pendientes, setPendientes] = useState(0)
  const totalReportes = generalChartData.reduce((acc, curr) => {
    return acc + (Number(curr.count) || 0)
  }, 0)


  const table = useReactTable({
    data: generalChartData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const supabase = createClient()
  const handleFetchData = async () => {
    const data = await getDataChartsGeneral()
    if (data) setGeneralChartData(data)
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
    const data = await getPendientesUser()
  }

  useEffect(() => {
    handleFetchData()
    handleUserData()
    handlePendientes()
  }, [supabase])

  const chartConfig = {
    count: {
      label: "Reportes",
    },
  } satisfies ChartConfig

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
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col">
              <span className="text-xl">Bienvenid@</span>
              {
                !userData ?
                  <Skeleton className="bg-zinc-200/90 w-[300px] h-[40] rounded-full" />
                  :
                  <span className="font-black text-2xl">{userData.full_name}</span>
              }
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl"></div>
            <div className="bg-muted/50 aspect-video rounded-xl"></div>
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 flex flex-col gap-4 p-4 rounded-xl md:min-h-min">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <Table>
                  <TableHeader>
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
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      {/* Merge the first 2 columns (Date + Area) */}
                      <TableCell colSpan={2} className="font-bold ">
                        Total
                      </TableCell>
                      {/* Show the calculated total */}
                      <TableCell className="font-bold">
                        {totalReportes}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
              <div className="col-span-2">
                <ChartContainer config={chartConfig}>
                  <BarChart accessibilityLayer data={generalChartData}>
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
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-red-700 col-span-1 h-[600px]"></div>
              <div className="bg-red-700 col-span-2"></div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider >
  );
}
