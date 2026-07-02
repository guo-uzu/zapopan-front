"use client";
// TodaySummaryCard.tsx — no "use client", async Server Component
import { useTriggerRealtimeDB } from "@/hooks/bitacora/useTriggerRealtimeDB";
import { getReportsToday } from "@/lib/dashboard/getReportsToday";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

type DataSummaryCard = {
  today: number;
  delta: number;
};

export const TodaySummaryCard = () => {
  const [data, setData] = useState<DataSummaryCard>({ today: 0, delta: 0 });
  const [error, setError] = useState(false);
  const RED_COLOR = "oklch(63.7% 0.237 25.331)";
  const GREEN_COLOR = "oklch(62.7% 0.194 149.214)";
  const trigger = useTriggerRealtimeDB();

  useEffect(() => {
    getReportsToday()
      .then(({ today, delta }) => setData({ today, delta }))
      .catch(() => setError(true));
  }, [trigger]);

  if (error)
    return (
      <div className="w-full h-full bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col gap-y-4">
        Error cargando los datos. Recargue su navegador
      </div>
    );

  return (
    <div className="w-full h-full bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col gap-y-4">
      <h2 className="text-2xl text-black/60">Reportes recibidos hoy</h2>
      <span className="text-8xl font-bold">{data.today}</span>
      <div className="flex gap-x-1 items-center">
        {data.delta >= 0 ? (
          <ArrowUp size="30px" color={GREEN_COLOR} />
        ) : (
          <ArrowDown size="30px" color={RED_COLOR} />
        )}
        <span
          style={{ color: data.delta >= 0 ? GREEN_COLOR : RED_COLOR }}
          className="text-2xl"
        >
          {Math.abs(data.delta)}%
        </span>
      </div>
    </div>
  );
};
