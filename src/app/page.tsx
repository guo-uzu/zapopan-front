"use client";
import { columns } from "@/components/columns/dashboard";
import useDashboardTable from "@/hooks/dashboard/useDashboardTable";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useState } from "react";
import {
  getDashboardCategory,
  getDashboardAreaEstatal,
  getDashboardReportesPorDependencias,
} from "@/hooks/fetch-data";
import { subDays } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import TableDashboard from "@/components/dashboard/table";
import { DateRange } from "react-day-picker";
import { DashBoardTable } from "@/types/dashboardTable";
import ChartDashboard from "@/components/dashboard/chart";
import categoryChart from "@/lib/configs/dashboard";

import { formatDateUI } from "@/lib/formatters/date";
import DownloadChartBtn from "@/components/dashboard/download-chart-btn";
import { GlobalStadistics } from "@/components/dashboard/GlobalStadistics";
import { TodaySummaryCard } from "@/components/dashboard/TodaySummaryCard";
import { UserStadistics } from "@/components/dashboard/UserStadistics";
import { handleFetchFunction } from "@/lib/dashboard/handleFetchFunction";

export default function DashboardClients() {
  const [categoryDashboard, setCategoryDashboard] = useState<{
    data: DashBoardTable[];
    total: number;
  }>({
    data: [],
    total: 0,
  });
  const [areaEstatalDashboard, setAreaEstatalDashboard] = useState<{
    data: DashBoardTable[];
    total: number;
  }>({
    data: [],
    total: 0,
  });

  const [
    reportesPorDependenciasDashboard,
    setReportesPorDependenciasDashboard,
  ] = useState<{
    data: DashBoardTable[];
    total: number;
  }>({
    data: [],
    total: 0,
  });

  // Here is the modularized data
  const tableCategories = useDashboardTable(categoryDashboard.data, columns);
  const tableEstatal = useDashboardTable(areaEstatalDashboard.data, columns);
  const tableReportesPorDependencias = useDashboardTable(
    reportesPorDependenciasDashboard.data,
    columns,
  );
  // Here ends

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7), // 7 days ago
    to: new Date(), // Today
  });

  useEffect(() => {
    handleFetchFunction(dateRange, getDashboardCategory, setCategoryDashboard);
    handleFetchFunction(
      dateRange,
      getDashboardAreaEstatal,
      setAreaEstatalDashboard,
    );
    handleFetchFunction(
      dateRange,
      getDashboardReportesPorDependencias,
      setReportesPorDependenciasDashboard,
    );
  }, [dateRange]);

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
          {
            // Headers graphs
          }
          <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
            <TodaySummaryCard />
            <GlobalStadistics />
            <UserStadistics />
          </div>
          <div className="bg-muted/50 flex-1 flex flex-col gap-4 p-4 rounded-xl">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-x-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <CalendarDays />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full">
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
                  <DownloadChartBtn
                    data={categoryDashboard.data}
                    title="Solicitudes recibidas"
                    dateFrom={formatDateUI(dateRange?.from)}
                    dateTo={formatDateUI(dateRange?.to)}
                  />
                </div>
                <div className="flex flex-row max-h-[481px]">
                  <TableDashboard
                    title="Solicitudes recibidas"
                    table={tableCategories}
                    dateFrom={formatDateUI(dateRange?.from)}
                    dateTo={formatDateUI(dateRange?.to)}
                    total={categoryDashboard.total}
                  />
                  <ChartDashboard
                    config={categoryChart}
                    data={categoryDashboard.data}
                    title="Solicitudes recibidas"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <DownloadChartBtn
                    data={reportesPorDependenciasDashboard.data}
                    title="Reportes por dependencias"
                    dateFrom={formatDateUI(dateRange?.from)}
                    dateTo={formatDateUI(dateRange?.to)}
                  />
                </div>
                <div className="flex flex-row max-h-[481px]">
                  <TableDashboard
                    title="Reportes por dependencias"
                    table={tableReportesPorDependencias}
                    dateFrom={formatDateUI(dateRange?.from)}
                    dateTo={formatDateUI(dateRange?.to)}
                    total={reportesPorDependenciasDashboard.total}
                  />
                  <ChartDashboard
                    config={categoryChart}
                    data={reportesPorDependenciasDashboard.data}
                    title="Reportes por dependencias"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <DownloadChartBtn
                    data={areaEstatalDashboard.data}
                    title="Reportes externos"
                    dateFrom={formatDateUI(dateRange?.from)}
                    dateTo={formatDateUI(dateRange?.to)}
                  />
                </div>
                <div className="flex flex-row max-h-[481px]">
                  <TableDashboard
                    title="Reportes externos"
                    table={tableEstatal}
                    dateFrom={formatDateUI(dateRange?.from)}
                    dateTo={formatDateUI(dateRange?.to)}
                    total={areaEstatalDashboard.total}
                  />
                  <ChartDashboard
                    config={categoryChart}
                    data={areaEstatalDashboard.data}
                    title="Reportes externos"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
