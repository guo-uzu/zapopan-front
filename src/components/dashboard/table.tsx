import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "../ui/card";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableFooter,
} from "../ui/table";

import {
    useReactTable,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table";

import { columns } from "../columns/dashboard";
import { useState, useEffect } from "react";
import { AreaResponsableTable } from "@/types/dashboard";
import { DateRange } from "react-day-picker";

const TableDashboard = ({
    generalChartData,
    dateRange,
}: {
    generalChartData: AreaResponsableTable[];
    dateRange: DateRange | undefined;
}) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: generalChartData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        initialState: {
            columnVisibility: {
                date: false,
            },
        },
    });

    useEffect(() => {
        const col = table.getColumn("date");
        if (col) {
            if (!dateRange || (!dateRange.from && !dateRange.to)) {
                col.setFilterValue(undefined);
            } else {
                col.setFilterValue(dateRange);
            }
        }
    }, [dateRange, table]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center mx-auto w-full font-black">
                    Solicitudes recibidas
                </CardTitle>
                <CardDescription className="flex gap-2 w-full justify-center">
                    <span>-</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                        <TableHeader className="sticky h-10 top-0 z-20">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        className="whitespace-nowrap overflow-hidden truncate"
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="sticky bottom-0 z-20 bg-background">
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell className="font-bold ">
                                    Total
                                </TableCell>
                                <TableCell className="font-bold"></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default TableDashboard;
