import { Badge } from "@/components/ui/badge";
import { BitacoraRecord } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban } from "lucide-react";
const color = "oklch(57.7% 0.245 27.325)"

const CellDate = (props: CellContext<BitacoraRecord, unknown>) => {
  const dateValue = props.getValue();

  if (!dateValue || dateValue === null || dateValue === "") {
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

  const dateStr = String(dateValue);

  // Parse YYYY-MM-DD manually to avoid timezone conversion
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return <p className="w-fit mx-auto">Invalid Date</p>;
  }

  const year = match[1].slice(-2);
  const month = match[2];
  const day = match[3];
  const formatDate = `${day}-${month}-${year}`;

  const fullYear = parseInt(match[1]);
  if (fullYear < 2020) {
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
