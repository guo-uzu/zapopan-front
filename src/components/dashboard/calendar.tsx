import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { CalendarDays } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import { Button } from "../ui/button";

interface CalendarSearchProps {
  dateRange: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
}

export const CalendarSearch = ({
  dateRange,
  onSelect,
}: CalendarSearchProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <CalendarDays />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onSelect}
          numberOfMonths={2}
          className="rounded-lg border shadow-sm"
        />
      </PopoverContent>
    </Popover>
  );
};
