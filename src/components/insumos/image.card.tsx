"use client";

import { useState, useEffect, useTransition, useActionState } from "react";
import { createPortal } from "react-dom";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field";
import ObligatoryIcon from "../bitacora/obligatoryIcon";
import FilterPill from "./filter.pill";
import { deleteInsumo } from "@/lib/insumos/insumosOperations";
import { editInsumo } from "@/lib/insumos/editInsumo";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { Insumo, LabelsList } from "./grid.insumos";

interface ImageCardProps {
  thumbnailSrc: string;
  element: Insumo;
  downloadSrc: string;
  previewSrc: string;
  labels: LabelsList;
}

export function ImageCard({
  thumbnailSrc,
  element,
  downloadSrc,
  previewSrc,
  labels,
}: ImageCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editState, editAction, isEditing] = useActionState(
    editInsumo,
    undefined,
  );
  const [selectedLabelName, setSelectedLabelName] = useState<string>(
    element.label_id.name,
  );
  const [selectedLabelId, setSelectedLabelId] = useState<string>(
    element.label_id.id_public,
  );

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
  // Prevent SSR hydration errors by confirming client mount before using document.body
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!editState) return;
    if (editState.ok) {
      toast.success("Insumo actualizado", { position: "top-center" });
      setEditOpen(false);
    } else if (editState.formError) {
      toast.error(editState.formError, { position: "top-center" });
    }
  }, [editState]);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteInsumo(element.id_public);
        toast.success("Insumo eliminado", { position: "top-center" });
        setDeleteOpen(false);
      } catch {
        toast.error("No se pudo eliminar el insumo", {
          position: "top-center",
        });
      }
    });
  };

  const currentDate = String(element.created_at ?? "").split("T")[0];
  return (
    <>
      <Card>
        <CardHeader className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{element.title}</CardTitle>
            {element.description && (
              <CardDescription>{element.description}</CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80 overflow-hidden rounded-md">
            <img
              src={thumbnailSrc}
              alt={element.title}
              className="object-cover w-full h-full cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setOpen(true)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <FilterPill name={element.label_id.name} />{" "}
          <div id="card-btns" className="flex gap-x-2">
            <Dialog
              open={editOpen}
              onOpenChange={(next) => {
                setEditOpen(next);
                if (next) {
                  setSelectedLabelName(element.label_id.name);
                  setSelectedLabelId(element.label_id.id_public);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="outline"
                  className="cursor-pointer shrink-0"
                >
                  <PencilIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Editar insumo</DialogTitle>
                <DialogDescription>
                  Cambia los datos de este insumo.
                </DialogDescription>
                <form action={editAction}>
                  <input
                    type="hidden"
                    name="idInsumo"
                    value={element.id_public}
                  />
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor={`file-insumo-${element.id_public}`}>
                        Archivo
                      </FieldLabel>
                      <FieldDescription>
                        Sube un archivo si quieres que se sobreescriba. Sino,
                        dejalo vacío.
                      </FieldDescription>
                      <Input
                        type="file"
                        name="fileInsumo"
                        id={`file-insumo-${element.id_public}`}
                      />
                      {editState?.errors?.fileInsumo?.errors[0] && (
                        <p className="text-red-500 text-xs">
                          * {editState.errors.fileInsumo.errors[0]}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`title-insumo-${element.id_public}`}>
                        Evento/Reporte
                        <ObligatoryIcon />
                      </FieldLabel>
                      <Input
                        type="text"
                        name="titleInsumo"
                        id={`title-insumo-${element.id_public}`}
                        defaultValue={
                          editState?.fields?.titleInsumo !== undefined
                            ? String(editState.fields.titleInsumo)
                            : element.title
                        }
                      />
                      {editState?.errors?.titleInsumo?.errors[0] && (
                        <p className="text-red-500 text-xs">
                          * {editState.errors.titleInsumo.errors[0]}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel
                        htmlFor={`description-insumo-${element.id_public}`}
                      >
                        Descripción
                      </FieldLabel>
                      <Textarea
                        name="descriptionInsumo"
                        id={`description-insumo-${element.id_public}`}
                        placeholder="¿Qué es este documento y para que sirve?"
                        defaultValue={
                          editState?.fields?.descriptionInsumo !== undefined
                            ? String(editState.fields.descriptionInsumo)
                            : element.description
                        }
                      />
                      {editState?.errors?.descriptionInsumo?.errors[0] && (
                        <p className="text-red-500 text-xs">
                          * {editState.errors.descriptionInsumo.errors[0]}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`date-insumo-${element.id_public}`}>
                        Fecha
                        <ObligatoryIcon />
                      </FieldLabel>
                      <Input
                        type="date"
                        name="dateInsumo"
                        id={`date-insumo-${element.id_public}`}
                        defaultValue={
                          editState?.fields?.dateInsumo !== undefined
                            ? String(editState.fields.dateInsumo)
                            : currentDate
                        }
                      />
                      {editState?.errors?.dateInsumo?.errors[0] && (
                        <p className="text-red-500 text-xs">
                          * {editState.errors.dateInsumo.errors[0]}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldTitle>
                        Etiqueta
                        <ObligatoryIcon />
                      </FieldTitle>
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
                              <ComboboxItem
                                key={item.id_public}
                                value={item.name}
                              >
                                {item.name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <input
                        type="hidden"
                        name="labelInsumo"
                        value={selectedLabelId}
                      />
                      {editState?.errors?.labelInsumo?.errors[0] && (
                        <p className="text-red-500 text-xs">
                          * {editState.errors.labelInsumo.errors[0]}
                        </p>
                      )}
                    </Field>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="cursor-pointer"
                        >
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        disabled={isEditing}
                        className="cursor-pointer"
                      >
                        {isEditing ? "Guardando..." : "Guardar"}
                      </Button>
                    </DialogFooter>
                  </FieldGroup>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button size="icon-sm" className="cursor-pointer shrink-0">
                  <TrashIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>¿Eliminar este insumo?</DialogTitle>
                <DialogDescription>
                  El archivo se ocultará del sistema. Avise al desarrollador o a
                  un administrador si es que se equivoca.
                </DialogDescription>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    disabled={isPending}
                    className="cursor-pointer"
                    onClick={handleDelete}
                  >
                    {isPending ? "Eliminando..." : "Eliminar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
      {mounted &&
        createPortal(
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={[{ src: previewSrc, download: downloadSrc }]}
            plugins={[Download, Zoom]}
            styles={{ container: { zIndex: 99999 } }}
            animation={{ zoom: 500 }}
          />,
          document.body,
        )}
    </>
  );
}
