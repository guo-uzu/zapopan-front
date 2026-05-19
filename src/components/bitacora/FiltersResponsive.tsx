import { CircleUserRound, Ellipsis } from "lucide-react"
import { DropdownMenuLabel, DropdownMenuSubContent, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Filters } from "@/types/fetchData";

const FiltersResponsive = ({ usersToFilter, filters, onChangeFilter }: { usersToFilter: { id: string; full_name: string }[], filters: Filters, onChangeFilter: (key: string, value: string) => void }) => {
    return (
        <div className="block 2xl:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline"><Ellipsis /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
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
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default FiltersResponsive