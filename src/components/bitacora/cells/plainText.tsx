import { BitacoraRecord } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import type { MouseEvent } from "react";
import { toast } from "sonner";

const CellPlainText = (props: CellContext<BitacoraRecord, unknown>) => {
    const copyText = async (e: MouseEvent<HTMLDivElement>) => {
        if(String(e.currentTarget.innerHTML).toUpperCase().includes("N/A")) {
            toast.error("No hay información para copiar", {position: "top-center"})
            return
        }
        await navigator.clipboard.writeText(e.currentTarget.innerHTML)
        toast.success("Información copiada al portapapeles", {position: "top-center"})
    }
    return (
        <span className="overflow-hidden w-full h-full" onClick={copyText}>
            {String(props.getValue())}
        </span>
    )
}

export default CellPlainText