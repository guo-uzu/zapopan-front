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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ImageCardProps {
  imageSrc: string;
  element: {
    title: string;
    description: string;
    file_name: string;
  };
}

export function ImageCard({ imageSrc, element }: ImageCardProps) {
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
          <CardDescription>
            {element.description} {element.file_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <img
            src={imageSrc}
            alt={element.title}
            className="cursor-pointer rounded-md w-full hover:opacity-90 transition-opacity"
            onClick={() => setOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Render Lightbox at root body level via Portal */}
      {mounted &&
        createPortal(
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={[{ src: imageSrc }]}
            plugins={[Download, Zoom]}
            styles={{ container: { zIndex: 99999 } }}
          />,
          document.body
        )}
    </>
  );
}
