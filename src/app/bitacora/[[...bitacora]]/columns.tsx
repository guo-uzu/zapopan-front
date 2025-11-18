"use client"

import type { DateRange as RDPDateRange } from "react-day-picker";
import { ColumnDef } from "@tanstack/react-table"
import { Inputs } from "@/hooks/types"
import { Building, CircleUser, Inbox, ListRestart, MessageCircle, Pencil, Shield, SignalLow, SignalMedium, Siren, SquareCheckBig, Trash, TriangleAlert } from "lucide-react"
import { AlertDialog } from "@radix-ui/react-alert-dialog"
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { deleteRowBitacora } from "@/hooks/deleteRow"
import { Badge } from "@/components/ui/badge";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter, FaSquareInstagram } from "react-icons/fa6";
import { AiFillTikTok } from "react-icons/ai";
import { formatData } from "@/hooks/formatData";
import { toast } from 'sonner'
import Share from "@/components/columns/share-btn";


const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

// Robust parser (handles ISO strings, timestamps, Date, or nulls)
const toTimestamp = (v: unknown): number | null => {
  if (v == null) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v.getTime();
  if (typeof v === "number") return isNaN(v) ? null : v;                 // already ms
  const d = new Date(String(v));                                         // string -> Date
  return isNaN(d.getTime()) ? null : d.getTime();
};

const dateRangeFilterFn: import('@tanstack/react-table').FilterFn<any> =
  (row, columnId, range?: RDPDateRange | null) => {
    if (!range || (!range.from && !range.to)) return true;

    const ts = row.getValue<number | null>(columnId);
    if (ts == null) return false;

    const min = range.from ? startOfDay(range.from).getTime() : -Infinity;
    const max = range.to ? endOfDay(range.to).getTime() : +Infinity;

    return ts >= min && ts <= max; // inclusive
  };



export const columns: ColumnDef<Inputs>[] = [
  {
    accessorFn: (row) => `${row.users.full_name}`,
    id: "user name",
    header: "Nombre",
    cell: ({ getValue }) => {
      return <p>{getValue()}</p>
    },
    size: 200,
    minSize: 150,
    maxSize: 300
  },
  {
    accessorFn: (row) => row.social_network_bitacora?.name ?? "",
    id: "redes sociales",
    header: "Redes Sociales",
    cell: ({ getValue }) => {
      switch (getValue()) {
        case "facebook":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='capitalize w-full rounded-full border-none bg-blue-600/10 text-blue-600 focus-visible:ring-amber-600/20 focus-visible:outline-none'>
                <FaFacebookSquare />
                {getValue()}
              </Badge>
            </div>
          )
        case "x":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='capitalize w-full rounded-full border-none bg-black/10 text-black focus-visible:ring-amber-600/20 focus-visible:outline-none text-uppercase'>
                <FaSquareXTwitter />
                {getValue()}
              </Badge>
            </div>
          )
        case "instagram":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='capitalize w-full border-transparent bg-[#ee2a7b]/10 text-[#ee2a7b]  bg-center '>
                <FaSquareInstagram />
                {getValue()}
              </Badge>
            </div>
          )

        case "tiktok":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='capitalize w-full rounded-full border-none shadow-xl bg-black/10 text-black  focus-visible:outline-none'>
                <AiFillTikTok />
                {getValue()}
              </Badge>
            </div>
          )
      }
    },
    size: 150,
    minSize: 150,
    maxSize: 150,
    enableColumnFilter: true,
    filterFn: "includesString"
  },
  {
    accessorFn: (row) => row.account_bitacora?.name ?? "",
    id: "account name",
    header: "Cuenta",
    cell: ({ getValue }) => {
      if (getValue() === "jjf") {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge className='w-full rounded-full border-none shadow-xl uppercase bg-purple-400/10 text-purple-400  focus-visible:outline-none'>
              <CircleUser />
              {getValue()}
            </Badge>
          </div>
        )
      } else {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-orange-500/10 text-orange-500  focus-visible:outline-none'>
              <Shield />
              {getValue()}
            </Badge>
          </div>
        )
      }
    },
    size: 150,
    minSize: 150,
    maxSize: 150,
    enableColumnFilter: true,
    filterFn: "includesString"
  },
  {
    accessorFn: (row) => row.channel_bitacora.name,
    id: "channel",
    header: "Canal",
    cell: ({ getValue }) => {
      if (getValue() === "Comentarios") {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-yellow-500/10 text-yellow-500  focus-visible:outline-none'>
              <MessageCircle />
              {getValue()}
            </Badge>
          </div>
        )
      } else {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-indigo-500/10 text-indigo-500  focus-visible:outline-none'>
              <Inbox />
              {getValue()}
            </Badge>
          </div>
        )
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
    accessorFn: (row) => toTimestamp(row.created_at),
    filterFn: dateRangeFilterFn,
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
    id: "category",
    header: "Categoría",
    cell: ({ getValue }) => {
      switch (getValue()) {
        case "Solicitud de información":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-violet-500/10 text-violet-500 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Canalización a dependencia":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-teal-500/10 text-teal-500 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Solicitudes nuevas":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-sky-500/10 text-sky-500 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Reportes de servicios":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-green-500/10 text-green-500 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Reportes de obras":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-yellow-500/10 text-yellow-500 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Reportes externos":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-orange-400/10 text-orange-400 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Solicitudes especiales":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-cyan-500/10 text-cyan-500 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Reporte de inspección y vigilancia":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-gray-500/10 text-gray-500 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Reportes y denuncias":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-green-400/10 text-green-400 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Solicitud de empleo":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-blue-800/10 text-blue-800 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Coyuntura":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-violet-500/10 text-violet-500 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Participación en curso":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-emerald-700/10 text-emerald-700 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Solicitud de obra":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-fuchsia-500/10 text-fuchsia-500 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        case "Otros":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-red-400/10 text-red-400 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
        default:
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-violet-500/10 text-violet-500 focus-visible:outline-none'>
                <Siren />
                {getValue()}
              </Badge>
            </div>
          )
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
    id: "area",
    header: "Área responsable",
    cell: ({ getValue }) => {
      switch (getValue()) {
        case "Infraestructura de comercio":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-blue-400/10 text-blue-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Servicios municipales":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-emerald-400/10 text-emerald-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Gestión integral":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-sky-400/10 text-sky-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Secretaría del ayuntamiento":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-red-400/10 text-red-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Desarrollo económico":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-orange-400/10 text-orange-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Construcción comunidad":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-purple-400/10 text-purple-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "DIF":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-yellow-400/10 text-yellow-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Tesorería":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-amber-400/10 text-amber-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "CFE":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-gray-400/10 text-gray-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "SIAPA":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-rose-400/10 text-rose-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "SIOP":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-cyan-400/10 text-cyan-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Otras coordinaciones":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-fuchsia-400/10 text-fuchsia-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Otras dependencias estatales":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-indigo-400/10 text-indigo-400 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Presidencia":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-rose-600/10 text-rose-600 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Guadalajara":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-blue-600/10 text-blue-600 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Inspección y vigilancia":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-sky-600/10 text-sky-600 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "PCyB":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-yellow-600/10 text-yellow-600 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Cercanía ciudadana":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-red-600/10 text-red-600 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Salud Zapopan":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-green-600/10 text-green-600 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Comisaría":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-sky-600/10 text-sky-600 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "COMUDE":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-amber-600/10 text-amber-600 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "CAEC (Boletos Charros)":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-blue-700/10 text-blue-700 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Sindicatura":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-blue-700/10 text-blue-700 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Administración e Innovación Gubernamental":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-blue-700/10 text-blue-700 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "AMIM":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-blue-700/10 text-blue-700 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Cursos en el Parque de las niñas y  niños":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-blue-700/1F0 text-blue-700 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Romería":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-blue-700/10 text-blue-700 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
        case "Contraloría ciudadana":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-blue-700/10 text-blue-700 focus-visible:outline-none'>
                <Building className="min-w-[20px]" />
                {getValue()}
              </Badge>
            </div>
          )
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
    id: "priority",
    header: "Prioridad",
    cell: ({ getValue }) => {
      switch (getValue()) {
        case "Alta":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-red-500/10 text-red-500  focus-visible:outline-none'>
                <SignalMedium />
                {getValue()}
              </Badge>
            </div>
          )
        case "Media":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-yellow-500/10 text-yellow-500  focus-visible:outline-none'>
                <SignalMedium />
                {getValue()}
              </Badge>
            </div>
          )
        case "Baja":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-green-500/10 text-green-500  focus-visible:outline-none'>
                <SignalLow />
                {getValue()}
              </Badge>
            </div>
          )
      }
    },
    size: 120,
    minSize: 120,
    maxSize: 120
  },
  {
    accessorKey: "status_bitacora.name",
    id: "status",
    header: "Estatus",
    cell: ({ getValue }) => {
      switch (getValue()) {
        case "Resuelto":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-green-500/10 text-green-500  focus-visible:outline-none'>
                <SquareCheckBig />
                {getValue()}
              </Badge>
            </div>
          )
        case "Pendiente":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-yellow-500/10 text-yellow-500  focus-visible:outline-none'>
                <TriangleAlert />
                {getValue()}
              </Badge>
            </div>
          )
        case "En proceso":
          return (
            <div className="w-full flex items-center justify-center">
              <Badge className='w-full capitalize rounded-full border-none shadow-xl bg-red-500/10 text-red-500  focus-visible:outline-none'>
                <ListRestart />
                {getValue()}
              </Badge>
            </div>
          )
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
    cell: ({ row, table }) => {
      const deleteRowBitacoraHandler = async (id: string) => {
        toast.promise(deleteRowBitacora(id), {
          loading: "Eliminando registro...",
          success: "Registro eliminado correctamente.",
          error: "Error eliminado este registro, intente nuevamente más tarde.",
          position: "top-center"
        })
      }
      const handleClick = () => {
        const data = row.original
        table.options.meta.setDefaultData({
          id: data.id,
          username: data.username,
          account: data.account_bitacora.name,
          channel: formatData(data.channel_bitacora.name),
          link: data.link,
          category: formatData(data.category_bitacora.name),
          area_responsable: formatData(data.responsable_area_bitacora.name),
          description: data.description,
          colonia: data.description,
          social_network: formatData(data.social_network_bitacora.name),
          priority: formatData(data.priority_bitacora.name),
          status: formatData(data.status_bitacora.name),
          direction: data.direction,
          folio: data.folio,
          observations: data.observations,
        })
        table.options.meta.handleToEdit(),
          table.options.meta.handleOpenForm()
      }
      return (
        <div className="w-full">
          <div className="w-full flex items-center justify-center gap-4">
            <button onClick={handleClick} className="p-1 cursor-pointer bg-green-500 rounded-md">
              <Pencil className="text-white" />
            </button>
            <button className="p-1 cursor-pointer bg-red-500 rounded-md">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash className="text-white" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Estás eliminado un registro de la bitácora. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteRowBitacoraHandler(row.original.id)}>Continuar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </button>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "shared",
    id: "makeItPublic",
    header: "Público",
    cell: ({ row }) => <Share id={row.original.id} />,
    size: 130,
    minSize: 130,
    maxSize: 130
  },
]
