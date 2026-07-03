import { DateRange } from "react-day-picker";
import { DashBoardTable } from "@/types/dashboardTable";
import totalDashboard from "@/lib/toReturn/totalDashboard";
import { Dispatch, SetStateAction } from "react";

type DashboardState = {
  data: DashBoardTable[];
  total: number;
};

type DashboardGetter = (
  from: Date,
  to: Date,
) => Promise<DashBoardTable[] | null | undefined>;

type DashboardSetter = Dispatch<SetStateAction<DashboardState>>;

export const handleFetchFunction = async (
  dateRange: DateRange | undefined,
  getterFnc: DashboardGetter,
  setterFnc: DashboardSetter,
) => {
  if (dateRange?.from && dateRange.to) {
    const data = await getterFnc(dateRange.from, dateRange.to);
    if (data) {
      setterFnc({ data, total: totalDashboard(data) });
    }
  }
};
