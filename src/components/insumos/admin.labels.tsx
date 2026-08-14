import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogClose } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Tag, TrashIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableRow } from "../ui/table"
import FilterPill from "./filter.pill"

const table = [
  { name: "salud", files: "2" },
  { name: "educación", files: "2" },
  { name: "presupuesto", files: "2" },
  { name: "transporte", files: "2" },
  { name: "informe-anual", files: "2" },
  { name: "seguimiento", files: "2" },
]

const AdminLabels = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex cursor-pointer"><Tag />Administrar etiquetas</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Administrador de etiquetas</DialogTitle>
        <DialogDescription>Crea etiquetas para organizar documentos o elimina los que no necesites.</DialogDescription>
        <div className="-mx-4 no-scrollbar max-h-[40vh] overflow-y-auto px-4 flex flex-col gap-y-6">
          <form className="flex gap-x-2">
            <Input id="label" placeholder="salud, presupuesto, informe-anual" />
            <Button>Agregar</Button>
          </form>
          <Table>
            <TableBody>
              {
                table.map(data => (
                  <TableRow key={data.name}>
                    <TableCell className="w-[100px]"><FilterPill name={data.name} /></TableCell>
                    <TableCell>2 files</TableCell>
                    <TableCell className="float-right"><Button><TrashIcon /></Button></TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="flex cursor-pointer">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AdminLabels
