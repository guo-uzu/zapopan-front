"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Inputs } from "@/hooks/types"

export const columns: ColumnDef<Inputs>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "account_bitacora.name",
    header: "Cuenta",
  },
  {
    accessorKey: "channel_bitacora.name",
    header: "Canal",
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
