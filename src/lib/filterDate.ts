import { BitacoraTable } from "@/types/bitacoraTable";
import type { DateRange } from "react-day-picker";
import { Row } from "@tanstack/react-table";

export const dateRangeFilterFn = (
    row: Row<BitacoraTable>,
    columnId: string,
    filterValue: DateRange | undefined,
) => {
    // 1. Si no hay rango seleccionado, mostramos todo
    if (!filterValue || (!filterValue.from && !filterValue.to)) return true;

    // 2. Obtener el valor de la celda (gracias a tu accessorFn, ESTO YA ES UN NÚMERO en ms)
    const rowTime = row.getValue(columnId) as number | null;
    if (!rowTime) return false;

    // 3. Calcular límites
    const min = filterValue.from
        ? new Date(filterValue.from).setHours(0, 0, 0, 0)
        : -Infinity;
    const max = filterValue.to
        ? new Date(filterValue.to).setHours(23, 59, 59, 999)
        : Infinity;

    // 4. Comparar
    return rowTime >= min && rowTime <= max;
};
