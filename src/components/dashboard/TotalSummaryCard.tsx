import { ArrowUp, ArrowDown } from "lucide-react";

type TotalSummaryCardProps = {
  reports: number;
  delta: number;
};

export const TotalSummayCard = ({ reports, delta }: TotalSummaryCardProps) => {
  return (
    <div className="w-full h-full bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col gap-y-4">
      <h2 className="text-3xl text-black/60">Reportes recibidos hoy</h2>
      <span className="text-8xl font-bold">{reports}</span>
      <div className="flex gap-x-1 items-center">
        <ArrowUp size="30px" color="oklch(62.7% 0.194 149.214)" />
        <span className="text-2xl">{delta}%</span>
      </div>
    </div>
  );
};
