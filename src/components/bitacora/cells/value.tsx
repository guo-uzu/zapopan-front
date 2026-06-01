"use client"
import { Badge } from "@/components/ui/badge";
import { BitacoraRecord } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban } from "lucide-react";

const CellValue = (props: CellContext<BitacoraRecord, unknown>) => {
  const value = String(props.getValue())
  const globalFilter = String(props.table.options.meta?.debouncedGlobal)
  const color = "oklch(57.7% 0.245 27.325)"
  const parts = globalFilter ? value.split(new RegExp(`(${globalFilter})`, 'i')) : [value]
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
    <p>
      {
        parts.map((e) => (
          e === globalFilter ?
            <span className="bg-yellow-500">{e}</span>
            :
            e
        ))
      }
    </p>
  )
}

export default CellValue
