import { Shield, Ellipsis, Building, Inbox, Siren, CircleFadingPlus, Signal, SquareCheck } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Filters } from "@/types/fetchData";
import Users from "./filterMenuMobile/Users";
import StaticFilters from "./filterMenuMobile/StaticFilters";

const FiltersResponsive = ({ filters, onChangeFilter }: { filters: Filters, onChangeFilter: (key: string, value: string) => void }) => {
  return (
    <div className="block 2xl:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline"><Ellipsis /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <Users filters={filters} onChangeFilter={onChangeFilter} />
            <StaticFilters icon={<Shield size={14} />} title="Cuenta" column="account_id" valueFilter="account" filters={filters} onChangeFilter={onChangeFilter} />
            <StaticFilters icon={<Building size={14} />} title="Area" column="area_id" valueFilter="area" filters={filters} onChangeFilter={onChangeFilter} />
            <StaticFilters icon={<Inbox size={14} />} title="Canal" column="channel" valueFilter="channel" filters={filters} onChangeFilter={onChangeFilter} />
            <StaticFilters icon={<Siren size={14} />} title="Categoría" column="category" valueFilter="category" filters={filters} onChangeFilter={onChangeFilter} />
            <StaticFilters icon={<CircleFadingPlus size={14} />} title="Redes sociales" column="social_network" valueFilter="socialNetwork" filters={filters} onChangeFilter={onChangeFilter} />
            <StaticFilters icon={<Signal size={14} />} title="Prioridad" column="priority" valueFilter="priority" filters={filters} onChangeFilter={onChangeFilter} />
            <StaticFilters icon={<SquareCheck size={14} />} title="Status" column="status" valueFilter="status" filters={filters} onChangeFilter={onChangeFilter} />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default FiltersResponsive
