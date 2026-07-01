// TodaySummaryCard.tsx — no "use client", async Server Component
import { getReportsToday } from "@/lib/dashboard/getReportsToday";
import { ArrowUp, ArrowDown } from "lucide-react";

export const TodaySummaryCard = async () => {
  const { today, delta } = await getReportsToday();
  const RED_COLOR = "oklch(63.7% 0.237 25.331)";
  const GREEN_COLOR = "oklch(62.7% 0.194 149.214)";
  return (
    <div className="w-full h-full bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col gap-y-4">
      <h2 className="text-2xl text-black/60">Reportes recibidos hoy</h2>
      <span className="text-8xl font-bold">{today}</span>
      <div className="flex gap-x-1 items-center">
        {delta >= 0 ? (
          <ArrowUp size="30px" color={GREEN_COLOR} />
        ) : (
          <ArrowDown size="30px" color={RED_COLOR} />
        )}
        <span
          style={{ color: delta >= 0 ? GREEN_COLOR : RED_COLOR }}
          className="text-2xl"
        >
          {Math.abs(delta)}%
        </span>
      </div>
    </div>
  );
};
