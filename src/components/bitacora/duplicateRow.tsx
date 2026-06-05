import { BitacoraRecord } from "@/types/bitacoraTable"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from "../ui/context-menu"
import { useState } from "react"
import { sendDuplicateRow } from "@/lib/bitacora/duplicateRow"

type DuplicateRowProps = {
  record: BitacoraRecord
  children: React.ReactNode
}

const counts = [1, 3, 5, 7, 10]

const DuplicateRow = ({ record, children }: DuplicateRowProps) => {
  const [loading, setLoading] = useState(false)
  const handleSendDuplicate = (record, n) => {
    sendDuplicateRow({ record, n })
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Duplicar registro</ContextMenuLabel>
        <ContextMenuSeparator />
        {
          counts.map((n) => (
            <ContextMenuItem key={n} onSelect={() => handleSendDuplicate}>
              {n === 1 ? "1 vez" : `${n} veces`}
            </ContextMenuItem>
          ))
        }
      </ContextMenuContent>
    </ContextMenu>
  )
}


export default DuplicateRow
