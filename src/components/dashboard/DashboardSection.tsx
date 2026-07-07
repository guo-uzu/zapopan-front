import { DashBoardTable } from "@/types/dashboardTable";
import useDashboardTable from "@/hooks/dashboard/useDashboardTable";
import TableDashboard from "@/components/dashboard/table";
import ChartDashboard from "@/components/dashboard/chart";
import DownloadChartBtn from "@/components/dashboard/download-chart-btn";
import categoryChart from "@/lib/configs/dashboard";
import { Skeleton } from "../ui/skeleton";

type DashboardSectionProps = {
  title: string;
  data: DashBoardTable[];
  table: ReturnType<typeof useDashboardTable>;
  total: number;
  dateFrom: string | undefined;
  dateTo: string | undefined;
  loading: boolean;
  error: boolean;
};

export function DashboardSection({
  title,
  data,
  table,
  total,
  dateFrom,
  dateTo,
  loading,
  error,
}: DashboardSectionProps) {
  if (loading)
    return (
      <div className="w-full h-96 flex gap-x-10">
        <Skeleton className="w-[481px] h-full" />
        <Skeleton className="w-full h-full" />
      </div>
    );
  if (error)
    return (
      <div>
        Error obteniendo los datos. Recargue la pagina o avise a un
        administrador.(╥﹏╥)
      </div>
    );
  return (
    <div className="flex flex-col gap-4">
      <div>
        <DownloadChartBtn
          data={data}
          title={title}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      </div>
      <div className="flex flex-row max-h-[481px]">
        <TableDashboard
          title={title}
          table={table}
          dateFrom={dateFrom}
          dateTo={dateTo}
          total={total}
        />
        <ChartDashboard config={categoryChart} data={data} title={title} />
      </div>
    </div>
  );
}
