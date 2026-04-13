import { Table } from "@tanstack/react-table";
import { BitacoraTable } from "@/types/bitacoraTable";

export const getValueFilter = (
  filterName: string,
  table: Table<BitacoraTable>,
) => {
  return (
    (table.getState().columnFilters.find((f) => f.id === filterName)
      ?.value as string) ?? ""
  );
};
