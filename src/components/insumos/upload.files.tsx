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
import { useActionState, useState, useRef, useEffect } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import ObligatoryIcon from "../bitacora/obligatoryIcon";
import { toast } from "sonner";

const UploadFiles = ({
  userData,
  labels,
}: {
  userData: { name?: string; id?: string };
  labels: { data: { name: string; id_public: string }[]; error: string | null };
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setAction, isPending] = useActionState(postInsumos, undefined);
  const [selectedLabelId, setSelectedLabelId] = useState<string>("");
  const [selectedLabelName, setSelectedLabelName] = useState<string>("");
  const today = new Date().toISOString().split("T")[0];
  const [open, setOpen] = useState(false);

  const handleSelectLabel = (value: string | null) => {
    const selectedLabel = labels.data.find((label) => label.name === value);
    if (!selectedLabel) {
      setSelectedLabelName("");
      setSelectedLabelId("");
      return;
    }
    setSelectedLabelName(selectedLabel.name);
    setSelectedLabelId(selectedLabel.id_public);
  };

  useEffect(() => {
    if (isPending) {
      toast.loading("Subiendo archivo...", {
        position: "top-center",
      });
      return;
    } else {
      toast.dismiss();
    }

    if (!state) return;

    if (state.ok) {
      formRef.current?.reset();
      toast.success("Archivo subido al sistema con éxito.", {
        position: "top-center",
      });
      // Reset controlled fields
      setSelectedLabelId("");
      setSelectedLabelName("");
      setOpen(false);
    } else if (state.formError) {
      toast.error(state.formError, {
        position: "top-center",
      });
    }
  }, [isPending, state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <form ref={formRef} action={setAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="file-insumos">
                Archivo <ObligatoryIcon />{" "}
              </FieldLabel>
              <Input type="file" name="fileInsumos" id="file-insumos" />
              {state?.errors?.fileInsumos?.errors[0] && (
                <p className="text-red-500 text-xs">
                  * {state.errors.fileInsumos?.errors[0]}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="name-insumos">
                Evento/Reporte
                <ObligatoryIcon />
              </FieldLabel>
              <Input
                type="text"
                name="nameInsumos"
                id="name-insumos"
                defaultValue={state?.fields?.nameInsumos !== undefined ? String(state?.fields?.nameInsumos) : ""}
              />
              {state?.errors?.nameInsumos?.errors[0] && (
                <p className="text-red-500 text-xs">
                  * {state.errors.nameInsumos.errors[0]}
                </p>
              )}
            </Field>
            <div className="flex gap-x-4">
              <Field>
                <FieldLabel htmlFor="date-insumos">
                  Fecha
                  <ObligatoryIcon />
                </FieldLabel>
                <Input
                  type="date"
                  name="dateInsumos"
                  id="date-insumos"
                  defaultValue={state?.fields?.dateInsumos !== undefined ? String(state?.fields?.dateInsumos) : today}
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
                <input type="hidden" name="userInsumos" value={userData.id} />
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
              <FieldLabel htmlFor="labelInsumos">
                Etiquetas
                <ObligatoryIcon />
              </FieldLabel>
              <Combobox
                value={selectedLabelName}
                items={labels.data}
                onValueChange={(value) => handleSelectLabel(value)}
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
              <input
                type="hidden"
                name="labelInsumos"
                value={selectedLabelId}
              />
              {state?.errors?.labelInsumos?.errors[0] && (
                <p className="text-red-500 text-xs">
                  * {state.errors.labelInsumos.errors[0]}
                </p>
              )}
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
              <Button
                variant="default"
                type="submit"
                disabled={isPending}
                className="cursor-pointer"
              >
                {isPending ? "Subiendo..." : "Subir archivo"}
              </Button>{" "}
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFiles;
