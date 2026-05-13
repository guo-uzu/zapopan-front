import { Badge } from "@/components/ui/badge";
import { BitacoraRecord } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban } from "lucide-react";
const color = "oklch(57.7% 0.245 27.325)"

const CellDate = (props: CellContext<BitacoraRecord, unknown>) => {
  const date = new Date(String(props.getValue()))
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = String(date.getUTCFullYear()).slice(-2)
  const formatDate = `${day}-${month}-${year}`
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
