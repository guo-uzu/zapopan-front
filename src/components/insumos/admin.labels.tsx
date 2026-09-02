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
import { useActionState, useEffect, useState, useTransition } from "react";
import { validateLabel } from "@/lib/insumos/validateLabel";
import { deleteLabels } from "@/lib/insumos/labelsOperations";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { ToastLabel } from "./toast.label";
import { toast } from "sonner";

const NewLabelForm = ({ onAdded }: { onAdded: () => void }) => {
  const [state, action, isLoading] = useActionState(validateLabel, undefined);

  useEffect(() => {
    if (state?.success) {
      onAdded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <ToastLabel isLoading={isLoading} state={state} />
      <form action={action} className="flex gap-x-2">
        <div className="flex flex-col gap-2 w-full">
          <Input
            id="label"
            type="text"
            placeholder="salud, presupuesto, informe-anual"
            name="label"
            required
          />
          {state?.errors?.label?.map((error) => (
            <p className="text-red-500 text-xs" key={error}>* {error}</p>
          ))}
        </div>
        <Button type="submit" className="cursor-pointer">{isLoading ? "Agregando..." : "Agregar"}</Button>
      </form>
    </>
  );
};

const AdminLabels = ({
  labels,
}: {
  labels: { data: { name: string, id_public: string }[]; error: string | null };
}) => {
  const [formKey, setFormKey] = useState(0);
  const [isPending, startTransition] = useTransition()
  const handleDelete = (idPublic: string) => {
    startTransition(async () => {
      try {
        await deleteLabels(idPublic);
        toast.success("Etiqueta eliminada", { position: "top-center" });
      } catch {
        toast.error("No se pudo eliminar la etiqueta", {
          position: "top-center",
        });
      }
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
          <NewLabelForm
            key={formKey}
            onAdded={() => setFormKey((key) => key + 1)}
          />
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
