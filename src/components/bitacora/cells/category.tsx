import { Badge } from "@/components/ui/badge";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { formatData } from "@/lib/formatters/formatData";
import { BitacoraTable } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban, Siren } from "lucide-react";

const CellCategory = (props: CellContext<BitacoraTable, unknown>) => {
    const value = String(props.getValue()).trim()
    let color: string | undefined = ColumnsBitacoraOpts.category.find(
        (e) => e.id === formatData(value),
    )?.color;
    if (!color) {
        color = "oklch(57.7% 0.245 27.325)"
    }
    return (
        <Badge
            style={{ color: color }}
            className="w-full rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
        >
            {value !== "N/A" ? <Siren size="300" /> : <Ban />}
            <p className="max-w-30 truncate hover:whitespace-normal hover:text-clip hover:max-w-full">{value ? value : "N/A"}</p>
        </Badge>
    )
}

export default CellCategory