import { Calendar } from "../ui/calendar";
import { CalendarDays } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { DateRange } from "react-day-picker";
import { Dispatch } from "react";

const CalendarFilter = ({ dateRange, setDateRange, onChangeFilter }: { dateRange: DateRange | undefined, setDateRange: Dispatch<DateRange | undefined>, onChangeFilter: (key: string, value: string) => void }) => {
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
              setDateRange(range);
              // Opcional: Guardarlo en local storage para que persista
              localStorage.setItem(
                "bitacora_date_range",
                JSON.stringify(range),
              )
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
