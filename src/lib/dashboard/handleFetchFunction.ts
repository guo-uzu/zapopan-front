import { DateRange } from "react-day-picker";
import { DashBoardTable } from "@/types/dashboardTable";
import totalDashboard from "@/lib/toReturn/totalDashboard";

type DashboardGetter = (
  from: Date,
  to: Date,
) => Promise<DashBoardTable[] | null | undefined>;

export const handleFetchFunction = async (
  dateRange: DateRange | undefined,
  getterFnc: DashboardGetter,
) => {
  if (dateRange?.from && dateRange.to) {
    const data = await getterFnc(dateRange.from, dateRange.to);
    if (!data) {
      throw Error("Error not data fetch");
    }
    return { data, total: totalDashboard(data) };
  }
  return { data: [], total: 0 };
};
