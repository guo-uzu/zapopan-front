import { Filters } from "@/types/fetchData";
import { DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuGroup, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { ReactNode } from "react";

const StaticFilters = ({ icon, title, column, valueFilter, filters, onChangeFilter }: { icon: ReactNode, title: string, column: keyof typeof ColumnsBitacoraOpts, valueFilter: keyof Filters, filters: Filters, onChangeFilter: (key: string, value: string) => void }) => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex gap-x-1">
        {icon}
        {title}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Cuentas</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={filters[`${valueFilter}`] !== "all" ? filters[`${valueFilter}`] : ""}
            onValueChange={(value: string) => {
              window.localStorage.setItem(valueFilter, value);
              onChangeFilter(valueFilter, value);
            }}
            className="max-h-100 overflow-y-auto"
          >
            <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
            {
              ColumnsBitacoraOpts[`${column}`].map(e => (
                <DropdownMenuRadioItem value={e.id} key={e.value}>{e.value}</DropdownMenuRadioItem>
              ))
            }
            <DropdownMenuRadioItem value="N/A">
              N/A
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

        </DropdownMenuGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

export default StaticFilters
