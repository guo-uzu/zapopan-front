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

type UseDashboardDataResult = DashboardState & {
  loading: boolean;
  error: boolean;
};

export const useDashboardData = (
  getter: DashboardGetter,
  dateRange: DateRange | undefined,
): UseDashboardDataResult => {
  const [state, setState] = useState<DashboardState>({
    data: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    handleFetchFunction(dateRange, getter)
      .then(({ data, total }) => {
        setState({ data, total });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [dateRange, getter]);

  return { data: state.data, total: state.total, loading, error };
};

export default useDashboardData;
