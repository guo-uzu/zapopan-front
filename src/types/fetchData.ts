import { DateRange } from "react-day-picker";

interface Filters { account: string; area: string; status: string; channel: string; category: string; priority: string; userName: string; socialNetwork: string; dateRange: string; }
interface FetchData {
  pageIndex: number;
  pageSize: number;
  idFilter?: string | null;
  filters: Filters;
  globalFilter: string;
  dateRange: DateRange | undefined;
  signal: AbortSignal
}

export type { FetchData, Filters };
