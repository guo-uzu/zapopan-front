/**
 * @import BitacoraTable is the types of each column that accepts the table
 * @import ColumnDef is a type to define columns part of the tanstack library
 * @exports columns is the bitacora table columns. Here represents all of the cells of each column
 */

import { BitacoraTable } from "@/types/bitacoraTable";
import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<BitacoraTable>[] = [
    {
        accessorFn: (row) => `
          ${row.user_id?.full_name ? row.user_id?.full_name : "N/A"} ${row.created_by_name ? `(${row.created_by_name})` : ""}
          `,
        id: "userName",
        header: "Nombre",
        cell: (props) => (
            <span className="overflow-hidden w-full h-full">
                {props.getValue() as string}
            </span>
        ),
        size: 200,
    },
];
