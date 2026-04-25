/**
 * @import BitacoraTable is the types of each column that accepts the table
 * @import ColumnDef is a type to define columns part of the tanstack library
 * @exports columns is the bitacora table columns. Here represents all of the cells of each column
 */

import { BitacoraTable } from "@/types/bitacoraTable";
import { ColumnDef } from "@tanstack/react-table";
import CellAcount from "../bitacora/cells/account";
import CellArea from "../bitacora/cells/area";
import CellCategory from "../bitacora/cells/category";
import CellSocialMedia from "../bitacora/cells/social_media";
import CellChannel from "../bitacora/cells/channel";
import CellStatus from "../bitacora/cells/status";
import CellPriority from "../bitacora/cells/priority";
import CellLink from "../bitacora/cells/link";
import CellUsername from "../bitacora/cells/username";
import CellDate from "../bitacora/cells/date";
import CellUserUpdated from "../bitacora/cells/userUpdated";
import CellValue from "../bitacora/cells/value";
import CellObservations from "../bitacora/cells/obervations";
import CellFunctions from "../bitacora/cells/functions";

export const columns: ColumnDef<BitacoraTable>[] = [
    {
        accessorFn: (row) => `
          ${row.user_id?.full_name ? row.user_id?.full_name : "N/A"} ${row.created_by_name ? `(${row.created_by_name})` : ""}
          `,
        header: "Nombre",
        cell: (props) => (
            <span className="overflow-hidden w-full h-full">
                {String(props.getValue())}
            </span>
        ),
        size: 200,
    },
    {
        accessorFn: (row) => `${row.account_id?.name ? row.account_id?.name : "N/A"}`,
        header: "Cuenta",
        cell: (props) => CellAcount(props),
        size: 150
    },
    {
        accessorFn: (row) => `${row.area_id?.name ? row.area_id?.name : "N/A"}`,
        header: "Area",
        cell: (props) => CellArea(props),
        size: 200
    },
    {
        accessorFn: (row) => `${row.channel_id?.name ? row.channel_id?.name : "N/A"}`,
        header: "Canal",
        cell: (props) => CellChannel(props),
        size: 200
    },
    {
        accessorFn: (row) => `${row.category_id?.name ? row.category_id?.name : "N/A"}`,
        header: "Categoría",
        cell: (props) => CellCategory(props),
        size: 200
    },
    {
        accessorFn: (row) => `${row.social_network_id?.name ? row.social_network_id?.name : "N/A"}`,
        header: "Red social",
        cell: (props) => CellSocialMedia(props),
        size: 150
    },
    {
        accessorFn: (row) => `${row.priority_id?.name ? row.priority_id?.name : "N/A"}`,
        header: "Prioridad",
        cell: (props) => CellPriority(props),
        size: 150
    },
    {
        accessorFn: (row) => `${row.status_id?.name ? row.status_id?.name : "N/A"}`,
        header: "Estatus",
        cell: (props) => CellStatus(props),
        size: 150
    },
    {
        accessorFn: (row) => `${row.username ? row.username : "N/A"}`,
        header: "Usuario",
        cell: (props) => CellUsername(props),
        size: 200
    },
    {
        accessorFn: (row) => `${row.link ? row.link : "N/A"}`,
        header: "Enlace",
        cell: (props) => CellLink(props),
        size: 130
    },
    {
        accessorFn: (row) => `${row.description ? row.description : "N/A"}`,
        header: "Descripción",
        cell: (props) => (
            <p>{String(props.getValue())}</p>
        ),
        size: 200
    },
    {
        accessorFn: (row) => `${row.colonia ? row.colonia : "N/A"}`,
        header: "Colonia",
        cell: (props) => CellValue(props),
        size: 150
    },
    {
        accessorFn: (row) => `${row.created_at ? row.created_at : "N/A"}`,
        header: "Creado",
        cell: (props) => CellDate(props),
        size: 100
    },
    {
        accessorFn: (row) => `${row.updated_at ? row.updated_at : "N/A"}`,
        header: "Actualizado",
        cell: (props) => CellDate(props),
        size: 100
    },
    {
        accessorFn: (row) => `${row.latest_updated_user_id ? row.latest_updated_user_id : "N/A"}`,
        header: "Usuario que actualizó",
        cell: (props) => CellUserUpdated(props),
        size: 150
    },
    {
        accessorFn: (row) => `${row.folio ? row.folio : "N/A"}`,
        header: "Folio",
        cell: (props) => CellValue(props),
        size: 150
    },
    {
        accessorFn: (row) => `${row.observations ? row.observations : "N/A"}`,
        header: "Observaciones",
        cell: (props) => CellObservations(props),
        size: 200
    },
    {
        header: "Edita / Elimina",
        maxSize: 100,
        cell: (props) => CellFunctions(props),
    }
];
