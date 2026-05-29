import { BitacoraRecord } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import type { MouseEvent } from "react";
import { Link } from "lucide-react";
import { toast } from "sonner";

const CellPlainText = (props: CellContext<BitacoraRecord, unknown>) => {
  const copyText = async (e: MouseEvent<HTMLDivElement>) => {
    if (String(e.currentTarget.innerHTML).toUpperCase().includes("N/A")) {
      toast.error("No hay información para copiar", { position: "top-center" })
      return
    }
    await navigator.clipboard.writeText(e.currentTarget.innerText)
    toast.success("Información copiada al portapapeles", { position: "top-center" })
  }
  const urlify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(text)) {
      const splitedText = text.split(/(https?:\/\/[^\s]+)/g);
      return splitedText.map((text, index) => {
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
        return <span key={index}>{text}</span>;
      });
    }
    return <span>{text}</span>;
  }
  return (
    <span className="overflow-hidden w-full h-full" onClick={copyText}>
      {urlify(String(props.getValue()))}
    </span>
  )
}
export default CellPlainText
