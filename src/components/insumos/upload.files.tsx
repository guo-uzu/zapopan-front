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
  ComboboxChips,
  ComboboxValue,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from "../ui/combobox";
import React from "react";
const labels = [
  { name: "salud", id: "salud" },
  { name: "educación", id: "educacion" },
  { name: "presupuesto", id: "presupuesto" },
  { name: "transporte", id: "transporte" },
  { name: "Informe anual", id: "informe-anual" },
  { name: "seguimiento", id: "seguimiento" },
];
const UploadFiles = () => {
  const [state, setAction, isPending] = useActionState(postInsumos, undefined);
  const anchor = useComboboxAnchor();
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
              <Textarea
                name="descriptionInsumos"
                id="description-insumos"
                placeholder="¿Qué es este documento y para que sirve?"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="label-insumos">Etiquetas</FieldLabel>
              <Combobox
                multiple
                autoHighlight
                items={labels}
              >
                <ComboboxChips ref={anchor} className="w-full max-w-xs">
                  <ComboboxValue>
                    {(values) => {
                      console.log(values)
                      return (
                        <React.Fragment>
                          {values.map((value: string) => (
                            <ComboboxChip key={value}>
                              {value}
                            </ComboboxChip>
                          ))}
                          <ComboboxChipsInput />
                        </React.Fragment>
                      )
                    }}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => {
                      console.log(item)
                      return (
                        <ComboboxItem key={item.id} value={item.id}>
                          {item.name}
                        </ComboboxItem>
                      )
                    }}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="flex cursor-pointer">
              Cerrar
            </Button>
          </DialogClose>
          <Button variant="default">Subir archivo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFiles;
