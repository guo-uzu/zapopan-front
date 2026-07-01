import { getGlobalReports } from "@/lib/dashboard/getGlobalReports";

type globalReports = {
  count_resuelto: number;
  count_pendiente: number;
  count_en_proceso: number;
  count_direccion: number;
};
export const GlobalStadistics = async () => {
  const reports: globalReports = await getGlobalReports();
  const resueltos = Number(reports.count_resuelto).toLocaleString("es-MX");
  const pendientes = Number(reports.count_pendiente).toLocaleString("es-MX");
  const enProceso = Number(reports.count_en_proceso).toLocaleString("es-MX");
  const direccion = Number(reports.count_direccion).toLocaleString("es-MX");

  return (
    <div className="w-full h-full bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col gap-y-4">
      <h2 className="text-2xl text-black/60">Reportes globales</h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div className="flex flex-col items-center text-green-700">
          <p className="text-md text-current/70">Resueltos</p>
          <span className="text-3xl font-bold">{resueltos}</span>
        </div>
        <div className="flex flex-col items-center text-yellow-600">
          <p className="text-md text-current/70">Pendiente</p>
          <span className="text-3xl font-bold">{pendientes}</span>
        </div>
        <div className="flex flex-col items-center text-red-600">
          <p className="text-md text-current/70">En proceso</p>
          <span className="text-3xl font-bold">{enProceso}</span>
        </div>
        <div className="flex flex-col items-center text-orange-600">
          <p className="text-md text-current/70">Dirección</p>
          <span className="text-3xl font-bold">{direccion}</span>
        </div>
      </div>
    </div>
  );
};
