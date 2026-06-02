import { Badge } from "@/components/ui/badge";
import { BitacoraRecord } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban, CircleUser } from "lucide-react";

const CellUsername = (props: CellContext<BitacoraRecord, unknown>) => {
  const value = String(props.getValue()).trim()
  const globalFilter = String(props.table.options.meta?.debouncedGlobal)
  const regex = new RegExp(`(${globalFilter})`, 'i')
  const parts = globalFilter && value !== "N/A" ? value.split(regex) : [value]
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

      <p className="flex items-center gap-2">
        <CircleUser className="shrink-0" size={18} />
        {
          parts.map((e) => (
            regex.test(e) && parts.length > 1 ?
              <span className="bg-sky-200">{e}</span>
              :
              e
          ))
        }
      </p>
  )
}

export default CellUsername
