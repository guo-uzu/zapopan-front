import { Badge } from "@/components/ui/badge";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { BitacoraTable } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban, CircleUser, Shield } from "lucide-react";

const CellAcount = (props: CellContext<BitacoraTable, unknown>) => {
    const value = String(props.getValue()).trim()
    let color: string | undefined = ColumnsBitacoraOpts.account_id.find(
        (e) => e.id === value,
    )?.color;
    if (!color) {
        color = "oklch(57.7% 0.245 27.325)"
    }
    return (
        <Badge
            style={{ color: color }}
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