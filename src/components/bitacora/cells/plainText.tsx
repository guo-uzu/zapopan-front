import { BitacoraRecord } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";

const CellPlainText = (props: CellContext<BitacoraRecord, unknown>) => (
    <span className="overflow-hidden w-full h-full">
        {String(props.getValue())}
    </span>
)

export default CellPlainText