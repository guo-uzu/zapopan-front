import { Table } from "@tanstack/react-table";
import { BitacoraRecord } from "@/types/bitacoraTable";

export const getValueFilter = (
  filterName: string,
  table: Table<BitacoraRecord>,
) => {
  return (
    (table.getState().columnFilters.find((f) => f.id === filterName)
      ?.value as string) ?? ""
  );
};
