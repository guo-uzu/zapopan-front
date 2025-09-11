"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Inputs } from "@/hooks/types"

export const columns: ColumnDef<Inputs>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "account",
    header: "Cuenta",
  },
  {
    accessorKey: "chanel",
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
    accessorKey: "date",
    header: "Fecha de la solicitud",
  },
  {
    accessorKey: "category",
    header: "Categoría",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "area_responsable",
    header: "Área responsable",
  },
  {
    accessorKey: "colonia",
    header: "Colonia",
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
  },
  {
    accessorKey: "status",
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