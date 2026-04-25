import { Badge } from "@/components/ui/badge";
import { BitacoraTable } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban } from "lucide-react";

const CellValue = (props: CellContext<BitacoraTable, unknown>) => {

    const value = String(props.getValue())
    const color = "oklch(57.7% 0.245 27.325)"
    if (value === "N/A") {
        return (
            <Badge
                style={{ color: color }}
                className="w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
            >
                <Ban />
                <span className="max-w-30 truncate hover:whitespace-normal hover:text-clip hover:max-w-full">N/A</span>
            </Badge>
        )
    }
    return (
        <span className="w-fit mx-auto">{value}</span>
    )
}

export default CellValue