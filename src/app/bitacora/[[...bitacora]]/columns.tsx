"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Inputs } from "@/hooks/types"
import { Pencil, PencilRuler, Trash } from "lucide-react"

const pillCSS = "px-4 rounded-md font-bold text-white text-center"

export const columns: ColumnDef<Inputs>[] = [
  {
    accessorFn: (row) => `${row.users_clerk?.first_name} ${row.users_clerk?.last_name}`,
    id: "user name",
    header: "Nombre",
    cell: ({ row }) => {
      return <p>{row.getValue("user name")}</p>
    },
    size: 200,
    minSize: 150,
    maxSize: 300
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
    },
    size: 150,
    minSize: 150,
    maxSize: 150
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
    },
    size: 160,
    minSize: 160,
    maxSize: 160
  },
  {
    accessorKey: "username",
    header: "Nombre de usuario",
    cell: ({ row }) => {
      return <div className="">{row.getValue("username")}</div>
    },
    size: 200,
    minSize: 150,
    maxSize: 300
  },
  {
    accessorKey: "link",
    header: "Enlace a perfil/publicación",
    cell: ({ row }) => {
      return <div className="">{row.getValue("link")}</div>
    },
    size: 300,
    minSize: 300,
  },
  {
    accessorKey: "created_at",
    header: "Fecha de la solicitud",
    cell: ({ row }) => {
      const rawDate = new Date(row.getValue("created_at"))
      const day = ("0" + rawDate.getDate()).slice(-2)
      const month = ("0" + (rawDate.getMonth() + 1)).slice(-2)
      return <div className="text-center">{day} / {month} / {rawDate.getFullYear()}</div>
    },
    size: 160,
    minSize: 160,
    maxSize: 160
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
    },
    size: 200,
    minSize: 200,
    maxSize: 200
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      return <div className="">{row.getValue("description")}</div>
    },
    size: 450,
    minSize: 450,
    maxSize: 450
  },
  {
    accessorKey: "responsable_area_bitacora.name",
    header: "Área responsable",
    cell: ({ getValue }) => {
      switch (getValue()) {
        case "Infraestructura de comercio":
          return <p className={`${pillCSS} bg-blue-400`}>{getValue()}</p>
        case "Servicios municipales":
          return <p className={`${pillCSS} bg-emerald-400`}>{getValue()}</p>
        case "Gestión integral":
          return <p className={`${pillCSS} bg-sky-400`}>{getValue()}</p>
        case "Secretaría del ayuntamiento":
          return <p className={`${pillCSS} bg-red-400`}>{getValue()}</p>
        case "Desarrollo económico":
          return <p className={`${pillCSS} bg-orange-400`}>{getValue()}</p>
        case "Construcción comunidad":
          return <p className={`${pillCSS} bg-purple-400`}>{getValue()}</p>
        case "DIF":
          return <p className={`${pillCSS} bg-yellow-400`}>{getValue()}</p>
        case "Tesorería":
          return <p className={`${pillCSS} bg-amber-400`}>{getValue()}</p>
        case "CFE":
          return <p className={`${pillCSS} bg-gray-400`}>{getValue()}</p>
        case "SIAPA":
          return <p className={`${pillCSS} bg-rose-400`}>{getValue()}</p>
        case "SIOP":
          return <p className={`${pillCSS} bg-cyan-400`}>{getValue()}</p>
        case "Otras coordinaciones":
          return <p className={`${pillCSS} bg-fuchsia-400`}>{getValue()}</p>
        case "Otras dependencias estatales":
          return <p className={`${pillCSS} bg-indigo-400`}>{getValue()}</p>
        case "Presidencia":
          return <p className={`${pillCSS} bg-rose-600`}>{getValue()}</p>
        case "Guadalajara":
          return <p className={`${pillCSS} bg-blue-600`}>{getValue()}</p>
        case "Inspección y vigilancia":
          return <p className={`${pillCSS} bg-sky-600`}>{getValue()}</p>
        case "PCyB":
          return <p className={`${pillCSS} bg-yellow-600`}>{getValue()}</p>
        case "Cercanía ciudadana":
          return <p className={`${pillCSS} bg-red-600`}>{getValue()}</p>
        case "Salud Zapopan":
          return <p className={`${pillCSS} bg-green-600`}>{getValue()}</p>
        case "Comisaría":
          return <p className={`${pillCSS} bg-sky-600`}>{getValue()}</p>
        case "COMUDE":
          return <p className={`${pillCSS} bg-amber-600`}>{getValue()}</p>
        case "CAEC (Boletos Charros)":
          return <p className={`${pillCSS} bg-blue-700`}>{getValue()}</p>
        case "Sindicatura":
          return <p className={`${pillCSS} bg-blue-700`}>{getValue()}</p>
        case "Administración e Innovación Gubernamental":
          return <p className={`${pillCSS} bg-blue-700`}>{getValue()}</p>
        case "AMIM":
          return <p className={`${pillCSS} bg-blue-700`}>{getValue()}</p>
        case "Cursos en el Parque de las niñas y  niños":
          return <p className={`${pillCSS} bg-blue-700`}>{getValue()}</p>
        case "Romería":
          return <p className={`${pillCSS} bg-blue-700`}>{getValue()}</p>
        case "Contraloría ciudadana":
          return <p className={`${pillCSS} bg-blue-700`}>{getValue()}</p>
      }
    },
    size: 200,
    minSize: 200,
    maxSize: 200
  },
  {
    accessorKey: "colonia",
    header: "Colonia",
    size: 200,
    minSize: 160,
    maxSize: 300
  },
  {
    accessorKey: "priority_bitacora.name",
    header: "Prioridad",
    cell: ({ getValue }) => {
      switch (getValue()) {
        case "Alta":
          return <p className={`${pillCSS} bg-red-300`}>{getValue()}</p>
        case "Media":
          return <p className={`${pillCSS} bg-yellow-300`}>{getValue()}</p>
        case "Baja":
          return <p className={`${pillCSS} bg-green-300`}>{getValue()}</p>
      }
    },
    size: 120,
    minSize: 120,
    maxSize: 120
  },
  {
    accessorKey: "status_bitacora.name",
    header: "Estatus",
    cell: ({ getValue }) => {
      switch (getValue()) {
        case "Resuelto":
          return <p className={`${pillCSS} bg-green-500`}>{getValue()}</p>
        case "Pendiente":
          return <p className={`${pillCSS} bg-yellow-500`}>{getValue()}</p>
        case "En proceso":
          return <p className={`${pillCSS} bg-red-500`}>{getValue()}</p>
      }
    },
    size: 130,
    minSize: 130,
    maxSize: 130
  },
  {
    accessorKey: "direction",
    header: "Dirección",
    size: 200,
    minSize: 160,
    maxSize: 300
  },
  {
    accessorKey: "folio",
    header: "Folio",
    size: 150,
    minSize: 150,
    maxSize: 150
  },
  {
    accessorKey: "observations",
    header: "Observaciones y comentarios",
    size: 450,
    minSize: 450,
    maxSize: 450
  },
  {
    accessorKey: "functions",
    header: "Edita/Elimina",
    maxSize: 450,
    cell: ({ row }) => {
      return (
        <div className="w-full">
          <div className="w-full flex items-center justify-center gap-4">
            <button className="p-1 cursor-pointer bg-red-500 rounded-md">
              <Trash className="text-white" />
            </button>
            <button className="p-1 cursor-pointer bg-green-500 rounded-md">
              <Pencil className="text-white" />
            </button>
          </div>
        </div>
      )
    }
  }
]
