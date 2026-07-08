import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { CalendarDays } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import { Button } from "../ui/button";

interface CalendarSearchProps {
  dateRange: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  onChangeFilter?: (key: string, value: string) => void;
}

export const CalendarSearch = ({
  dateRange,
  onSelect,
  onChangeFilter,
}: CalendarSearchProps) => {
  const onSelectFnc = (range: DateRange | undefined) => {
    onSelect(range);
    if (onChangeFilter) {
      localStorage.setItem("bitacora_date_range", JSON.stringify(range));
      onChangeFilter("bitacora_date_range", JSON.stringify(range));
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild className="relative">
        <Button variant="outline" size="icon">
          {!dateRange?.from ? null : (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500/60 border-2 border-blue-500">
              <span className="bg-blue-500 w-full h-full absolute inset-0 rounded-full animate-ping z-10"></span>
            </div>
          )}
          <CalendarDays />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full relative">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onSelectFnc}
          numberOfMonths={2}
          className="rounded-lg border shadow-sm"
        />
      </PopoverContent>
    </Popover>
  );
};
