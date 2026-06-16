import { BitacoraRecord } from "@/types/bitacoraTable"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from "../ui/context-menu"
import { sendDuplicateRow } from "@/lib/bitacora/duplicateRow"
import { toast } from "sonner"

type DuplicateRowProps = {
  id: BitacoraRecord
  children: React.ReactNode
  n: number
}
type idRow = string
type duplicateNumber = number
const counts = [1, 3, 5, 7, 10]

const DuplicateRow = ({ id, children }: DuplicateRowProps) => {
  const handleSendDuplicate = (id: idRow, n: number) => {
    toast.promise(
      sendDuplicateRow({ id, n }),
      {
        loading: "Duplicando...",
        success: (reponse: { ok: boolean }) => {
          if (reponse.ok) {
            return `Registro duplicado ${n === 1 ? "1 vez" : `${n} veces`}`
          }
        },
        error: "Error duplicado. Intente mas tarde.",
        position: "top-center"
      })
  }


  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Duplicar registro</ContextMenuLabel>
        <ContextMenuSeparator />
        {
          counts.map((n) => (
            <ContextMenuItem key={n} onSelect={() => handleSendDuplicate(id, n)}>
              {n === 1 ? "1 vez" : `${n} veces`}
            </ContextMenuItem>
          ))
        }
      </ContextMenuContent>
    </ContextMenu>
  )
}


export default DuplicateRow
