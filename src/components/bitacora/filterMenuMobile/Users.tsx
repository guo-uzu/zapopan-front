import { Filters } from "@/types/fetchData";
import { CircleUserRound } from "lucide-react";
import { DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuGroup, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

const Users = ({ usersToFilter, filters, onChangeFilter }: { usersToFilter: { id: string; full_name: string }[], filters: Filters, onChangeFilter: (key: string, value: string) => void }) => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex gap-x-1">
        <CircleUserRound size={14} />
        Usuarios
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Usuarios</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={filters.userName !== "all" ? filters.userName : ""}
            onValueChange={(value: string) => {
              window.localStorage.setItem("userName", value);
              onChangeFilter("userName", value);
            }}
          >
            <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
            {
              usersToFilter.map(e => (
                <DropdownMenuRadioItem value={e.id} key={e.id}>{e.full_name}</DropdownMenuRadioItem>
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

export default Users
