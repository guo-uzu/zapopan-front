import { DateRange } from "react-day-picker";
import { useState } from "react";

const useDateRange = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    const storedDate = localStorage.getItem("bitacora_date_range");
    if (!storedDate) return;
    const parsed = JSON.parse(storedDate);
    return {
      from: parsed.from ? new Date(parsed.from) : undefined,
      to: parsed.to ? new Date(parsed.to) : undefined,
    };
  });
  const handleSetDateRange = (e: { from: Date, to: Date }) => setDateRange(e)
  return [dateRange, handleSetDateRange]
}

export default useDateRange
