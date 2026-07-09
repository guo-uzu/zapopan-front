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
import { getDashboardCategory } from "@/hooks/fetch-data";
import { subDays } from "date-fns";

import { getDashboardAreaEstatal } from "@/lib/dashboard/getDashboardAreaEstatal";
import { getDashboardReportesPorDependencias } from "@/lib/dashboard/getDashboardReportesPorDependencia";

import { formatDateUI } from "@/lib/formatters/date";
import { GlobalStadistics } from "@/components/dashboard/GlobalStadistics";
import { TodaySummaryCard } from "@/components/dashboard/TodaySummaryCard";
import { UserStadistics } from "@/components/dashboard/UserStadistics";
import useDashboardData from "@/hooks/dashboard/useDashboardData";
import { CalendarSearch } from "@/components/dashboard/calendar";
import { useDateRange } from "@/hooks/dashboard/useDateRange";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default function DashboardClients() {
  const { dateRange, setDateRange } = useDateRange({
    defaultFrom: subDays(new Date(), 7),
  });

  const dateFrom = formatDateUI(dateRange?.from);
  const dateTo = formatDateUI(dateRange?.to);

  const categoryDashboard = useDashboardData(getDashboardCategory, dateRange);
  const areaEstatalDashboard = useDashboardData(
    getDashboardAreaEstatal,
    dateRange,
  );
  const reportesPorDependenciasDashboard = useDashboardData(
    getDashboardReportesPorDependencias,
    dateRange,
  );

  const tableCategories = useDashboardTable(categoryDashboard.data, columns);
  const tableEstatal = useDashboardTable(areaEstatalDashboard.data, columns);

  const tableReportesPorDependencias = useDashboardTable(
    reportesPorDependenciasDashboard.data,
    columns,
  );

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
            <TodaySummaryCard />
            <GlobalStadistics />
            <UserStadistics />
          </div>
          <div className="bg-muted/50 flex-1 flex flex-col gap-4 p-4 rounded-xl">
            <div className="flex flex-col gap-10">
              <div className="flex gap-x-2 items-center">
                <CalendarSearch dateRange={dateRange} onSelect={setDateRange} />
                <p className="text-sm text-black/60">Cambia la fecha</p>
              </div>
              <DashboardSection
                title="Solicitudes recibidas"
                data={categoryDashboard.data}
                table={tableCategories}
                total={categoryDashboard.total}
                dateFrom={dateFrom}
                dateTo={dateTo}
                loading={categoryDashboard.loading}
                error={categoryDashboard.error}
              />
              <DashboardSection
                title="Reportes por dependencias"
                data={reportesPorDependenciasDashboard.data}
                table={tableReportesPorDependencias}
                total={reportesPorDependenciasDashboard.total}
                dateFrom={dateFrom}
                dateTo={dateTo}
                loading={reportesPorDependenciasDashboard.loading}
                error={reportesPorDependenciasDashboard.error}
              />
              <DashboardSection
                title="Reportes externos"
                data={areaEstatalDashboard.data}
                table={tableEstatal}
                total={areaEstatalDashboard.total}
                dateFrom={dateFrom}
                dateTo={dateTo}
                loading={areaEstatalDashboard.loading}
                error={areaEstatalDashboard.error}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

