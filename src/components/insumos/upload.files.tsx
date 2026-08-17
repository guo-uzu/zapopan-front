"use client"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { ArrowUpFromLine } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { Textarea } from "../ui/textarea"
import { postInsumos } from "@/lib/insumos/postInsumo"
import { useActionState } from "react"

const UploadFiles = () => {
  const labels = [
    { name: "salud", link: "#" },
    { name: "educación", link: "#" },
    { name: "presupuesto", link: "#" },
    { name: "transporte", link: "#" },
    { name: "informe-anual", link: "#" },
    { name: "seguimiento", link: "#" },
  ]
  const [state, setAction, isPending] = useActionState(postInsumos, undefined)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="flex cursor-pointer"><ArrowUpFromLine />Subir archivo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Subir archivos</DialogTitle>
        <DialogDescription>Añade una imagen, un pdf, un docsx y ponle una etiqueta para que el equipo pueda encontrarlo más tarde.</DialogDescription>
        <form action={setAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="file-insumos">Archivo</FieldLabel>
              <Input type="file" name="fileInsumos" id="file-insumos" />
            </Field>
            <Field>
              <FieldLabel htmlFor="name-insumos">Evento/Reporte</FieldLabel>
              <Input type="text" name="nameInsumos" id="name-insumos" />
            </Field>
            <div className="flex gap-x-4">
              <Field>
                <FieldLabel htmlFor="date-insumos">Fecha</FieldLabel>
                <Input type="date" name="dateInsumos" id="date-insumos" />
              </Field>
              <Field>
                <FieldLabel htmlFor="user-id-insumos">¿Quien sube?</FieldLabel>
                <Input type="text" name="userInsumos" id="user-id-insumos" />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="description-insumos">Descripción</FieldLabel>
              <Textarea name="descriptionInsumos" id="description-insumos" placeholder="¿Qué es este documento y para que sirve?" />
            </Field>
          </FieldGroup>
        </form>
        <div>
          <h2>Label</h2>
          <div className="flex flex-wrap gap-2">
            {
              labels.map(label => (
                <Button variant="outline" size="xs">{label.name}</Button>
              ))
            }
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="flex cursor-pointer">Cerrar</Button>
          </DialogClose>
          <Button variant="default">Subir archivo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UploadFiles
