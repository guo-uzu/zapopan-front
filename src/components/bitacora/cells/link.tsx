import { Badge } from "@/components/ui/badge";
import { BitacoraTable } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban, Link } from "lucide-react";

const CellLink = (props: CellContext<BitacoraTable, unknown>) => {
    const value = String(props.getValue()).trim()
    const color = "oklch(57.7% 0.245 27.325)"
    return (
        value === "N/A" ? (
            <Badge
                style={{ color: color }}
                className="w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
            >
                <Ban />
                <p className="max-w-30 truncate hover:whitespace-normal hover:text-clip hover:max-w-full">{value ? value : "N/A"}</p>
            </Badge>
        ) :
            <a target="_blank" className="flex items-center gap-2 justify-center cursor-pointer w-fit mx-auto hover:text-blue-500 transition-colors duration-300" href={`${String(props.getValue())}`}><Link size={18} /> Enlace</a>
    )
}

export default CellLink