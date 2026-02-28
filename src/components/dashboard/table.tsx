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

import { flexRender } from "@tanstack/react-table";
import type { Table as ReactTable } from "@tanstack/react-table";
import { columns } from "../columns/dashboard";
import { DashBoardTable } from "@/types/dashboardTable";

const TableDashboard = ({
  table,
  title,
  total,
  dateFrom,
  dateTo,
}: {
  table: ReactTable<DashBoardTable>;
  title: string;
  total: number;
  dateFrom: string | undefined;
  dateTo: string | undefined;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center mx-auto w-full font-black">
          {title}
        </CardTitle>
        <CardDescription className="flex gap-2 w-full justify-center  ">
          <span>
            {dateFrom || "Not date"} - {dateTo || "Not date"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="[&>div]:max-h-96 scroll-y-auto">
          <Table>
            <TableHeader className="bg-background sticky top-0">
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
            <TableFooter className="bg-background sticky bottom-0">
              <TableRow>
                <TableCell className="font-bold">
                  Total
                </TableCell>
                <TableCell className="font-bold">
                  {total}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableDashboard;
