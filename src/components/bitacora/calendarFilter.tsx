import { Calendar } from "../ui/calendar";
import { CalendarDays } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import useDateRange from "@/hooks/bitacora/useDateRange";


const CalendarFilter = ({ onChangeFilter }: { onChangeFilter: (key: string, value: string) => void }) => {
  const { dateRange, handleSetDateRange } = useDateRange()
  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <div className="border border-zinc-300 rounded-sm p-2 cursor-pointer">
            <CalendarDays size={20} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => {
              // 1. Actualiza tu estado local para la UI
              handleSetDateRange(range);
              // Opcional: Guardarlo en local storage para que persista
              localStorage.setItem(
                "bitacora_date_range",
                JSON.stringify(range),
              );
              onChangeFilter("bitacora_date_range", JSON.stringify(range))
            }}
            numberOfMonths={2}
            className="rounded-lg border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CalendarFilter
