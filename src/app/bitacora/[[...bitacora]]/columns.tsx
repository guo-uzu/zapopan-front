"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Inputs } from "@/hooks/types"

const pillCSS = "px-4 rounded-md font-bold text-white text-center"

export const columns: ColumnDef<Inputs>[] = [
  {
    accessorFn: (row) => `${row.users_clerk?.first_name} ${row.users_clerk?.last_name}`,
    id: "user name",
    header: "Nombre",
    cell: ({ row }) => {
      return <p>{row.getValue("user name")}</p>
    }
  },
  {
    accessorFn: (row) => row.account_bitacora?.name,
    id: "account name",
    header: "Cuenta",
    cell: ({ row }) => {
      if (row.getValue("account name") === "jjf") {
        return <div className="px-4 rounded-md font-bold uppercase text-white bg-purple-400 text-center">{row.getValue("account name")}</div>
      } else {
        return <div className="px-4 rounded-md font-bold capitalize text-white text-center bg-orange-500">{row.getValue("account name")}</div>
      }
    }
  },
  {
    accessorFn: (row) => row.channel_bitacora.name,
    id: "canal",
    header: "Canal",
    cell: ({ getValue }) => {
      if (getValue() === "Comentarios") {
        return <div className="px-4 rounded-md capitalize bg-yellow-500 font-bold text-white text-center">{getValue()}</div>
      } else {
        return <div className="px-4 rounded-md capitalize text-white bg-indigo-500 font-bold text-center">{getValue()}</div>
      }
    }
  },
  {
    accessorKey: "username",
    header: "Nombre de usuario",
    cell: ({ row }) => {
      return <div className="">{row.getValue("username")}</div>
    }
  },
  {
    accessorKey: "link",
    header: "Enlace a perfil/publicación",
    cell: ({ row }) => {
      return <div className="">{row.getValue("link")}</div>
    }
  },
  {
    accessorKey: "created_at",
    header: "Fecha de la solicitud",
    cell: ({ row }) => {
      const rawDate = new Date(row.getValue("created_at"))
      const day = ("0" + rawDate.getDate()).slice(-2)
      const month = ("0" + (rawDate.getMonth() + 1)).slice(-2)
      return <div className="text-center">{day} / {month} / {rawDate.getFullYear()}</div>
    }
  },
  {
    accessorKey: "category_bitacora.name",
    header: "Categoría",
    cell: ({ getValue }) => {
      switch (getValue()) {
        case "Solicitud de información":
          return <div className={`${pillCSS} bg-violet-500`}>{getValue()}</div>
        case "Canalización a dependencia":
          return <div className={`${pillCSS} bg-teal-500`}>{getValue()}</div>
        case "Solicitudes nuevas":
          return <div className={`${pillCSS} bg-sky-500`}>{getValue()}</div>
        case "Reportes de servicios":
          return <div className={`${pillCSS} bg-green-500`}>{getValue()}</div>
        case "Reportes de obras":
          return <div className={`${pillCSS} bg-yellow-500`}>{getValue()}</div>
        case "Reportes externos":
          return <div className={`${pillCSS} bg-orange-400`}>{getValue()}</div>
        case "Solicitudes especiales":
          return <div className={`${pillCSS} bg-cyan-500`}>{getValue()}</div>
        case "Reporte de inspección y vigilancia":
          return <div className={`${pillCSS} bg-gray-500`}>{getValue()}</div>
        case "Reportes y denuncias":
          return <div className={`${pillCSS} bg-green-400`}>{getValue()}</div>
        case "Solicitud de empleo":
          return <div className={`${pillCSS} bg-blue-800`}>{getValue()}</div>
        case "Coyuntura":
          return <div className={`${pillCSS} bg-violet-500`}>{getValue()}</div>
        case "Participación en curso":
          return <div className={`${pillCSS} bg-emerald-700`}>{getValue()}</div>
        case "Solicitud de obra":
          return <div className={`${pillCSS} bg-fuchsia-500`}>{getValue()}</div>
        case "Otros":
          return <div className={`${pillCSS} bg-red-400`}>{getValue()}</div>
        default:
          return <div className={`${pillCSS} bg-violet-500`}>{getValue()}</div>
      }
    }
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      return <div className="">{row.getValue("description")}</div>
    }
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
