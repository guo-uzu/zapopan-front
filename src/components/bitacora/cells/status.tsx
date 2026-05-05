import { Badge } from "@/components/ui/badge";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { BADGE_FALLBACK_COLOR } from "@/lib/bitacora/constants";
import { formatData } from "@/lib/formatters/formatData";
import { BitacoraTable } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban, Compass, ListRestart, SquareCheckBig, TriangleAlert } from "lucide-react";

const CellStatus = (props: CellContext<BitacoraTable, unknown>) => {
    const value = String(props.getValue()).trim()
    let color: string | undefined = ColumnsBitacoraOpts.status.find(
        (e) => e.id === formatData(value),
    )?.color;

    return (
        <Badge
            style={{ color: color ?? BADGE_FALLBACK_COLOR }}
            className="w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
        >
            {value === "resuelto" ? (
                <SquareCheckBig />
            ) : value === "pendiente" ? (
                <TriangleAlert />
            ) : value === "dirección" ? (
                <Compass />
            ) : value === "N/A" ? (
                <Ban />
            ) : (
                <ListRestart />
            )}
            <p className="max-w-30 truncate hover:whitespace-normal hover:text-clip hover:max-w-full">{value ? value : "N/A"}</p>
        </Badge>
    )
}

export default CellStatus