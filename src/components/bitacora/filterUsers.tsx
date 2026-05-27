import useFetchUsers from "@/hooks/bitacora/useFetchUsers";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import type { Filters } from "@/types/fetchData";

const FilterUsers = ({ filters, onChangeFilter }: { filters: Filters, onChangeFilter: (key: string, value: string) => void }) => {
  const usersToFilter = useFetchUsers()

  return (
    <div className="2xl:flex items-center hidden">
      <Select
        value={filters.userName !== "all" ? filters.userName : ""}
        onValueChange={(value: string) => {
          window.localStorage.setItem("userName", value);
          onChangeFilter("userName", value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Usuarios" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {
            !usersToFilter ?
              null
              :
              usersToFilter.map((e) => (
                <SelectItem key={`u-${e.full_name}`} value={e.id}>
                  {e.full_name}
                </SelectItem>
              ))}
          <SelectItem value="N/A">N/A</SelectItem>
        </SelectContent>
      </Select>
    </div>

  )
}
export default FilterUsers
