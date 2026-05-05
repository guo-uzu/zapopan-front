import { Badge } from "@/components/ui/badge";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { formatData } from "@/lib/formatters/formatData";
import { BitacoraTable } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban, Building } from "lucide-react";
import { BADGE_FALLBACK_COLOR } from "@/lib/bitacora/constants";

const CellArea = (props: CellContext<BitacoraTable, unknown>) => {
    const value = String(props.getValue()).trim()
    let color: string | undefined = ColumnsBitacoraOpts.area_id.find(
        (e) => e.id === formatData(value),
    )?.color;
    return (
        <Badge
            style={{ color: color ?? BADGE_FALLBACK_COLOR }}
            className="w-full rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
        >
            {value !== "N/A" ? <Building className="shrink-0" size={300} /> : <Ban />}
            <p className="max-w-30 truncate hover:whitespace-normal hover:text-clip hover:max-w-full">{value ? value : "N/A"}</p>
        </Badge>
    )
}

export default CellArea