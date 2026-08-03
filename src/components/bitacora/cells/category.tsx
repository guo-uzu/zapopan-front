import { Badge } from "@/components/ui/badge";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { BADGE_FALLBACK_COLOR } from "@/lib/bitacora/constants";
import { formatData } from "@/lib/formatters/formatData";
import { BitacoraRecord } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban, Siren } from "lucide-react";

const CellCategory = (props: CellContext<BitacoraRecord, unknown>) => {
  const value = String(props.getValue()).trim();
  let color: string | undefined = ColumnsBitacoraOpts.category.find(
    (e) => e.id === formatData(value),
  )?.color;
  return (
    <Badge
      style={{ color: color ?? BADGE_FALLBACK_COLOR }}
      className="w-full rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
    >
      {value !== "N/A" ? <Siren size={300} /> : <Ban />}
      <p className="max-w-30 truncate hover:whitespace-normal hover:text-clip hover:max-w-full">
        {value ? value : "N/A"}
      </p>
    </Badge>
  );
};

export default CellCategory;

