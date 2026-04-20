/**
 * @import Dispatch, SetStateAction, useState are types and a hook to describe that wer're using or recieving an useState hook
 * @import BitacoraTable are the types of Bitacora
 * @import useReact, ColumnDef, ... are parts of tanstack library to use them in filters, visibility and basically certain actions of the table
 * @param data is the data fetched from supabase of the bitacora
 * @param columns are the columns that is defined in columns/bitacora.tsx.
 * @returns useBitacoraTable a custom hook to create the table and mantain the whole table in one place
 */

import { Dispatch, SetStateAction, useState } from "react";
import { BitacoraTable } from "@/types/bitacoraTable";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  VisibilityState,
} from "@tanstack/react-table";

interface ColumnFilter {
  id: string;
  value: unknown;
}
type ColumnFilterState = ColumnFilter[];
const useBitacoraTable = (
  data: BitacoraTable[],
  columns: ColumnDef<BitacoraTable>[],
  meta: {
    handleToEdit: () => void;
    handleOpenForm: () => void;
    setDefaultData: Dispatch<SetStateAction<{}>>;
  },
) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    {},
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFilterState>([]);

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: "includesString",
    columnResizeMode: "onChange",
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnVisibility,
      columnFilters,
    },
    meta,
    manualPagination: true,
    manualFiltering: true,
  });
  return { table };
};

export default useBitacoraTable;
