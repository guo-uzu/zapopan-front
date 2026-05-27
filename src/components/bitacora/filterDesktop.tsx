import type { Filters } from "@/types/fetchData";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

const FilterDesktop = ({ placeholder, idFilterItem, filters, idColumnBitacora, onChangeFilter }: { placeholder: string, idFilterItem: keyof typeof filters, idColumnBitacora: keyof typeof ColumnsBitacoraOpts, filters: Filters, onChangeFilter: (key: string, value: string) => void }) => {
  return (
    <div className="2xl:flex items-center hidden">
      <Select
        value={filters[idFilterItem] !== "all" ? filters[idFilterItem] : ""}
        onValueChange={(value: string) => {
          localStorage.setItem(idFilterItem, value);
          onChangeFilter(idFilterItem, value);
        }}
      >
        <SelectTrigger className="cursor-pointer">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {ColumnsBitacoraOpts[idColumnBitacora].map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.value}
            </SelectItem>
          ))}
          <SelectItem value="N/A">N/A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default FilterDesktop
