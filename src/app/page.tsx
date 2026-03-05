"use client";
import { columns } from "@/components/columns/dashboard";
import useDashboardTable from "@/hooks/dashboard/useDashboardTable";
import { handleFetchPng } from "@/hooks/fetch-data";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";

import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import {
  getDashboardCategory,
  getPendientesTotal,
  getPendientesUser,
  getDashboardAreaEstatal,
  getDashboardReportesPorDependencias,
} from "@/hooks/fetch-data";
import { Skeleton } from "@/components/ui/skeleton";
import { subDays } from "date-fns";
import { Pie, PieChart } from "recharts";

type UserProfile = {
  id: string;
  full_name: string;
  email?: string;
};

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
import totalDashboard from "@/lib/toReturn/totalDashboard";
import ChartDashboard from "@/components/dashboard/chart";
import categoryChart from "@/lib/configs/dashboard";

interface PendientesTotal {
  pendientesT: number | null;
  resueltosT: number | null;
  enProcesoT: number | null;
  direccionT: number | null;
}

import { formatDateUI } from "@/lib/formatters/date";
import useExportPng from "@/hooks/dashboard/useExportPng";
import DownloadChartBtn from "@/components/dashboard/download-chart-btn";

export default function Home() {
  const supabase = createClient();

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
  const [reportesPorDependenciasDashboard, setReportesPorDependenciasDashboard] = useState<{
    data: DashBoardTable[];
    total: number;
  }>({
    data: [],
    total: 0,
  });

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [pendientes, setPendientes] = useState<number | null>(null);
  const [resueltos, setResueltos] = useState<number | null>(null);
  const [enProceso, setEnProceso] = useState<number | null>(null);
  const [direccion, setDireccion] = useState<number | null>(null);
  const [pendientesTotal, setPendientesTotal] = useState<PendientesTotal>({
    pendientesT: null,
    resueltosT: null,
    enProcesoT: null,
    direccionT: null,
  });

  const handleUserData = async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) return;

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profileError) throw profileError;

    // --- STEP 3: Set the Data ---
    if (profile) {
      // If they have a profile AND a name, use that
      setUserData(profile);
    } else {
      // Otherwise, just fall back to their email
      setUserData(profile.email);
    }
  };

  const handlePendientes = async () => {
    const { counts, error } = await getPendientesUser();
    if (error) {
      throw Error("Error fetching the data. Try again");
    }
    setPendientes(counts.status0);
    setEnProceso(counts.status1);
    setResueltos(counts.status2);
    setDireccion(counts.status3);
  };

  const handlePendientesTotal = async () => {
    const { counts, error } = await getPendientesTotal();
    if (error) {
      throw Error("Error fetching the data. Try again");
    }
    setPendientesTotal({
      pendientesT: counts.status0,
      enProcesoT: counts.status1,
      resueltosT: counts.status2,
      direccionT: counts.status3,
    });
  };

  useEffect(() => {
    handleFetchData();
    handleUserData();
    handlePendientes();
    handlePendientesTotal();
  }, [supabase]);

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
  } satisfies ChartConfig;
  // Here is the modularized data
  const tableCategories = useDashboardTable(categoryDashboard.data, columns);
  const tableEstatal = useDashboardTable(areaEstatalDashboard.data, columns);
  const tableReportesPorDependencias = useDashboardTable(reportesPorDependenciasDashboard.data, columns);
  // Here ends

  const chartPieData = [
    {
      status: "Pendientes",
      count: pendientes,
      fill: "oklch(79.5% 0.184 86.047)",
    },
    {
      status: "En Proceso",
      count: enProceso,
      fill: "oklch(63.7% 0.237 25.331)",
    },
    {
      status: "Resueltos",
      count: resueltos,
      fill: "oklch(72.3% 0.219 149.579)",
    },
    {
      status: "Dirección",
      count: direccion,
      fill: "oklch(70.5% 0.213 47.604)",
    },
  ];

  const chartPieDataTotal = [
    {
      status: "Pendientes",
      count: pendientesTotal.pendientesT,
      fill: "oklch(79.5% 0.184 86.047)",
    },
    {
      status: "En Proceso",
      count: pendientesTotal.enProcesoT,
      fill: "oklch(63.7% 0.237 25.331)",
    },
    {
      status: "Resueltos",
      count: pendientesTotal.resueltosT,
      fill: "oklch(72.3% 0.219 149.579)",
    },
    {
      status: "Dirección",
      count: pendientesTotal.direccionT,
      fill: "oklch(70.5% 0.213 47.604)",
    },
  ];
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7), // 7 days ago
    to: new Date(), // Today
  });

  const handleFetchData = async () => {
    if (dateRange?.from && dateRange.to) {
      const data = await getDashboardCategory(
        dateRange?.from,
        dateRange?.to,
      );
      if (data) {
        setCategoryDashboard({ data, total: totalDashboard(data) });
      }
    }
  };

  const handleFetchAreaEstatalData = async () => {
    if (dateRange?.from && dateRange.to) {
      const data = await getDashboardAreaEstatal(
        dateRange?.from,
        dateRange?.to,
      );
      if (data) {
        setAreaEstatalDashboard({ data, total: totalDashboard(data) });
      }
    }
  };

  const handleFetchReportesPorDependencia = async () => {
    if (dateRange?.from && dateRange.to) {
      const data = await getDashboardReportesPorDependencias(
        dateRange?.from,
        dateRange?.to,
      );
      if (data) {
        setReportesPorDependenciasDashboard({ data, total: totalDashboard(data) });
      }
    }
  };

  useEffect(() => {
    handleFetchData();
    handleFetchAreaEstatalData()
    handleFetchReportesPorDependencia()
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
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col">
              <span className=" text-xl font-light">
                Bienvenid@
              </span>
              {!userData ? (
                <Skeleton className="bg-zinc-200/90 w-[300px] h-[40] rounded-full" />
              ) : (
                <span className="font-black text-2xl">
                  {userData.full_name}
                </span>
              )}
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl p-4 h-full">
              <p className="font-light text-xl">
                Estatus de respuestas | Total
              </p>
              <div className="w-full h-full flex">
                <ChartContainer
                  config={chartPieConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                        />
                      }
                    />
                    <Pie
                      data={chartPieDataTotal}
                      dataKey="count"
                      nameKey="status"
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video h-full rounded-xl p-4">
              <p className="font-light text-xl">
                Estatus de respuestas | Individual
              </p>
              <div className="w-full h-full flex">
                <ChartContainer
                  config={chartPieConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                        />
                      }
                    />
                    <Pie
                      data={chartPieData}
                      dataKey="count"
                      nameKey="status"
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
          </div>
          {
            // Content
          }
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
                  <DownloadChartBtn data={categoryDashboard.data} title="Solicitudes recibidas" dateFrom={formatDateUI(dateRange?.from)} dateTo={formatDateUI(dateRange?.to)} />
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
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <DownloadChartBtn data={reportesPorDependenciasDashboard.data} title="Reportes por dependencias" />
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
                  />
                </div>
              </div>
              <div className="flex flex-col gap-41">
                <div>
                  <DownloadChartBtn data={areaEstatalDashboard.data} title="Reportes externos" />
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
