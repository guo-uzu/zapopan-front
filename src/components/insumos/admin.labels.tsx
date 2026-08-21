"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tag, TrashIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import FilterPill from "./filter.pill";
import { useActionState, useTransition } from "react";
import { validateLabel } from "@/lib/insumos/validateLabel";
import { deleteLabels } from "@/lib/insumos/labelsOperations";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

const AdminLabels = ({
  labels,
}: {
  labels: { data: { name: string, id_public: string }[]; error: string | null };
}) => {
  const [state, action, isLoading] = useActionState(validateLabel, undefined);
  const [isPending, startTransition] = useTransition()

  const handleDelete = (idPublic: string) => {
    startTransition(async () => {
      await deleteLabels(idPublic)
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex cursor-pointer">
          <Tag />
          Administrar etiquetas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Administrador de etiquetas</DialogTitle>
        <DialogDescription>
          Crea etiquetas para organizar documentos o elimina los que no
          necesites.
        </DialogDescription>
        <div className="-mx-4 no-scrollbar max-h-[40vh] overflow-y-auto px-4 flex flex-col gap-y-6">
          <form action={action} className="flex gap-x-2">
            <div className="flex flex-col gap-2 w-full">
              <Input
                id="label"
                type="text"
                placeholder="salud, presupuesto, informe-anual"
                name="label"
              />
              {state?.errors?.label?.errors[0] && (
                <p className="text-red-500 text-xs">
                  {state?.errors?.label?.errors[0]}
                </p>
              )}
            </div>
            <Button type="submit" className="cursor-pointer">Agregar</Button>
          </form>
          <Table>
            <TableBody>
              {labels.data.map((data) => (
                <TableRow key={data.id_public}>
                  <TableCell className="w-[100px]">
                    <FilterPill name={data.name} />
                  </TableCell>
                  <TableCell className="float-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="cursor-pointer">
                          <TrashIcon />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>¿Está seguro de borrar esta etiqueta?</AlertDialogTitle>
                        <AlertDialogDescription>Las etiquetas se borran dentro del sistema, avise al desarrollador o a un administrador si es que se equivoca.</AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                          <AlertDialogAction disabled={isPending} onClick={() => handleDelete(data.id_public)}>{isPending ? "Borrando" : "Borrar"}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent >
    </Dialog >
  );
};

export default AdminLabels;
