import { Badge } from "@/components/ui/badge";
import { BitacoraRecord, BitacoraTableMeta } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban, Link } from "lucide-react";

const CellObservations = (props: CellContext<BitacoraRecord, unknown>) => {
  const value = String(props.getValue())
  const color = "oklch(57.7% 0.245 27.325)"
  const splitedText = value.split(/(https?:\/\/[^\s]+)/g);

  const globalFilter = props.table.options.meta as BitacoraTableMeta
  const regex = new RegExp(`(${globalFilter.debouncedGlobal})`, 'i')
  const parts = value !== "N/A" && globalFilter.debouncedGlobal !== "" ? value.split(regex) : [value]

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

  return parts.map((text, index) => {
    if (text.match(/https?:\/\/[^\s]+/)) {
      return (
        <a
          key={index}
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-2 items-center underline hover:text-blue-700 transition-colors duration-300"
        >
          <Link className="shrink-0" size={12} />
          Click al enlace
        </a>
      );
    }
    return globalFilter.debouncedGlobal !== "" && regex.test(text) ?
      <span className="bg-sky-200">{text}</span>
      :
      text

  })
}

export default CellObservations
