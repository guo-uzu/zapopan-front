import { Badge } from "@/components/ui/badge";
import { BitacoraTable } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban } from "lucide-react";
const color = "oklch(57.7% 0.245 27.325)"

const CellDate = (props: CellContext<BitacoraTable, unknown>) => {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    } as const;
    const date = new Date(String(props.getValue()))
    const formatDate = new Intl.DateTimeFormat("en-GB", options).format(date).replace(/\//g, "-")
    if (date.getFullYear() < 2020) {
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
        <p className="w-fit mx-auto">{formatDate}</p>
    )
}

export default CellDate