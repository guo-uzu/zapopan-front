import { CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import FiltersResponsive from "./FiltersResponsive";
import FilterUsers from "./filterUsers";
import FilterDesktop from "./filterDesktop";
import { Filters } from "@/types/fetchData";
import { Dispatch, SetStateAction } from "react";
import { DateRange } from "react-day-picker";
import { CalendarSearch } from "../dashboard/calendar";

const FILTERS = [
  {
    placeholder: "Cuentas",
    idFilterItem: "account",
    idColumnBitacora: "account_id",
  },
  {
    placeholder: "Area",
    idFilterItem: "area",
    idColumnBitacora: "area_id",
  },
  {
    placeholder: "Canal",
    idFilterItem: "channel",
    idColumnBitacora: "channel",
  },
  {
    placeholder: "Categoría",
    idFilterItem: "category",
    idColumnBitacora: "category",
  },
  {
    placeholder: "Redes sociales",
    idFilterItem: "socialNetwork",
    idColumnBitacora: "social_network",
  },
  {
    placeholder: "Prioridad",
    idFilterItem: "priority",
    idColumnBitacora: "priority",
  },
  {
    placeholder: "Estatus",
    idFilterItem: "status",
    idColumnBitacora: "status",
  },
] as const;

type TableToolbarProps = {
  filters: Filters;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  onChangeFilter: (key: string, value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const TableToolbar = ({
  filters,
  setGlobalFilter,
  onChangeFilter,
  dateRange,
  setDateRange,
  setOpen,
}: TableToolbarProps) => {
  return (
    <CardHeader className="flex flex-row justify-between">
      <div className="flex flex-row gap-2">
        <div className="flex items-center">
          <Input
            placeholder="Busca en la bitácora"
            onChange={(e) => setGlobalFilter(String(e.target.value))}
            className="max-w-sm"
          />
        </div>
        <FiltersResponsive filters={filters} onChangeFilter={onChangeFilter} />
        <FilterUsers filters={filters} onChangeFilter={onChangeFilter} />
        {FILTERS.map((f) => (
          <FilterDesktop
            key={f.placeholder}
            placeholder={f.placeholder}
            idFilterItem={f.idFilterItem}
            idColumnBitacora={f.idColumnBitacora}
            filters={filters}
            onChangeFilter={onChangeFilter}
          />
        ))}
        <CalendarSearch
          dateRange={dateRange}
          onSelect={setDateRange}
          onChangeFilter={onChangeFilter}
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <div>
          <p className="text-muted-foreground text-sm">
            Formulario{" "}
            <kbd
              onClick={() => setOpen((o) => !o)}
              className="bg-muted text-muted-foreground cursor-pointer inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
            >
              <span className="text-xs">⌘</span>J
            </kbd>
          </p>
        </div>
      </div>
    </CardHeader>
  );
};
