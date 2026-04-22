import { Badge } from "@/components/ui/badge";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { formatData } from "@/lib/formatters/formatData";
import { BitacoraTable } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban, Building } from "lucide-react";

const CellArea = (props: CellContext<BitacoraTable, unknown>) => {
    const value = String(props.getValue()).trim()
    let color: string | undefined = ColumnsBitacoraOpts.area_id.find(
        (e) => e.id === formatData(value),
    )?.color;
    if (!color) {
        color = "oklch(57.7% 0.245 27.325)"
    }
    console.log(value)
    return (
        <Badge
            style={{ color: color }}
            className="truncate w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
        >
            {value !== "N/A" ? <Building /> : <Ban />}
            
            {value ? value : "N/A"}
        </Badge>
    )
}

export default CellArea