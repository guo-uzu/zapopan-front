"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Inputs } from "@/hooks/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { sendDataSupabase } from "@/hooks/sendData";
import { updateDataSupabase } from "@/lib/data/updateRowBitacora";
import { toast } from "sonner";
import FilterSelector from "./filter-selector";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";

interface FormProps {
    defaultData: Partial<Inputs>;
    toEdit: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setDefaultData: Dispatch<SetStateAction<{}>>;
    open: boolean;
    handleToEdit: () => void;
}

const emptyValues: Inputs = {
    username: "",
    account: "",
    channel: "",
    link: "",
    category: "",
    area_responsable: "",
    description: "",
    colonia: "",
    social_network: "",
    priority: "",
    status: "",
    folio: "",
    observations: "",
    created_at: new Date().toISOString().substr(0, 10)

};

export default function FormBitacora({
    defaultData,
    toEdit,
    setOpen,
    open,
    handleToEdit,
    setDefaultData,
}: FormProps) {
    const { register, handleSubmit, control, reset } = useForm<Inputs>({
        defaultValues: Object.keys(defaultData).length > 0 ? defaultData : emptyValues
    });


    useEffect(() => {
        if (defaultData) {
            reset(defaultData);
        }
    }, [defaultData, reset]);

    const saveData: SubmitHandler<Inputs> = async (dataForm) => {
        if (!toEdit) {
            toast.promise(sendDataSupabase(dataForm), {
                loading: "Enviando datos...",
                success: () => {
                    setDefaultData({});
                    setOpen(false);
                    reset(emptyValues);
                    return "Datos enviados correctamente!";
                },
                error: "Error enviando datos, intente nuevamente",
                position: "top-center",
            });
            return;
        }
        toast.promise(updateDataSupabase(dataForm), {
            loading: "Actualizando datos...",
            success: () => {
                setDefaultData({});
                setOpen(false);
                handleToEdit();
                reset(emptyValues);
                return "Datos actualizados correctamente!";
            },
            error: "Error actualizando datos, intente nuevamente",
            position: "top-center",
        });
        return;
    };

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen && toEdit) {
                    setDefaultData({});
                    setOpen(false);
                    handleToEdit();
                    reset(emptyValues);
                }
            }}
        >
            <SheetContent side="right" className="overflow-y-scroll">
                <SheetHeader>
                    <SheetTitle>Formulario de bitácora</SheetTitle>
                </SheetHeader>
                <form
                    onSubmit={handleSubmit(saveData)}
                    className="grid flex-1 auto-rows-min gap-6 px-4 pb-4"
                >
                    <FieldGroup className="flex flex-col gap-6">
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="username">
                                        Nombre de usuario
                                    </FieldLabel>
                                    <Input
                                        {...register("username")}
                                        id="username"
                                        type="text"
                                        name="username"
                                    />
                                </Field>
                            </FieldGroup>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="created_at">
                                        Fecha
                                    </FieldLabel>
                                    <Input
                                        {...register("created_at")}
                                        id="created_at"
                                        type="date"
                                        name="created_at"
                                    />
                                </Field>
                            </FieldGroup>
                            <div className="grid grid-cols-2 gap-4">
                                <FilterSelector
                                    control={control}
                                    column={ColumnsBitacoraOpts.account_id}
                                    name="account"
                                    label="Cuenta"
                                />
                                <FilterSelector
                                    control={control}
                                    column={ColumnsBitacoraOpts.channel}
                                    name="channel"
                                    label="Canal"
                                />
                            </div>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="link">
                                        Enlace a perfil/publicación
                                    </FieldLabel>
                                    <Input
                                        {...register("link")}
                                        id="link"
                                        type="text"
                                        name="link"
                                        autoComplete="off"
                                    />
                                </Field>
                            </FieldGroup>
                            <FieldGroup className="grid grid-cols-2 gap-4">
                                <FilterSelector
                                    control={control}
                                    column={ColumnsBitacoraOpts.category}
                                    name="category"
                                    label="Categoría"
                                />
                                <FilterSelector
                                    control={control}
                                    column={
                                        ColumnsBitacoraOpts.area_id
                                    }
                                    name="area_responsable"
                                    label="Área responable"
                                />
                            </FieldGroup>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="description">
                                        Descripción
                                    </FieldLabel>
                                    <Textarea
                                        {...register("description")}
                                        id="description"
                                        name="description"
                                        placeholder="Escribe la descripción aquí..."
                                    />
                                </Field>
                            </FieldGroup>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="colonia">
                                        Colonia
                                    </FieldLabel>
                                    <Input
                                        {...register("colonia")}
                                        id="colonia"
                                        type="text"
                                        name="colonia"
                                    />
                                </Field>
                            </FieldGroup>
                            <FieldGroup className="grid grid-cols-3 gap-4">
                                <FilterSelector
                                    control={control}
                                    column={ColumnsBitacoraOpts.social_network}
                                    name="social_network"
                                    label="Red Social"
                                />
                                <FilterSelector
                                    control={control}
                                    column={ColumnsBitacoraOpts.priority}
                                    name="priority"
                                    label="Prioridad"
                                />
                                <FilterSelector
                                    control={control}
                                    column={ColumnsBitacoraOpts.status}
                                    name="status"
                                    label="Estatus"
                                />
                            </FieldGroup>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="folio">
                                        Folio
                                    </FieldLabel>
                                    <Input
                                        {...register("folio")}
                                        id="folio"
                                        type="text"
                                        name="folio"
                                    />
                                </Field>
                            </FieldGroup>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="observations">
                                        Observaciones y comentarios
                                    </FieldLabel>
                                    <Textarea
                                        {...register("observations")}
                                        id="observations"
                                        name="observations"
                                        placeholder="Escribe las observaciones y comentarios aquí..."
                                    />
                                </Field>
                            </FieldGroup>
                            {toEdit ? (
                                <Button
                                    onClick={() => setOpen(!open)}
                                    type="submit"
                                    className="w-full"
                                >
                                    Actualizar
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setOpen(!open)}
                                    type="submit"
                                    className="w-full"
                                >
                                    Guardar
                                </Button>
                            )}
                            <Button
                                type="reset"
                                onClick={() => reset(emptyValues)}
                                variant="secondary"
                            >
                                Borrar
                            </Button>
                        </FieldSet>
                    </FieldGroup>
                </form>
            </SheetContent>
        </Sheet>
    );
}
