import type { CellContext } from "@tanstack/react-table";
import { BitacoraRecord } from "@/types/bitacoraTable";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const Share = (props: CellContext<BitacoraRecord, unknown>) => {
  const pathname = usePathname()
  const handleCopy = () => {
    const fullUrl = `${window.location.origin}${pathname}?id=${props.row.original.id}`
    navigator.clipboard.writeText(fullUrl)
    toast.success("Link copiado al portapapeles")
  }

  return (
    <Badge className="bg-zinc-50/50 text-black/80 cursor-pointer" onClick={handleCopy}>
      <ExternalLink />
      Compartir
    </Badge>
  )
}

export default Share
