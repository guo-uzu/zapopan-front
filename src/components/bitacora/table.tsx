"use client";
import { useCallback, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import useBitacoraTable from "@/hooks/bitacora/useBitacoraTable";
import FormBitacora from "./form";
import { BitacoraRecord } from "@/types/bitacoraTable";
import { useBitacoraUpdateData } from "@/hooks/bitacora/useBitacoraUpdateData";
import { Inputs } from "@/hooks/types";
import { TableToolbar } from "./TableToolbar";
import { TablePagination } from "./TablePagination";
import { BitacoraTableBody } from "./BitacoraTableBody";

/**
 * @param columns are the columns of the table, coming from app/bitacora/page.tsx
 * @param idFilter is the id of the row that is selected to share with other one
 * @returns DataTable is the function that prints the table in the DOM and shows all of the rows or individually
 */

type DataTableProps = {
  idFilter: string | null;
  columns: ColumnDef<BitacoraRecord, unknown>[];
  statusFilter?: string | null;
};

export function DataTable({ columns, idFilter, statusFilter }: DataTableProps) {
  const [manualRefresh, setManualRefresh] = useState(0);

  const {
    dataBitacora,
    debouncedGlobal,
    setGlobalFilter,
    filters,
    onChangeFilter,
    dateRange,
    setDateRange,
    loading,
    pagination,
    rowCount,
    uiPagination,
    goNextPage,
    goPreviousPage,
  } = useBitacoraUpdateData(idFilter, manualRefresh, statusFilter);

  const [open, setOpen] = useState(false);
  const [defaultData, setDefaultData] = useState<Partial<Inputs>>({});
  const [toEdit, setToEdit] = useState<boolean>(false);
  const handleToEdit = () => setToEdit((prev) => !prev);
  const handleOpenForm = () => setOpen(true);

  const { table } = useBitacoraTable(dataBitacora, columns, {
    handleOpenForm,
    handleToEdit,
    setDefaultData,
    debouncedGlobal,
    setManualRefresh,
  });

  const down = useCallback((e: KeyboardEvent) => {
    if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  }, []);

  // handler Command Form
  useEffect(() => {
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [down]);

  return (
    <>
      <Card className="flex flex-col h-[calc(98vh-64px)]">
        <TableToolbar
          filters={filters}
          setGlobalFilter={setGlobalFilter}
          dateRange={dateRange}
          onChangeFilter={onChangeFilter}
          setDateRange={setDateRange}
          setOpen={setOpen}
        />
        <CardContent className="flex-1 overflow-hidden relative">
          <div className="flex h-full w-full overflow-x-auto">
            <BitacoraTableBody
              table={table}
              loading={loading}
              columns={columns}
            />
          </div>
        </CardContent>
        <TablePagination
          goPreviousPage={goPreviousPage}
          goNextPage={goNextPage}
          loading={loading}
          pagination={pagination}
          rowCount={rowCount}
          uiPagination={uiPagination}
        />
      </Card>
      <FormBitacora
        toEdit={toEdit}
        defaultData={defaultData}
        setOpen={setOpen}
        open={open}
        handleToEdit={handleToEdit}
        setDefaultData={setDefaultData}
        onSuccess={() => setManualRefresh((prev) => prev + 1)}
      />
    </>
  );
}
