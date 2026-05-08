"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteRowBitacora } from "@/lib/bitacora/deleteRow";
import { formatData } from "@/lib/formatters/formatData";
import { BitacoraRecord, BitacoraTableMeta } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

const CellFunctions = (props: CellContext<BitacoraRecord, unknown>) => {
    const deleteRowBitacoraHandler = (id: string) => {
        toast.promise(deleteRowBitacora(id), {
            loading: "Eliminando registro...",
            success: "Registro eliminado correctamente.",
            error: "Error eliminado este registro, intente nuevamente más tarde.",
            position: "top-center",
        });
    };
    const handleClick = () => {
        const data: BitacoraRecord = props.row.original;
        // 1. Cast the meta to your custom interface
        const meta = props.table.options.meta as
            | BitacoraTableMeta
            | undefined;
        if (!meta) {
            return
        }
        // 2. Now TypeScript knows these functions exist!
        meta?.setDefaultData({
            id: data.id,
            username: data.username,
            created_at: new Date(data.created_at).toISOString().substr(0, 10),
            account: formatData(data.account_id?.name ?? ""),
            channel: formatData(data.channel_id?.name ?? ""),
            link: data.link,
            category: formatData(data.category_id?.name ?? ""),
            // Typo fix from before:
            area_responsable: formatData(
                data.area_id?.name ?? "",
            ),
            description: data.description,
            colonia: data.colonia,
            social_network: formatData(
                data.social_network_id?.name ?? "",
            ),
            priority: formatData(data.priority_id?.name ?? ""),
            status: formatData(data.status_id?.name ?? ""),
            folio: data.folio,
            observations: data.observations,
        });
        meta?.handleToEdit();
        meta?.handleOpenForm();
    };
    return (
        <div className="w-full flex items-center justify-center gap-4">
            <button
                onClick={handleClick}
                className="p-1 cursor-pointer bg-green-700/50 hover:bg-green-700 transition-colors duration-300 rounded-md"
            >
                <Pencil className="text-white" size={20} />
            </button>
            <div >
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="p-1 cursor-pointer bg-red-500/50 hover:bg-red-500 transition-colors duration-300 rounded-md">
                            <Trash className="text-white" size={20} />
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                ¿Estás completamente seguro?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Estás por eliminar un registro de la
                                bitácora. Esta acción no se puede
                                deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="cursor-pointer"
                                onClick={() => deleteRowBitacoraHandler(props.row.original.id)}
                            >
                                Continuar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

export default CellFunctions
