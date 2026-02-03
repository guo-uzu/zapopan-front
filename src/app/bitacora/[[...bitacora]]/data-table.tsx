"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    VisibilityState,
    getFilteredRowModel,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { fetchData } from "@/hooks/fetch-data";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    idFilter?: string | null;
}

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
interface ColumnFilter {
    id: string;
    value: unknown;
}
type ColumnFilterState = ColumnFilter[];

import {
    ColumnsBitacoraOpts,
    UsersFormatFilterBitacora,
} from "@/hooks/dataBitacoraColumns";

import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import FormBitacora from "./form";

export function DataTable<TData, TValue>({
    columns,
    idFilter,
}: DataTableProps<TData, TValue>) {
    const supabase = createClient();
    const [dataFetch, setDataFetch] = useState<TData[]>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [globalFilter, setGlobalFilter] = useState<unknown>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFilterState>([]);
    const [open, setOpen] = useState(false);
    const [defaultData, setDefaultData] = useState({});
    const [toEdit, setToEdit] = useState<boolean>(false);
    const [usersToFilter, setUsersToFilter] = useState<
        { id: string; label: string; value: string }[]
    >([]);

    const handleOpenForm = () => {
        setOpen(true);
    };

    const handleToEdit = () => {
        setToEdit(!toEdit);
    };

    const table = useReactTable({
        data: dataFetch,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: "includesString",
        columnResizeMode: "onChange",
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        initialState: {
            pagination: {
                pageSize: 50,
            },
        },
        state: {
            columnVisibility,
            globalFilter,
            columnFilters,
        },
        meta: {
            handleOpenForm,
            setDefaultData,
            handleToEdit,
        },
    });
    // handler Command Form
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Fetch data
    useEffect(() => {
        handleFetchData();
    }, [idFilter]);

    const handleFetchData = async () => {
        const { data } = await fetchData(idFilter);
        if (data) setDataFetch(data as TData[]);
    };

    // Realtime updates
    useEffect(() => {
        const subscription = supabase
            .channel("changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bitacora",
                },
                () => {
                    handleFetchData();
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const getValueFilter = (filterName: string) =>
        (table.getState().columnFilters.find((f) => f.id === filterName)
            ?.value as string) ?? "";
    const onChangeFilter = (filterName: string, value: string) => {
        const columnId = filterName;
        if (!value || value === "all") {
            table.setColumnFilters((old) =>
                old.filter((f) => f.id !== columnId),
            );
        } else {
            table.setColumnFilters((old) => {
                const others = old.filter((f) => f.id !== columnId);
                return [...others, { id: columnId, value }];
            });
        }
    };

    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );

    useEffect(() => {
        try {
            const localStorageData = localStorage.getItem("account name");
            if (localStorageData) {
                onChangeFilter("account name", localStorageData);
            } else {
                throw Error("Account no se encontró");
            }
        } catch (error) {
            onChangeFilter("account name", "all");
        }
    }, []);

    useEffect(() => {
        try {
            const localStorageData = localStorage.getItem("area");
            if (localStorageData) {
                onChangeFilter("area", localStorageData);
            } else {
                throw Error("Account no se encontró");
            }
        } catch (error) {
            onChangeFilter("area", "all");
        }
    }, []);

    useEffect(() => {
        try {
            const localStorageData = localStorage.getItem("channel");
            if (localStorageData) {
                onChangeFilter("channel", localStorageData);
            } else {
                throw Error("Account no se encontró");
            }
        } catch (error) {
            onChangeFilter("channel", "all");
        }
    }, []);

    useEffect(() => {
        try {
            const localStorageData = localStorage.getItem("category");
            if (localStorageData) {
                onChangeFilter("category", localStorageData);
            } else {
                throw Error("Account no se encontró");
            }
        } catch (error) {
            onChangeFilter("category", "all");
        }
    }, []);
    useEffect(() => {
        try {
            const localStorageData = localStorage.getItem("redes sociales");
            if (localStorageData) {
                onChangeFilter("redes sociales", localStorageData);
            } else {
                throw Error("Account no se encontró");
            }
        } catch (error) {
            onChangeFilter("redes sociales", "all");
        }
    }, []);

    useEffect(() => {
        try {
            const localStorageData = localStorage.getItem("priority");
            if (localStorageData) {
                onChangeFilter("priority", localStorageData);
            } else {
                throw Error("Account no se encontró");
            }
        } catch (error) {
            onChangeFilter("priority", "all");
        }
    }, []);

    useEffect(() => {
        try {
            const localStorageData = localStorage.getItem("status");
            if (localStorageData) {
                onChangeFilter("status", localStorageData);
            } else {
                throw Error("Account no se encontró");
            }
        } catch (error) {
            onChangeFilter("status", "all");
        }
    }, []);

    useEffect(() => {
        try {
            const localStorageData = localStorage.getItem("status");
            if (localStorageData) {
                onChangeFilter("status", localStorageData);
            } else {
                throw Error("Account no se encontró");
            }
        } catch (error) {
            onChangeFilter("status", "all");
        }
    }, []);

    useEffect(() => {
        try {
            const localStorageData = localStorage.getItem("user name");
            if (localStorageData) {
                onChangeFilter("user name", localStorageData);
            } else {
                throw Error("Account no se encontró");
            }
        } catch (error) {
            onChangeFilter("user name", "all");
        }
    }, []);

    useEffect(() => {
        try {
            const storedDate = localStorage.getItem("bitacora_date_range");

            if (storedDate) {
                const parsed = JSON.parse(storedDate);

                // ⚠️ CRITICAL STEP: Convert the strings back to Date objects
                const restoredRange = {
                    from: parsed.from ? new Date(parsed.from) : undefined,
                    to: parsed.to ? new Date(parsed.to) : undefined,
                };

                // 1. Update State
                setDateRange(restoredRange);

                // 2. Update Table Filter immediately
                const col = table.getColumn("created_at"); // Make sure this ID matches your column def
                if (col) col.setFilterValue(restoredRange);
            }
        } catch (error) {
            console.error("Error loading date from local storage", error);
            // Optional: clear invalid data
            localStorage.removeItem("bitacora_date_range");
        }
    }, []); // Empty dependency array = runs once on mount

    useEffect(() => {
        const handlerUsersFilter = async () => {
            setUsersToFilter(await UsersFormatFilterBitacora());
        };
        handlerUsersFilter();
    }, []);

    return (
        <>
            <Card className="flex flex-col h-[calc(98vh-64px)]">
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex flex-row gap-2">
                        <div className="flex items-center">
                            <Input
                                placeholder="Busca en la bitácora"
                                onChange={(e) =>
                                    table.setGlobalFilter(
                                        String(e.target.value),
                                    )
                                }
                                className="max-w-sm"
                            />
                        </div>
                        <div className="flex items-center">
                            <Select
                                value={getValueFilter("user name")}
                                onValueChange={(value: string) => {
                                    localStorage.setItem("user name", value);
                                    onChangeFilter("user name", value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Usuarios" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {usersToFilter.map((e) => (
                                        <SelectItem key={e.id} value={e.value}>
                                            {e.value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center">
                            <Select
                                value={getValueFilter("account name")}
                                onValueChange={(value: string) => {
                                    localStorage.setItem("account name", value);
                                    onChangeFilter("account name", value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Cuentas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {ColumnsBitacoraOpts.account.map((e) => (
                                        <SelectItem key={e.id} value={e.value}>
                                            {e.value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center">
                            <Select
                                value={getValueFilter("area")}
                                onValueChange={(value: string) => {
                                    localStorage.setItem("area", value);
                                    onChangeFilter("area", value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Area" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {ColumnsBitacoraOpts.area_responsable.map(
                                        (e) => (
                                            <SelectItem
                                                key={e.id}
                                                value={e.value}
                                            >
                                                {e.value}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center">
                            <Select
                                value={getValueFilter("channel")}
                                onValueChange={(value: string) => {
                                    localStorage.setItem("channel", value);
                                    onChangeFilter("channel", value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Canal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {ColumnsBitacoraOpts.channel.map((e) => (
                                        <SelectItem key={e.id} value={e.value}>
                                            {e.value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center">
                            <Select
                                value={getValueFilter("category")}
                                onValueChange={(value: string) => {
                                    localStorage.setItem("category", value);
                                    onChangeFilter("category", value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {ColumnsBitacoraOpts.category.map((e) => (
                                        <SelectItem key={e.id} value={e.value}>
                                            {e.value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center">
                            <Select
                                value={getValueFilter("redes sociales")}
                                onValueChange={(value: string) => {
                                    localStorage.setItem(
                                        "redes sociales",
                                        value,
                                    );
                                    onChangeFilter("redes sociales", value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Redes sociales" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {ColumnsBitacoraOpts.social_network.map(
                                        (e) => (
                                            <SelectItem
                                                key={e.id}
                                                value={e.value}
                                            >
                                                {e.value}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center">
                            <Select
                                value={getValueFilter("priority")}
                                onValueChange={(value: string) => {
                                    localStorage.setItem("priority", value);
                                    onChangeFilter("priority", value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {ColumnsBitacoraOpts.priority.map((e) => (
                                        <SelectItem key={e.id} value={e.value}>
                                            {e.value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center">
                            <Select
                                value={getValueFilter("status")}
                                onValueChange={(value: string) => {
                                    localStorage.setItem("status", value);
                                    onChangeFilter("status", value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Estatus" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {ColumnsBitacoraOpts.status.map((e) => (
                                        <SelectItem key={e.id} value={e.value}>
                                            {e.value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <CalendarDays />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full">
                                    <Calendar
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={(range) => {
                                            // 1. Update React State
                                            setDateRange(range);

                                            // 2. Update Table Filter
                                            const col =
                                                table.getColumn("created_at");
                                            if (col) {
                                                if (
                                                    !range ||
                                                    (!range.from && !range.to)
                                                ) {
                                                    col.setFilterValue(
                                                        undefined,
                                                    );
                                                } else {
                                                    col.setFilterValue(range);
                                                }
                                            }

                                            // 3. SAVE TO LOCAL STORAGE
                                            if (range) {
                                                // JSON.stringify automatically converts Dates to ISO strings
                                                localStorage.setItem(
                                                    "bitacora_date_range",
                                                    JSON.stringify(range),
                                                );
                                            } else {
                                                // If user cleared the date, remove from storage
                                                localStorage.removeItem(
                                                    "bitacora_date_range",
                                                );
                                            }
                                        }}
                                        numberOfMonths={2}
                                        className="rounded-lg border shadow-sm"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {
                        // Container right corner card
                    }
                    <div className="flex flex-row items-center gap-4">
                        {
                            // Command trigger draw (form)
                        }
                        <div>
                            <p className="text-muted-foreground text-sm">
                                Formulario{" "}
                                <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                                    <span className="text-xs">⌘</span>J
                                </kbd>
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden relative">
                    <div className="flex h-full w-full overflow-x-auto">
                        <Table
                            className="table-fixed"
                            style={{ width: table.getCenterTotalSize() }}
                        >
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    className="group/head relative h-10 select-none last:[&>.cursor-col-resize]:opacity-0 text-sm bg-zinc-50"
                                                    {...{
                                                        colSpan: header.colSpan,
                                                        style: {
                                                            width: header.getSize(),
                                                        },
                                                    }}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext(),
                                                          )}
                                                    {header.column.getCanResize() && (
                                                        <div
                                                            {...{
                                                                onDoubleClick:
                                                                    () =>
                                                                        header.column.resetSize(),
                                                                onMouseDown:
                                                                    header.getResizeHandler(),
                                                                onTouchStart:
                                                                    header.getResizeHandler(),
                                                                className:
                                                                    "group-last/head:hidden absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:translate-x-px",
                                                            }}
                                                        />
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
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                "selected"
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="text-md whitespace-normal"
                                                        style={{
                                                            width: cell.column.getSize(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="text-center"
                                        >
                                            Cargando datos...
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter>
                    {
                        // Control pagination btns
                    }
                    <div className="flex items-end space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Siguiente
                        </Button>
                    </div>
                </CardFooter>
            </Card>
            <FormBitacora
                toEdit={toEdit}
                defaultData={defaultData}
                setOpen={setOpen}
                open={open}
                handleToEdit={handleToEdit}
                setDefaultData={setDefaultData}
            />
        </>
    );
}
