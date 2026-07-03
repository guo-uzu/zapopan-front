import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { DashBoardTable } from "@/types/dashboardTable";
import { handleFetchFunction } from "@/lib/dashboard/handleFetchFunction";

type DashboardState = {
  data: DashBoardTable[];
  total: number;
};

type DashboardGetter = (
  from: Date,
  to: Date,
) => Promise<DashBoardTable[] | null | undefined>;

export const useDashboardData = (
  getter: DashboardGetter,
  dateRange: DateRange | undefined,
): DashboardState => {
  const [state, setState] = useState<DashboardState>({
    data: [],
    total: 0,
  });

  useEffect(() => {
    handleFetchFunction(dateRange, getter, setState);
  }, [dateRange, getter]);

  return state;
};

export default useDashboardData;
