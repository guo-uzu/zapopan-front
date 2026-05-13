"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { fetchBitacora } from "@/lib/data/bitacora";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  idFilter?: string | null;
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
import useBitacoraTable from "@/hooks/bitacora/useBitacoraTable";
import { BitacoraRecord } from "@/types/bitacoraTable";
import useDebouncedValue from "@/hooks/bitacora/useDebounce";
import { fetchUsersFilterBitacora } from "@/lib/data/usersFilter";
import goNextPage from "@/utils/bitacora/goNextPage";
import goPreviousPage from "@/utils/bitacora/goPreviousPage";

/**
 * @param columns are the columns of the table, coming from app/bitacora/page.tsx
 * @param idFilter is the id of the row that is selected to share with other one
 * @returns DataTable is the function that prints the table in the DOM and shows all of the rows or individually
 */

export function DataTable<TData extends BitacoraRecord, TValue>({
  columns,
  idFilter,
}: { columns: ColumnDef<BitacoraRecord, unknown>[], idFilter: string | null }) {
  const supabase = createClient();
  const [dataBitacora, setDataBitacora] = useState<TData[]>([]);
  const [open, setOpen] = useState(false);
  const [defaultData, setDefaultData] = useState({});
  const [toEdit, setToEdit] = useState<boolean>(false);
  const handleOpenForm = () => setOpen(true);
  const [usersToFilter, setUsersToFilter] = useState<{ id: string; full_name: string }[]>([]);
  const handleToEdit = () => setToEdit(prev => !prev);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [rowCount, setRowCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState<{} | BitacoraRecord>({
    account: "",
    area: "",
    status: "",
    channel: "",
    category: "",
    priority: "",
    userName: "",
    socialNetwork: "",
    dateRange: ""
  })

  const { table } = useBitacoraTable(
    dataBitacora,
    columns,
    {
      handleOpenForm,
      handleToEdit,
      setDefaultData,
    },
  );
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetchUsersFilterBitacora()
      if (data) setUsersToFilter(data)
    }
    fetchUsers()
  }, [])
  useEffect(() => {
    const data = {
      account: window.localStorage.getItem("account") ?? "",
      area: window.localStorage.getItem("area") ?? "",
      status: window.localStorage.getItem("status") ?? "",
      channel: window.localStorage.getItem("channel") ?? "",
      category: window.localStorage.getItem("category") ?? "",
      priority: window.localStorage.getItem("priority") ?? "",
      userName: window.localStorage.getItem("userName") ?? "",
      socialNetwork: window.localStorage.getItem("socialNetwork") ?? "",
      dateRange: window.localStorage.getItem("bitacora_date_range") ?? ""
    };
    setFilters(data)
  }, [])

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const debouncedGlobal = useDebouncedValue(globalFilter, 300);
  const [uiPagination, setUIPagination] = useState<{ from: number | undefined, to: number | undefined }>({
    from: undefined,
    to: undefined
  })

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
          const fetchBitacoraData = async () => {
            const { data, count, from, to } = await fetchBitacora({
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
              idFilter,
              filters,
              globalFilter: debouncedGlobal,
              dateRange,
            })
            if (data) setDataBitacora(data as TData[]);
            setRowCount(count ?? 0);
            setUIPagination({ from, to })
          }
          fetchBitacoraData()
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [pagination, filters, debouncedGlobal, dateRange, idFilter]);

  const onChangeFilter = (key: string, value: string) => {
    localStorage.setItem(key, value);
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // ← critical
  };

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
      // Optional: clear invalid data
      localStorage.removeItem("bitacora_date_range");
    }
  }, []); // Empty dependency array = runs once on mount

  useEffect(() => {
    const fetchBitacoraData = async () => {
      const { data, count, from, to } = await fetchBitacora({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        idFilter,
        filters,
        globalFilter: debouncedGlobal,
        dateRange,
      })
      if (data) setDataBitacora(data as TData[]);
      setRowCount(count ?? 0);
      setUIPagination({ from, to })
    }
    fetchBitacoraData()
  }, [pagination, filters, debouncedGlobal, dateRange, idFilter]);

  return (
    <>
      <Card className="flex flex-col h-[calc(98vh-64px)]">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <div className="flex items-center">
              <Input
                placeholder="Busca en la bitácora"
                onChange={(e) =>
                  setGlobalFilter(String(e.target.value))
                }
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center">
              <Select
                value={filters.userName !== "all" ? filters.userName : ""}
                onValueChange={(value: string) => {
                  window.localStorage.setItem("userName", value);
                  onChangeFilter("userName", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Usuarios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {usersToFilter.map((e) => (
                    <SelectItem key={`u-${e.full_name}`} value={e.id}>
                      {e.full_name}
                    </SelectItem>
                  ))}
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Select
                value={filters.account !== "all" ? filters.account : ""}
                onValueChange={(value: string) => {
                  localStorage.setItem("account", value);
                  onChangeFilter("account", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cuentas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {ColumnsBitacoraOpts.account_id.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.value}
                    </SelectItem>
                  ))}
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Select
                value={filters.area !== "all" ? filters.area : ""}
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
                  {ColumnsBitacoraOpts.area_id.map(
                    (e) => (
                      <SelectItem
                        key={e.id}
                        value={e.value}
                      >
                        {e.value}
                      </SelectItem>
                    ),
                  )}
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Select
                value={filters.channel !== "all" ? filters.channel : ""}
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
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Select
                value={filters.category !== "all" ? filters.category : ""}
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
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Select
                value={filters.socialNetwork !== "all" ? filters.socialNetwork : ""}
                onValueChange={(value: string) => {
                  localStorage.setItem(
                    "socialNetwork",
                    value,
                  );
                  onChangeFilter("socialNetwork", value);
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
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Select
                value={filters.priority !== "all" ? filters.priority : ""}
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
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Select
                value={filters.status !== "all" ? filters.status : ""}
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
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="border border-zinc-300 rounded-sm p-2 cursor-pointer">
                    <CalendarDays size={20} />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-full">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      // 1. Actualiza tu estado local para la UI
                      setDateRange(range);
                      // Opcional: Guardarlo en local storage para que persista
                      localStorage.setItem(
                        "bitacora_date_range",
                        JSON.stringify(range),
                      );
                      onChangeFilter("bitacora_date_range", JSON.stringify(range))
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
                              key={header.id}
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
        <CardFooter className="flex flex-row justify-between">
          {
            // Control pagination btns
          }
          <div className="flex items-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goPreviousPage(setPagination, pagination)}
              disabled={pagination.pageIndex === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goNextPage(setPagination, pagination)}
              disabled={
                (pagination.pageIndex + 1) * pagination.pageSize >= rowCount
              }
            >
              Siguiente
            </Button>
          </div>
          <div>
            <span className="text-sm font-bold text-zinc-500">{uiPagination.from}-{uiPagination.to} de {rowCount}</span>
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
