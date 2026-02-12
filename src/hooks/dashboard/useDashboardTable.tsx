import { DashBoardTable } from "@/types/dashboardTable";

import {
    useReactTable,
    ColumnDef,
    getCoreRowModel,
    Table,
} from "@tanstack/react-table";

const useDashboardTable = (
    data: DashBoardTable[],
    columns: ColumnDef<DashBoardTable>[],
): Table<DashBoardTable> => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return table;
};

export default useDashboardTable;
