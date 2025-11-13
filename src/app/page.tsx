"use client"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"

import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { getDataChartsGeneral } from "@/hooks/fetch-data"

export default function Home() {
  const [generalChartData, setGeneralChartData] = useState<any>([])
  const supabase = createClient()
  const handleFetchData = async () => {
    const data = await getDataChartsGeneral()
    if (data) setGeneralChartData(data)
  }

  useEffect(() => {
    handleFetchData()
  }, [])

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    day_label: {
      label: "day_label",
      color: "#ff0000",
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
            <div className="bg-muted/50 aspect-video rounded-xl">
              <span className="">Bienvenid@, </span>
                
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12, right: 12
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.4}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={generalChartData}
                  margin={{
                    left: 12, right: 12
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day_label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 2)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />

                  <Area
                    dataKey="count"
                    type="natural"
                    fill="var(--color-day_label)"
                    fillOpacity={0.4}
                    stroke="var(--color-day_label)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider >
  );
}
