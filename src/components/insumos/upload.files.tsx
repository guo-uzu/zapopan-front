"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { ArrowUpFromLine } from "lucide-react";
import { Input } from "../ui/input";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { postInsumos } from "@/lib/insumos/postInsumo";
import { useActionState, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import ObligatoryIcon from "../bitacora/obligatoryIcon";

const UploadFiles = ({ userData, labels }: { userData: { name?: string, id?: string }, labels: { data: { name: string, id_public: string }[], error: string | null } }) => {
  const [state, setAction, isPending] = useActionState(postInsumos, undefined);
  const [selectedLabel, setSelectedLabel] = useState<{ name: string, id_public: string } | null>(null);
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="flex cursor-pointer">
          <ArrowUpFromLine />
          Subir archivo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Subir archivos</DialogTitle>
        <DialogDescription>
          Añade una imagen, un pdf, un docsx y ponle una etiqueta para que el
          equipo pueda encontrarlo más tarde.
        </DialogDescription>
        <form action={setAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="file-insumos">Archivo <ObligatoryIcon /> </FieldLabel>
              <Input type="file" name="fileInsumos" id="file-insumos" />
              {state?.errors?.fileInsumos?.errors[0] && (
                <p className="text-red-500 text-xs">
                  * {state.errors.fileInsumos?.errors[0]}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="name-insumos">Evento/Reporte<ObligatoryIcon /></FieldLabel>
              <Input
                type="text"
                name="nameInsumos"
                id="name-insumos"
                defaultValue={state?.fields?.nameInsumos}
              />
              {state?.errors?.nameInsumos?.errors[0] && (
                <p className="text-red-500 text-xs">
                  * {state.errors.nameInsumos.errors[0]}
                </p>
              )}
            </Field>
            <div className="flex gap-x-4">
              <Field>
                <FieldLabel htmlFor="date-insumos">Fecha<ObligatoryIcon /></FieldLabel>
                <Input
                  type="date"
                  name="dateInsumos"
                  id="date-insumos"
                  defaultValue={state?.fields?.dateInsumos || today}
                />
                {state?.errors?.dateInsumos?.errors[0] && (
                  <p className="text-red-500 text-xs">
                    * {state.errors.dateInsumos.errors[0]}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="user-id-insumos">¿Quien sube?</FieldLabel>
                <Input
                  type="text"
                  name="userInsumos"
                  id="user-id-insumos"
                  defaultValue={userData.name}
                  disabled
                />
                <input type="hidden" name="labelInsumos" value={userData.id} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="description-insumos">Descripción</FieldLabel>
              <Textarea
                name="descriptionInsumos"
                id="description-insumos"
                placeholder="¿Qué es este documento y para que sirve?"
              />
              {state?.errors?.descriptionInsumos?.errors[0] && (
                <p className="text-red-500 text-xs">
                  * {state.errors.descriptionInsumos.errors[0]}
                </p>
              )}
            </Field>
            <Field className="w-full relative">
              <FieldLabel htmlFor="label-insumos">Etiquetas<ObligatoryIcon /></FieldLabel>
              <Combobox
                value={selectedLabel?.name}
                items={labels.data}
                onValueChange={(val) => setSelectedLabel(val)}
              >
                <ComboboxInput placeholder="Selecciona una opción" />
                <ComboboxContent className="z-[100] pointer-events-auto">
                  <ComboboxEmpty>No se encontró nada.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: { name: string; id_public: string }) => (
                      <ComboboxItem key={item.id_public} value={item.name}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {state?.errors?.labelInsumos?.errors[0] && (
                <p className="text-red-500 text-xs">
                  * {state.errors.labelInsumos.errors[0]}
                </p>
              )}
              <input type="hidden" name="labelInsumos" value={selectedLabel?.id_public} />
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="reset"
                  variant="outline"
                  className="cursor-pointer"
                >
                  Cerrar
                </Button>
              </DialogClose>
              <Button variant="default" type="submit" className="cursor-pointer">
                Subir archivo
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFiles;
