"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Inputs } from "@/hooks/types"

export const columns: ColumnDef<Inputs>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorFn: (row) => row.account_bitacora?.name,
    id: "account name",
    header: "Cuenta",
    cell: ({ row }) => {
      if (row.getValue("account name") === "jjf") {
        return <div className="px-4 rounded-md font-bold uppercase text-white bg-purple-400 text-center">{row.getValue("account name")}</div>
      } else {
        return <div className="px-4 rounded-md  font-bold capitalize text-center border-2 bg-orange-500">{row.getValue("account name")}</div>
      }
    }
  },
  {
    accessorFn: (row) => row.channel_bitacora.name,
    id: "canal",
    header: "Canal",
    cell: ({ row }) => {
      return <div className="px-4 rounded-md capitalize border-2 border-purple-400 text-center">{row.getValue("canal")}</div>
    }
  },
  {
    accessorKey: "username",
    header: "Nombre de usuario",
  },
  {
    accessorKey: "link",
    header: "Enlace a perfil/publicación",
  },
  {
    accessorKey: "created_at",
    header: "Fecha de la solicitud",
  },
  {
    accessorKey: "category_bitacora.name",
    header: "Categoría",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "responsable_area_bitacora.name",
    header: "Área responsable",
  },
  {
    accessorKey: "colonia",
    header: "Colonia",
  },
  {
    accessorKey: "priority_bitacora.name",
    header: "Prioridad",
  },
  {
    accessorKey: "status_bitacora.name",
    header: "Estatus",
  },
  {
    accessorKey: "direction",
    header: "Dirección",
  },
  {
    accessorKey: "folio",
    header: "Folio",
  },
  {
    accessorKey: "observations",
    header: "Observaciones y comentarios",
  },
]
