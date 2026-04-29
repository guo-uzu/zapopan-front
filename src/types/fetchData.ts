import { Dispatch, SetStateAction } from "react";
import { DateRange } from "react-day-picker";

interface FetchData {
    pageIndex: number;
    pageSize: number;
    idFilter?: string;
    filters: string[];
    globalFilter: string;
    dateRange: Dispatch<SetStateAction<DateRange | undefined>>;
}

export type { FetchData };
