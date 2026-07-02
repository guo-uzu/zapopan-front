"use client";
import { getGlobalReports } from "@/lib/dashboard/getGlobalReports";
import { useTriggerRealtimeDB } from "@/hooks/bitacora/useTriggerRealtimeDB";
import { useEffect, useState } from "react";
import { CalendarSearch } from "./calendar";
import { useDateRange } from "@/hooks/dashboard/useDateRange";

type globalReports = {
  count_resuelto: number;
  count_pendiente: number;
  count_en_proceso: number;
  count_direccion: number;
};

export const GlobalStadistics = () => {
  const { dateRange, setDateRange, from, to } = useDateRange();
  const trigger = useTriggerRealtimeDB();
  const [error, setError] = useState(false);
  const [globalReports, setGlobalReports] = useState<globalReports>({
    count_resuelto: 0,
    count_direccion: 0,
    count_en_proceso: 0,
    count_pendiente: 0,
  });

  useEffect(() => {
    getGlobalReports({ from, to })
      .then((totalReports) => {
        setGlobalReports(totalReports);
        setError(false);
      })
      .catch(() => setError(true));
  }, [trigger, from, to]);

  if (error)
    return (
      <div className="w-full h-full bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col gap-y-4">
        Error cargando los datos. Recargue su navegador
      </div>
    );

  return (
    <div className="relative p-4 w-full h-full bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col gap-y-4">
      <div className="absolute top-4 left-4">
        <CalendarSearch dateRange={dateRange} onSelect={setDateRange} />
      </div>
      <div>
        <h2 className="text-2xl text-black/60">Reportes globales</h2>
        <span></span>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col items-center text-green-700">
            <p className="text-md text-current/70">Resueltos</p>
            <span className="text-4xl font-bold">
              {globalReports.count_resuelto.toLocaleString("es-MX")}
            </span>
          </div>
          <div className="flex flex-col items-center text-yellow-600">
            <p className="text-md text-current/70">Pendiente</p>
            <span className="text-4xl font-bold">
              {globalReports.count_pendiente.toLocaleString("es-MX")}
            </span>
          </div>
          <div className="flex flex-col items-center text-red-600">
            <p className="text-md text-current/70">En proceso</p>
            <span className="text-4xl font-bold">
              {globalReports.count_en_proceso.toLocaleString("es-MX")}
            </span>
          </div>
          <div className="flex flex-col items-center text-orange-600">
            <p className="text-md text-current/70">Dirección</p>
            <span className="text-4xl font-bold">
              {globalReports.count_direccion.toLocaleString("es-MX")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
