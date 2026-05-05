import { Badge } from "@/components/ui/badge";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { BADGE_FALLBACK_COLOR } from "@/lib/bitacora/constants";
import { BitacoraRecord } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban, CircleUser, Shield } from "lucide-react";

const CellAcount = (props: CellContext<BitacoraRecord, unknown>) => {
    const value = String(props.getValue()).trim()
    let color: string | undefined = ColumnsBitacoraOpts.account_id.find(
        (e) => e.id === value,
    )?.color;
    return (
        <Badge
            style={{ color: color ?? BADGE_FALLBACK_COLOR }}
            className={`w-full ${value === "jjf" ? "uppercase" : "capitalize"} rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none`}
        >
            {value === "jjf" ? (
                <CircleUser />
            ) : value === "zapopan" ? (
                <Shield />
            ) : value === "N/A" ? (
                <Ban />
            ) : ""}
            {value ? value : "N/A"}
        </Badge>
    )
}

export default CellAcount