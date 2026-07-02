import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";

interface UseDateRangeOptions {
  defaultFrom?: Date;
  defaultTo?: Date;
}

function toStartOfDayISO(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function toEndOfDayISO(date: Date): string {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

export function useDateRange({
  defaultFrom = new Date(),
  defaultTo = new Date(),
}: UseDateRangeOptions = {}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: defaultTo,
  });

  const { from, to } = useMemo(() => {
    return {
      from: dateRange?.from ? toStartOfDayISO(dateRange.from) : null,
      to: dateRange?.to ? toEndOfDayISO(dateRange.to) : null,
    };
  }, [dateRange]);

  const reset = () => {
    setDateRange({ from: defaultFrom, to: defaultTo });
  };

  return {
    dateRange,
    setDateRange,
    from,
    to,
    reset,
  };
}
