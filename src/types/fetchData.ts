interface DateRange {
    from: Date;
    to: Date;
}

interface FetchData {
    pageIndex: number;
    pageSize: number;
    idFilter: string;
    filters: string[];
    globalFilter: string;
    dateRange: DateRange;
}

export type { FetchData };
