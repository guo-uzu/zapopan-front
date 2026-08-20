"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tag, TrashIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import FilterPill from "./filter.pill";
import { useActionState } from "react";
import { validateLabel } from "@/lib/insumos/validateLabel";

const AdminLabels = ({
  labels,
}: {
  labels: { message: string[]; error: string };
}) => {
  const [state, action, isLoading] = useActionState(validateLabel, undefined);
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
            <Button type="submit">Agregar</Button>
          </form>
          <Table>
            <TableBody>
              {labels.message.map((data) => (
                <TableRow key={data}>
                  <TableCell className="w-[100px]">
                    <FilterPill name={data} />
                  </TableCell>
                  <TableCell className="float-right">
                    <Button>
                      <TrashIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="flex cursor-pointer">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLabels;
