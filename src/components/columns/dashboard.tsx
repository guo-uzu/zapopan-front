import { Row, ColumnDef } from "@tanstack/react-table";
import { type DateRange } from "react-day-picker";
import { DashBoardTable } from "@/types/dashboardTable";

export function dateRangeFilterFn<TData>(
  row: Row<TData>,
  range: DateRange | undefined,
) {
  // 1. Si no hay rango seleccionado, mostrar todo
  if (!range || (!range.from && !range.to)) return true;

  // 2. SOLUCIÓN A "WHOLE DATA":
  // En lugar de usar row.getValue(columnId), usamos row.original
  // para acceder al string exacto que viene de Supabase.
  // Nota: Asegúrate que 'date' sea el nombre real de tu campo en la BD.
  const rawDateString = (row.original as any).date;
  if (!rawDateString) return false;
  // 3. SOLUCIÓN AL "DÍA ANTERIOR":
  // Creamos la fecha, pero forzamos la interpretación "Local" de los componentes UTC.
  // Esto evita que JS le reste las 6 horas de México.
  const dateParts = new Date(rawDateString);

  // Creamos una nueva fecha usando getUTCFullYear, etc.
  // Esto crea una fecha "Local" que coincide numéricamente con la fecha UTC.
  const rowDate = new Date(
    dateParts.getUTCFullYear(),
    dateParts.getUTCMonth(),
    dateParts.getUTCDate(),
    0,
    0,
    0,
    0,
  );
  const rowTime = rowDate.getTime();
  // 4. Calcular límites (Normalizando horas para evitar errores de precisión)
  // Usamos setHours(0,0,0,0) para comparar manzanas con manzanas (días completos)
  const min = range.from
    ? new Date(range.from).setHours(0, 0, 0, 0)
    : -Infinity;
  const max = range.to
    ? new Date(range.to).setHours(23, 59, 59, 999)
    : Infinity;
  // 5. Comparar
  return rowTime >= min && rowTime <= max;
}

export const columns: ColumnDef<DashBoardTable>[] = [
  {
    accessorKey: "name",
    header: "Categoría",
    cell: ({ getValue }) => {
      return (
        <div className="max-w-50 w-full whitespace-nowrap overflow-hidden truncate">
          {getValue()}
        </div>
      );
    },
  },
  {
    accessorKey: "n_reports",
    header: "Reportes",
  },
];
