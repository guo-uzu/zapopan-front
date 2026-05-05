
// import SocialNetwork from "@/components/columns/social-network";
// import { BitacoraTable } from "@/types/bitacoraTable";
// import { ColumnDef } from "@tanstack/react-table";
// import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
// import { Badge } from "../ui/badge";
// import {
//     Building,
//     CircleUser,
//     Compass,
//     Inbox,
//     ListRestart,
//     MessageCircle,
//     Pencil,
//     Share,
//     Shield,
//     SignalHigh,
//     SignalLow,
//     SignalMedium,
//     Siren,
//     SquareCheckBig,
//     Trash,
//     TriangleAlert,
// } from "lucide-react";
// import { deleteRowBitacora } from "@/hooks/deleteRow";
// import { formatData } from "@/lib/formatters/formatData";

// import {
//     AlertDialog,
//     AlertDialogTrigger,
//     AlertDialogContent,
//     AlertDialogTitle,
//     AlertDialogDescription,
//     AlertDialogCancel,
//     AlertDialogAction,
// } from "../ui/alert-dialog";
// import { toast } from "sonner";
// import { AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog";
// import { toTimestamp } from "@/lib/timestamp";
// import { dateRangeFilterFn } from "@/lib/filterDate";



// /**
//  * Columns of the table Bitacora. All of these columns format the data comming from the array of info with the objects
//  * It's imported in app/bitacora/page.tsx to create the table
//  */

// export const columns: ColumnDef<BitacoraTable>[] = [
//     {
//         accessorFn: (row) => row.user_id?.full_name ?? "Usuario desconocido",
//         id: "userName",
//         header: "Nombre",
//         cell: (props) => (
//             <span className="overflow-hidden w-full h-full">
//                 {props.getValue() as string}
//             </span>
//         ),
//         size: 200,
//     },
//     {
//         accessorFn: (row) => row.social_network_bitacora?.name ?? "",
//         id: "socialNetwork",
//         header: "Redes Sociales",
//         cell: (props) => <SocialNetwork props={props} />,
//         size: 150,
//         minSize: 150,
//         maxSize: 150,
//         enableColumnFilter: true,
//         filterFn: "includesString",
//     },
//     {
//         accessorFn: (row) => row.account_bitacora?.name ?? "Cuenta desconocida",
//         id: "account name",
//         header: "Cuenta",
//         cell: (props) => {
//             const color: string | undefined = ColumnsBitacoraOpts.account.find(
//                 (e) => e.id === props.getValue(),
//             )?.color;

//             return (
//                 <div className="w-full flex items-center justify-center">
//                     <Badge
//                         style={{ color: color }}
//                         className={`w-full ${props.getValue() === "jjf" ? "uppercase" : "capitalize"} rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none`}
//                     >
//                         {props.getValue() === "jjf" ? (
//                             <CircleUser />
//                         ) : (
//                             <Shield />
//                         )}
//                         {props.getValue() as string}
//                     </Badge>
//                 </div>
//             );
//         },
//         size: 150,
//         minSize: 150,
//         maxSize: 150,
//         enableColumnFilter: true,
//         filterFn: "includesString",
//     },
//     {
//         accessorFn: (row) =>
//             row?.channel_bitacora?.name ?? "Usuario no encontrado",
//         id: "channel",
//         header: "Canal",
//         cell: (props) => {
//             const color: string | undefined = ColumnsBitacoraOpts.channel.find(
//                 (e) => e.id === props.getValue(),
//             )?.color;
//             return (
//                 <Badge
//                     style={{ color: color }}
//                     className="w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
//                 >
//                     {props.getValue() === "comentarios" ? (
//                         <MessageCircle />
//                     ) : (
//                         <Inbox />
//                     )}
//                     {props.getValue() as string}
//                 </Badge>
//             );
//         },
//         size: 160,
//         minSize: 160,
//         maxSize: 160,
//     },
//     {
//         accessorFn: (row) => row?.username ?? "Usuario no encontrado",
//         header: "Nombre de usuario",
//         size: 200,
//         minSize: 150,
//         maxSize: 300,
//     },
//     {
//         accessorFn: (row) => row?.link ?? "",
//         header: "Enlace a perfil/publicación",
//         cell: ({ row }) => {
//             return (
//                 <div className="w-full text-center mx-auto bg-white">
//                     <a
//                         target="_blank"
//                         className="text-blue-500 underline underline-offset-2"
//                     >
//                         Enlace
//                     </a>
//                 </div>
//             );
//         },
//     },
//     {
//         accessorKey: "created_at",
//         accessorFn: (row) => toTimestamp(row.created_at) ?? "",
//         filterFn: dateRangeFilterFn,
//         enableColumnFilter: true,
//         header: "Fecha de la solicitud",
//         cell: ({ row }) => {
//             const rawDate: Date = new Date(row.getValue("created_at"));
//             const day = ("0" + rawDate.getDate()).slice(-2);
//             const month = ("0" + (rawDate.getMonth() + 1)).slice(-2);
//             return (
//                 <div className="text-center">
//                     {day} / {month} / {rawDate.getFullYear()}
//                 </div>
//             );
//         },
//         size: 160,
//     },
//     {
//         accessorFn: (row) =>
//             row?.category_bitacora?.name ?? "Categoría no encontrada",
//         accessorKey: "category_bitacora.name",
//         id: "category",
//         header: "Categoría",
//         cell: (props) => {
//             const color: string | undefined = ColumnsBitacoraOpts.category.find(
//                 (e) => e.value === props.getValue(),
//             )?.color;
//             return (
//                 <div className="w-full flex items-center justify-center">
//                     <Badge
//                         style={{ color: color }}
//                         className="w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
//                     >
//                         <Siren />
//                         <span className="truncate max-w-48">
//                             {props.getValue() as string}
//                         </span>
//                     </Badge>
//                 </div>
//             );
//         },
//         size: 200,
//         maxSize: 200,
//     },
//     {
//         accessorFn: (row) => row?.description ?? "Descripción no proporcionada",
//         header: "Descripción",
//         size: 250,
//     },
//     {
//         accessorKey: "responsable_area_bitacora.name",
//         id: "area",
//         header: "Área responsable",
//         cell: (props) => {
//             const color: string | undefined =
//                 ColumnsBitacoraOpts.area_responsable.find(
//                     (e) => e.value === props.getValue(),
//                 )?.color;
//             return (
//                 <div className="w-full flex items-center justify-center">
//                     <Badge
//                         style={{ color: color }}
//                         className="truncate w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
//                     >
//                         <Building />
//                         <span className="max-w-48 truncate">
//                             {props.getValue() as string}
//                         </span>
//                     </Badge>
//                 </div>
//             );
//         },
//         size: 200,
//     },
//     {
//         accessorFn: (row) => row?.colonia ?? "Colonia no encontrado",
//         header: "Colonia",
//         size: 200,
//     },
//     {
//         accessorFn: (row) =>
//             row?.priority_bitacora?.name ?? "Prioridad no encontrada",
//         id: "priority",
//         header: "Prioridad",
//         cell: (props) => {
//             const color: string | undefined = ColumnsBitacoraOpts.priority.find(
//                 (e) => e.id === props.getValue(),
//             )?.color;
//             return (
//                 <div className="w-full flex items-center justify-center">
//                     <Badge
//                         style={{ color: color }}
//                         className="w-full capitalize rounded-full border-none shadow-xl bg-current/10  focus-visible:outline-none"
//                     >
//                         {props.getValue() === "baja" ? (
//                             <SignalLow />
//                         ) : props.getValue() === "media" ? (
//                             <SignalMedium />
//                         ) : props.getValue() === "alta" ? (
//                             <SignalHigh />
//                         ) : (
//                             ""
//                         )}
//                         {props.getValue() as string}
//                     </Badge>
//                 </div>
//             );
//         },
//         size: 120,
//         minSize: 120,
//         maxSize: 120,
//     },
//     {
//         accessorKey: "status_bitacora.name",
//         id: "status",
//         header: "Estatus",
//         cell: (props) => {
//             const color: string | undefined = ColumnsBitacoraOpts.status.find(
//                 (e) => e.id === formatData(props.getValue() as string),
//             )?.color;
//             return (
//                 <div className="w-full flex items-center justify-center">
//                     <Badge
//                         style={{ color: color }}
//                         className="w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
//                     >
//                         {props.getValue() === "resuelto" ? (
//                             <SquareCheckBig />
//                         ) : props.getValue() === "pendiente" ? (
//                             <TriangleAlert />
//                         ) : props.getValue() === "dirección" ? (
//                             <Compass />
//                         ) : (
//                             <ListRestart />
//                         )}
//                         {props.getValue() as string}
//                     </Badge>
//                 </div>
//             );
//         },
//         size: 130,
//         minSize: 130,
//         maxSize: 130,
//     },
//     {
//         accessorKey: "folio",
//         header: "Folio",
//         size: 150,
//     },
//     {
//         accessorKey: "observations",
//         header: "Observaciones y comentarios",
//         size: 250,
//         cell: ({ row }) => {
//             const data = row.original.observations;
//             if (data) {
//                 const splitedText = data.split(/(https?:\/\/[^\s]+)/g);
//                 return splitedText.map((text, index) => {
//                     if (text.match(/https?:\/\/[^\s]+/)) {
//                         return (
//                             <a
//                                 key={index}
//                                 href={text}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-500 underline hover:text-blue-700"
//                             >
//                                 {text}
//                             </a>
//                         );
//                     }
//                     return <div>{text}</div>;
//                 });
//             }
//         },
//     },
//     {
//         accessorKey: "updated_at",
//         header: "Ultima actualización",
//         cell: ({ row }) => {
//             const rawDate = new Date(row.getValue("updated_at"));
//             const day = ("0" + rawDate.getDate()).slice(-2);
//             const month = ("0" + (rawDate.getMonth() + 1)).slice(-2);
//             return (
//                 <div className="text-center">
//                     {day} / {month} / {rawDate.getFullYear()}
//                 </div>
//             );
//         },
//         size: 150,
//     },
//     {
//         accessorFn: (row) => row.latest_updated_user_id?.full_name ?? "N/A",
//         header: "Ultimo en actualizar",
//         cell: (props) => (
//             <span className="overflow-hidden">
//                 {props.getValue() as string}
//             </span>
//         ),
//         size: 200,
//     },
//     {
//         accessorKey: "functions",
//         header: "Edita/Elimina",
//         maxSize: 450,
//         cell: ({ row, table }) => {
//             const deleteRowBitacoraHandler = async (id?: string) => {
//                 toast.promise(deleteRowBitacora(id), {
//                     loading: "Eliminando registro...",
//                     success: "Registro eliminado correctamente.",
//                     error: "Error eliminado este registro, intente nuevamente más tarde.",
//                     position: "top-center",
//                 });
//             };
//             const handleClick = () => {
//                 const data = row.original;
//                 // 1. Cast the meta to your custom interface
//                 const meta = table.options.meta as
//                     | BitacoraTableMeta
//                     | undefined;
//                 // 2. Now TypeScript knows these functions exist!
//                 meta?.setDefaultData({
//                     id: data.id,
//                     username: data.username ?? "",
//                     account: data.account_bitacora?.name ?? "",
//                     channel: formatData(data.channel_bitacora?.name ?? ""),
//                     link: data.link ?? "",
//                     category: formatData(data.category_bitacora?.name ?? ""),
//                     // Typo fix from before:
//                     area_responsable: formatData(
//                         data.area_bitacora?.name ?? "",
//                     ),
//                     description: data.description ?? "",
//                     colonia: data.colonia,
//                     social_network: formatData(
//                         data.social_network_bitacora?.name ?? "",
//                     ),
//                     priority: formatData(data.priority_bitacora?.name ?? ""),
//                     status: formatData(data.status_bitacora?.name ?? ""),
//                     folio: data.folio ?? "",
//                     observations: data.observations,
//                 });
//                 meta?.handleToEdit();
//                 meta?.handleOpenForm();
//             };
//             return (
//                 <div className="w-full">
//                     <div className="w-full flex items-center justify-center gap-4">
//                         <button
//                             onClick={handleClick}
//                             className="p-1 cursor-pointer bg-green-500 rounded-md"
//                         >
//                             <Pencil className="text-white" />
//                         </button>
//                         <button className="p-1 cursor-pointer bg-red-500 rounded-md">
//                             <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                     <Trash className="text-white" />
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                     <AlertDialogHeader>
//                                         <AlertDialogTitle>
//                                             ¿Estás completamente seguro?
//                                         </AlertDialogTitle>
//                                         <AlertDialogDescription>
//                                             Estás eliminado un registro de la
//                                             bitácora. Esta acción no se puede
//                                             deshacer.
//                                         </AlertDialogDescription>
//                                     </AlertDialogHeader>
//                                     <AlertDialogFooter>
//                                         <AlertDialogCancel>
//                                             Cancelar
//                                         </AlertDialogCancel>
//                                         <AlertDialogAction
//                                             onClick={() =>
//                                                 deleteRowBitacoraHandler(
//                                                     row.original.id,
//                                                 )
//                                             }
//                                         >
//                                             Continuar
//                                         </AlertDialogAction>
//                                     </AlertDialogFooter>
//                                 </AlertDialogContent>
//                             </AlertDialog>
//                         </button>
//                     </div>
//                 </div>
//             );
//         },
//     },
//     {
//         accessorKey: "shared",
//         id: "makeItPublic",
//         header: "Público",
//         cell: ({ row }) => <Share id={row.original.id} />,
//         size: 130,
//         minSize: 130,
//         maxSize: 130,
//     },
// ];
