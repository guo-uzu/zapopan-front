import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";

const useDateRange = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const storedDate = localStorage.getItem("bitacora_date_range");
    if (storedDate === "undefined" || !storedDate) return undefined;
    const parsed = JSON.parse(storedDate);
    setDateRange(parsed)
  }, [])

  return { dateRange, setDateRange }
}

export default useDateRange
