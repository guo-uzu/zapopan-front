"use client";

import { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FilterPill from "./filter.pill";
import { deleteInsumo } from "@/lib/insumos/insumosOperations";

interface ImageCardProps {
  thumbnailSrc: string;
  element: {
    id_public: string;
    title: string;
    description: string;
    file_name: string;
    label_id: {
      name: string;
    };
  };
  downloadSrc: string;
  previewSrc: string;
}

export function ImageCard({
  thumbnailSrc,
  element,
  downloadSrc,
  previewSrc,
}: ImageCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  // Prevent SSR hydration errors by confirming client mount before using document.body
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteInsumo(element.id_public);
        toast.success("Insumo eliminado", { position: "top-center" });
        setDeleteOpen(false);
      } catch {
        toast.error("No se pudo eliminar el insumo", {
          position: "top-center",
        });
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{element.title}</CardTitle>
            {element.description && (
              <CardDescription>{element.description}+</CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80 overflow-hidden rounded-md">
            <img
              src={thumbnailSrc}
              alt={element.title}
              className="object-cover w-full h-full cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setOpen(true)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <FilterPill name={element.label_id.name} />{" "}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button size="icon-sm" className="cursor-pointer shrink-0">
                <TrashIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>¿Eliminar este insumo?</DialogTitle>
              <DialogDescription>
                El archivo se ocultará del sistema. Avise al desarrollador o a
                un administrador si es que se equivoca.
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="cursor-pointer">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  disabled={isPending}
                  className="cursor-pointer"
                  onClick={handleDelete}
                >
                  {isPending ? "Eliminando..." : "Eliminar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      {mounted &&
        createPortal(
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={[{ src: previewSrc, download: downloadSrc }]}
            plugins={[Download, Zoom]}
            styles={{ container: { zIndex: 99999 } }}
            animation={{ zoom: 500 }}
          />,
          document.body,
        )}
    </>
  );
}
