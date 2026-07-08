"use client";
import { getUserReports } from "@/lib/dashboard/getUserReports";
import { useTriggerRealtimeDB } from "@/hooks/bitacora/useTriggerRealtimeDB";
import { useEffect, useState } from "react";
import { useDateRange } from "@/hooks/dashboard/useDateRange";
import { CalendarSearch } from "./calendar";
import { dateFormat } from "@/lib/dashboard/formatDate";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

type globalReports = {
  count_resuelto: number;
  count_pendiente: number;
  count_en_proceso: number;
  count_direccion: number;
};
export const UserStadistics = () => {
  const dateFrom = new Date();
  dateFrom.setMonth(dateFrom.getMonth() - 1);

  const { dateRange, setDateRange, from, to } = useDateRange({
    defaultFrom: dateFrom,
  });

  const trigger = useTriggerRealtimeDB();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userReports, setUserReports] = useState<globalReports>({
    count_resuelto: 0,
    count_direccion: 0,
    count_en_proceso: 0,
    count_pendiente: 0,
  });

  useEffect(() => {
    getUserReports({ from, to })
      .then((totalReports) => {
        setLoading(false);
        setUserReports(totalReports);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [trigger, from, to]);

  if (loading) return <Skeleton />;

  if (error)
    return (
      <div className="w-full h-full bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col gap-y-4">
        Error cargando los datos. Recargue su navegador
      </div>
    );

  return (
    <div className="relative w-full h-full bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col gap-y-4">
      <div className="absolute top-4 left-4">
        <CalendarSearch dateRange={dateRange} onSelect={setDateRange} />
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl text-black/60">Reportes individuales</h2>
        <span className="text-center text-sm text-black/40">
          {dateFormat(from)
            ? `${dateFormat(from)} - ${dateFormat(to)}`
            : "Resultados globales"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <Link href="/bitacora?status=resuelto">
          <div className="flex flex-col items-center text-green-700">
            <p className="text-md text-current/70">Resueltos</p>
            <span className="text-3xl font-bold">
              {userReports.count_resuelto.toLocaleString("es-MX")}
            </span>
          </div>
        </Link>
        <Link href="/bitacora?status=pendiente">
          <div className="flex flex-col items-center text-yellow-600">
            <p className="text-md text-current/70">Pendiente</p>
            <span className="text-3xl font-bold">
              {userReports.count_pendiente.toLocaleString("es-MX")}
            </span>
          </div>
        </Link>
        <Link href="/bitacora?status=en_proceso">
          <div className="flex flex-col items-center text-red-600">
            <p className="text-md text-current/70">En proceso</p>
            <span className="text-3xl font-bold">
              {userReports.count_en_proceso.toLocaleString("es-MX")}
            </span>
          </div>
        </Link>
        <Link href="/bitacora?status=dirección">
          <div className="flex flex-col items-center text-orange-600">
            <p className="text-md text-current/70">Dirección</p>
            <span className="text-3xl font-bold">
              {userReports.count_direccion.toLocaleString("es-MX")}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};
