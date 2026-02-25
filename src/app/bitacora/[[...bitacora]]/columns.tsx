"use client";

import type { DateRange } from "react-day-picker";
import { ColumnDef } from "@tanstack/react-table";
import { Inputs } from "@/hooks/types";
import {
  Building,
  CircleUser,
  Compass,
  Inbox,
  ListRestart,
  MessageCircle,
  Pencil,
  Shield,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Siren,
  SquareCheckBig,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteRowBitacora } from "@/hooks/deleteRow";
import { Badge } from "@/components/ui/badge";
import { formatData } from "@/hooks/formatData";
import { toast } from "sonner";
import Share from "@/components/columns/share-btn";

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

// Robust parser (handles ISO strings, timestamps, Date, or nulls)
const toTimestamp = (v: unknown): number | null => {
  if (v == null) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v.getTime();
  if (typeof v === "number") return isNaN(v) ? null : v; // already ms
  const d = new Date(String(v)); // string -> Date
  return isNaN(d.getTime()) ? null : d.getTime();
};

import { Row } from "@tanstack/react-table";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import SocialNetwork from "@/components/columns/social-network";

// Define the custom filter function
export const dateRangeFilterFn = (
  row: Row<Inputs>,
  columnId: string,
  range: DateRange | undefined, // This matches the dateRange state from your picker
) => {
  // 1. If no range selected, show everything
  if (!range || (!range.from && !range.to)) return true;
  // 2. Get the RAW string value from the row (Supabase ISO string)
  const val = row.getValue(columnId) as string;
  if (!val) return false;

  // 3. Convert that string to a Timestamp Number (ms)
  const rowTime = new Date(val).getTime()

  // 4. Calculate your Min/Max bounds
  //    We use startOfDay/endOfDay to ensure we cover the full selected dates
  const min = range.from ? startOfDay(range.from).getTime() : -Infinity;
  const max = range.to ? endOfDay(range.to).getTime() : Infinity;

  // 5. Compare numbers
  return rowTime >= min && rowTime <= max;
};

interface BitacoraTableMeta {
  setDefaultData: (data: Inputs) => void;
  handleToEdit: () => void;
  handleOpenForm: () => void;
}

export const columns: ColumnDef<Inputs>[] = [
  {
    accessorFn: (row) => row.user_id?.full_name ?? "Usuario desconocido",
    id: "user name",
    header: "Nombre",
    cell: (props) => (
      <span className="overflow-hidden bg-white w-full h-full">
        {props.getValue() as string}
      </span>
    ),
    size: 200,
  },
  {
    accessorFn: (row) => row.social_network_bitacora?.name ?? "",
    id: "redes sociales",
    header: "Redes Sociales",
    cell: (props) => <SocialNetwork props={props} />,
    size: 150,
    minSize: 150,
    maxSize: 150,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorFn: (row) => row.account_bitacora?.name ?? "",
    id: "account name",
    header: "Cuenta",
    cell: (props) => {
      const color: string | undefined = ColumnsBitacoraOpts.account.find(
        (e) => e.id === props.getValue(),
      )?.color;
      return (
        <div className="w-full flex items-center justify-center">
          <Badge
            style={{ color: color }}
            className={`w-full ${props.getValue() === "jjf" ? "uppercase" : "capitalize"} rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none`}
          >
            {props.getValue() === "jjf" ? (
              <CircleUser />
            ) : (
              <Shield />
            )}
            {props.getValue() as string}
          </Badge>
        </div>
      );
    },
    size: 150,
    minSize: 150,
    maxSize: 150,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorFn: (row) =>
      row?.channel_bitacora?.name ?? "Usuario no encontrado",
    id: "channel",
    header: "Canal",
    cell: (props) => {
      const color: string | undefined = ColumnsBitacoraOpts.channel.find(
        (e) => e.id === props.getValue(),
      )?.color;
      return (
        <Badge
          style={{ color: color }}
          className="w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
        >
          {props.getValue() === "comentarios" ? (
            <MessageCircle />
          ) : (
            <Inbox />
          )}
          {props.getValue() as string}
        </Badge>
      );
    },
    size: 160,
    minSize: 160,
    maxSize: 160,
  },
  {
    accessorKey: "username",
    header: "Nombre de usuario",
    size: 200,
    minSize: 150,
    maxSize: 300,
  },
  {
    accessorKey: "link",
    header: "Enlace a perfil/publicación",
    cell: ({ row }) => (
      <div className="w-full text-center mx-auto bg-white">
        <a
          target="_blank"
          href={row.getValue("link")}
          className="text-blue-500 underline underline-offset-2"
        >
          Enlace
        </a>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    accessorFn: (row) => toTimestamp(row.created_at),
    filterFn: dateRangeFilterFn,
    header: "Fecha de la solicitud",
    cell: ({ getValue }) => {
      const rawDate: Date = new Date(getValue());
      const day = ("0" + rawDate.getUTCDate()).slice(-2);
      const month = ("0" + (rawDate.getUTCMonth() + 1)).slice(-2);
      return (
        <div className="text-center">
          {day} / {month} / {rawDate.getFullYear()}
        </div>
      );
    },
    size: 160,
  },
  {
    accessorKey: "category_bitacora.name",
    id: "category",
    header: "Categoría",
    cell: (props) => {
      const color: string | undefined = ColumnsBitacoraOpts.category.find(
        (e) => e.value === props.getValue(),
      )?.color;
      return (
        <div className="w-full flex items-center justify-center">
          <Badge
            style={{ color: color }}
            className="w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
          >
            <Siren />
            <span className="truncate max-w-48">
              {props.getValue() as string}
            </span>
          </Badge>
        </div>
      );
    },
    size: 200,
    maxSize: 200,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    size: 250,
  },
  {
    accessorKey: "responsable_area_bitacora.name",
    id: "area",
    header: "Área responsable",
    cell: (props) => {
      const color: string | undefined =
        ColumnsBitacoraOpts.area_responsable.find(
          (e) => e.value === props.getValue(),
        )?.color;
      return (
        <div className="w-full flex items-center justify-center">
          <Badge
            style={{ color: color }}
            className="truncate w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
          >
            <Building />
            <span className="max-w-48 truncate">
              {props.getValue() as string}
            </span>
          </Badge>
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "colonia",
    header: "Colonia",
    size: 200,
  },
  {
    accessorKey: "priority_bitacora.name",
    id: "priority",
    header: "Prioridad",
    cell: (props) => {
      const color: string | undefined = ColumnsBitacoraOpts.priority.find(
        (e) => e.id === props.getValue(),
      )?.color;
      return (
        <div className="w-full flex items-center justify-center">
          <Badge
            style={{ color: color }}
            className="w-full capitalize rounded-full border-none shadow-xl bg-current/10  focus-visible:outline-none"
          >
            {props.getValue() === "baja" ? (
              <SignalLow />
            ) : props.getValue() === "media" ? (
              <SignalMedium />
            ) : props.getValue() === "alta" ? (
              <SignalHigh />
            ) : (
              ""
            )}
            {props.getValue() as string}
          </Badge>
        </div>
      );
    },
    size: 120,
    minSize: 120,
    maxSize: 120,
  },
  {
    accessorKey: "status_bitacora.name",
    id: "status",
    header: "Estatus",
    cell: (props) => {
      const color: string | undefined = ColumnsBitacoraOpts.status.find(
        (e) => e.id === formatData(props.getValue() as string),
      )?.color;
      return (
        <div className="w-full flex items-center justify-center">
          <Badge
            style={{ color: color }}
            className="w-full capitalize rounded-full border-none shadow-xl bg-current/10 focus-visible:outline-none"
          >
            {props.getValue() === "resuelto" ? (
              <SquareCheckBig />
            ) : props.getValue() === "pendiente" ? (
              <TriangleAlert />
            ) : props.getValue() === "dirección" ? (
              <Compass />
            ) : (
              <ListRestart />
            )}
            {props.getValue() as string}
          </Badge>
        </div>
      );
    },
    size: 130,
    minSize: 130,
    maxSize: 130,
  },
  {
    accessorKey: "folio",
    header: "Folio",
    size: 150,
  },
  {
    accessorKey: "observations",
    header: "Observaciones y comentarios",
    size: 250,
    cell: ({ row }) => {
      const data = row.original.observations;
      if (data) {
        const splitedText = data.split(/(https?:\/\/[^\s]+)/g);
        return splitedText.map((text, index) => {
          if (text.match(/https?:\/\/[^\s]+/)) {
            return (
              <a
                key={index}
                href={text}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                {text}
              </a>
            );
          }
          return <div>{text}</div>;
        });
      }
    },
  },
  {
    accessorKey: "updated_at",
    header: "Ultima actualización",
    cell: ({ row }) => {
      const rawDate = new Date(row.getValue("updated_at"));
      const day = ("0" + rawDate.getDate()).slice(-2);
      const month = ("0" + (rawDate.getMonth() + 1)).slice(-2);
      return (
        <div className="text-center">
          {day} / {month} / {rawDate.getFullYear()}
        </div>
      );
    },
    size: 150,
  },
  {
    accessorFn: (row) => row.latest_updated_user_id?.full_name ?? "N/A",
    header: "Ultimo en actualizar",
    cell: (props) => (
      <span className="overflow-hidden">
        {props.getValue() as string}
      </span>
    ),
    size: 200,
  },
  {
    accessorKey: "functions",
    header: "Edita/Elimina",
    maxSize: 450,
    cell: ({ row, table }) => {
      const deleteRowBitacoraHandler = async (id?: string) => {
        toast.promise(deleteRowBitacora(id), {
          loading: "Eliminando registro...",
          success: "Registro eliminado correctamente.",
          error: "Error eliminado este registro, intente nuevamente más tarde.",
          position: "top-center",
        });
      };
      const handleClick = () => {
        const data = row.original;
        // 1. Cast the meta to your custom interface
        const meta = table.options.meta as
          | BitacoraTableMeta
          | undefined;
        // 2. Now TypeScript knows these functions exist!
        meta?.setDefaultData({
          id: data.id,
          username: data.username,
          account: data.account_bitacora?.name ?? "",
          channel: formatData(data.channel_bitacora?.name ?? ""),
          link: data.link,
          category: formatData(data.category_bitacora?.name ?? ""),
          // Typo fix from before:
          area_responsable: formatData(
            data.responsable_area_bitacora?.name ?? "",
          ),
          description: data.description,
          colonia: data.colonia,
          social_network: formatData(
            data.social_network_bitacora?.name ?? "",
          ),
          priority: formatData(data.priority_bitacora?.name ?? ""),
          status: formatData(data.status_bitacora?.name ?? ""),
          folio: data.folio,
          observations: data.observations,
        });
        meta?.handleToEdit();
        meta?.handleOpenForm();
      };
      return (
        <div className="w-full">
          <div className="w-full flex items-center justify-center gap-4">
            <button
              onClick={handleClick}
              className="p-1 cursor-pointer bg-green-500 rounded-md"
            >
              <Pencil className="text-white" />
            </button>
            <button className="p-1 cursor-pointer bg-red-500 rounded-md">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash className="text-white" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ¿Estás completamente seguro?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Estás eliminado un registro de la
                      bitácora. Esta acción no se puede
                      deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        deleteRowBitacoraHandler(
                          row.original.id,
                        )
                      }
                    >
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </button>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "shared",
    id: "makeItPublic",
    header: "Público",
    cell: ({ row }) => <Share id={row.original.id} />,
    size: 130,
    minSize: 130,
    maxSize: 130,
  },
];
