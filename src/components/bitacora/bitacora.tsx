"use client"
/**
 * @import BitacoraTable is the types of each column that accepts the table
 * @import ColumnDef is a type to define columns part of the tanstack library
 * @exports columns is the bitacora table columns. Here represents all of the cells of each column
 */

import { BitacoraRecord } from "@/types/bitacoraTable";
import { ColumnDef } from "@tanstack/react-table";
import CellAcount from "./cells/account";
import CellArea from "./cells/area";
import CellCategory from "./cells/category";
import CellSocialMedia from "./cells/social_media";
import CellChannel from "./cells/channel";
import CellStatus from "./cells/status";
import CellPriority from "./cells/priority";
import CellLink from "./cells/link";
import CellUsername from "./cells/username";
import CellDate from "./cells/date";
import CellUserUpdated from "./cells/userUpdated";
import CellValue from "./cells/value";
import CellObservations from "./cells/obervations";
import CellFunctions from "./cells/functions";
import CellPlainText from "./cells/plainText";
import Share from "./cells/share";

export const columns: ColumnDef<BitacoraRecord>[] = [
  {
    accessorFn: (row) => `
          ${row.user_id?.full_name ?? "N/A"} ${row.created_by_name ? `(${row.created_by_name})` : ""}
          `,
    header: "Nombre",
    cell: CellPlainText,
    size: 200,
  },
  {
    accessorFn: (row) => `${row.account_id?.name ?? "N/A"}`,
    header: "Cuenta",
    cell: CellAcount,
    size: 150
  },
  {
    accessorFn: (row) => `${row.area_id?.name ?? "N/A"}`,
    header: "Area",
    cell: CellArea,
    size: 200
  },
  {
    accessorFn: (row) => `${row.channel_id?.name ?? "N/A"}`,
    header: "Canal",
    cell: CellChannel,
    size: 200
  },
  {
    accessorFn: (row) => `${row.category_id?.name ?? "N/A"}`,
    header: "Categoría",
    cell: CellCategory,
    size: 200
  },
  {
    accessorFn: (row) => `${row.social_network_id?.name ?? "N/A"}`,
    header: "Red social",
    cell: CellSocialMedia,
    size: 150
  },
  {
    accessorFn: (row) => `${row.priority_id?.name ?? "N/A"}`,
    header: "Prioridad",
    cell: CellPriority,
    size: 150
  },
  {
    accessorFn: (row) => `${row.status_id?.name ?? "N/A"}`,
    header: "Estatus",
    cell: CellStatus,
    size: 150
  },
  {
    accessorFn: (row) => `${row.username ?? "N/A"}`,
    header: "Usuario",
    cell: CellUsername,
    size: 200
  },
  {
    accessorFn: (row) => `${row.link ?? "N/A"}`,
    header: "Enlace",
    cell: CellLink,
    size: 130
  },
  {
    accessorFn: (row) => `${row.description ?? "N/A"}`,
    header: "Descripción",
    cell: CellPlainText,
    size: 200
  },
  {
    accessorFn: (row) => `${row.colonia ?? "N/A"}`,
    header: "Colonia",
    cell: CellValue,
    size: 150
  },
  {
    accessorFn: (row) => `${row.created_at ?? "N/A"}`,
    header: "Creado",
    cell: CellDate,
    size: 100
  },
  {
    accessorFn: (row) => `${row.updated_at ?? "N/A"}`,
    header: "Actualizado",
    cell: CellDate,
    size: 100
  },
  {
    accessorFn: (row) => `${row.latest_updated_user_id?.full_name ?? "N/A"}`,
    header: "Usuario que actualizó",
    cell: CellUserUpdated,
    size: 150
  },
  {
    accessorFn: (row) => `${row.folio ?? "N/A"}`,
    header: "Folio",
    cell: CellValue,
    size: 150
  },
  {
    accessorFn: (row) => `${row.observations ?? "N/A"}`,
    header: "Observaciones",
    cell: CellObservations,
    size: 200
  },
  {
    header: "Edita / Elimina",
    maxSize: 100,
    cell: CellFunctions,
  },
  {
    header: "Comparte",
    maxSize: 100,
    cell: Share
  }
];
