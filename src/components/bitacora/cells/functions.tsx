import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteRowBitacora } from "@/lib/bitacora/deleteRow";
import { formatData } from "@/lib/formatters/formatData";
import { BitacoraTable } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

type BitacoraTableMeta = {
    setDefaultData: (data: BitacoraTable) => void;
    handleToEdit: () => void;
    handleOpenForm: () => void;
};

const CellFunctions = (props: CellContext<BitacoraTable, unknown>) => {
    const deleteRowBitacoraHandler = (id: string) => {
        toast.promise(deleteRowBitacora(id), {
            loading: "Eliminando registro...",
            success: "Registro eliminado correctamente.",
            error: "Error eliminado este registro, intente nuevamente más tarde.",
            position: "top-center",
        });
    };
    const handleClick = () => {
        const data: BitacoraTable = props.row.original;
        // 1. Cast the meta to your custom interface
        const meta = props.table.options.meta as
            | BitacoraTableMeta
            | undefined;
        // 2. Now TypeScript knows these functions exist!
        meta?.setDefaultData({
            id: data.id,
            username: data.username,
            account_id: data.account_id?.name ?? "",
            channel: formatData(data.channel_bitacora?.name ?? ""),
            link: data.link,
            category: formatData(data.category_bitacora?.name ?? ""),
            // Typo fix from before:
            area_responsable: formatData(
                data.responsable_area_bitacora?.name ?? "",
            ),
            description: data.description,
            colonia: data.colonia,
            social_network: formatData(
                data.social_network_bitacora?.name ?? "",
            ),
            priority: formatData(data.priority_bitacora?.name ?? ""),
            status: formatData(data.status_bitacora?.name ?? ""),
            folio: data.folio,
            observations: data.observations,
        });
        meta?.handleToEdit();
        meta?.handleOpenForm();
    };
    return (
        <div className="w-full">
            <div className="w-full flex items-center justify-center gap-4">
                <button
                    onClick={handleClick}
                    className="p-1 cursor-pointer bg-green-700/50 hover:bg-green-700 transition-colors duration-300 rounded-md"
                >
                    <Pencil className="text-white" size={20} />
                </button>
                <button className="p-1 cursor-pointer bg-red-500/50 hover:bg-red-500 transition-colors duration-300 rounded-md">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Trash className="text-white" size={20} />
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
                </button>
            </div>
        </div>
    );
}

export default CellFunctions
