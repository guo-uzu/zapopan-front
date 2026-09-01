"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FilterPill from "./filter.pill";

interface ImageCardProps {
  thumbnailSrc: string;
  element: {
    title: string;
    description: string;
    file_name: string;
    label_id: {
      name: string
    }
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
  // Prevent SSR hydration errors by confirming client mount before using document.body
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{element.title}</CardTitle>
          {element.description && (
            <CardDescription>{element.description}+</CardDescription>
          )}
        </CardHeader>
        <CardContent className="overflow-hidden w-auto h-full aspect-square">
          <img
            src={thumbnailSrc}
            alt={element.title}
            className="object-cover w-full h-full inset-0 cursor-pointer rounded-md hover:scale-105 transition-transform"
            onClick={() => setOpen(true)}
          />
        </CardContent>
        <CardFooter>
          <FilterPill name={element.label_id.name} />{" "}
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
