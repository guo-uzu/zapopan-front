"use client";
import FilterPill from "@/components/insumos/filter.pill";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { postInsumos } from "@/lib/insumos/postInsumo";
import { ArrowUpFromLine, Search, Tag } from "lucide-react";
import { useEffect, useState } from "react";

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const ACCEPTED_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

const isAcceptedFile = (file: File) => {
  const fileName = file.name.toLowerCase();
  const hasAcceptedExtension = ACCEPTED_FILE_EXTENSIONS.some((extension) =>
    fileName.endsWith(extension),
  );

  return (
    ACCEPTED_FILE_TYPES.includes(
      file.type as (typeof ACCEPTED_FILE_TYPES)[number],
    ) && hasAcceptedExtension
  );
};

const InsumosPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorFile, setErrorFile] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    setErrorFile(null);
    setSuccessMessage(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!isAcceptedFile(selectedFile)) {
      setFile(null);
      event.target.value = "";
      setErrorFile("Solo se aceptan archivos PDF, JPG, JPEG, WEBP o PNG.");
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
    console.log(previewUrl);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setErrorFile("Selecciona un archivo válido antes de enviar.");
      return;
    }

    setIsUploading(true);
    setErrorFile(null);
    setSuccessMessage(null);

    try {
      const response = await postInsumos(file);

      if (response.status !== 200) {
        setErrorFile(
          `No se pudo subir el archivo. Código de error: ${response.status}.`,
        );
        return;
      }

      setSuccessMessage("Archivo subido correctamente.");
    } catch (error) {
      console.error("Error uploading insumo:", error);
      setErrorFile("No se pudo conectar con el servidor. Intenta nuevamente.");
    } finally {
      setIsUploading(false);
    }
  };
  // return (
  //   <main>
  //     <section className="max-w-300 mx-auto">
  //       <div className="flex flex-col gap-y-4">
  //         <div className="flex justify-between">
  //           <div className="flex flex-col gap-y-2">
  //             <h1 className="text-3xl font-black">Insumos</h1>
  //             <p className="text-md">Busca los insumos por nombre, etiqueta, año y revisa cuando se subieron.</p>
  //           </div>
  //           <div className="flex gap-x-4">
  //             <Button size="sm" variant="outline" className="flex cursor-pointer"><Tag />Administrar etiquetas</Button>
  //             <Button size="sm" className="flex cursor-pointer"><ArrowUpFromLine />Subir archivo</Button>
  //           </div>
  //         </div>
  //         <div className="flex flex-col gap-y-2">
  //           <InputGroup className="flex">
  //             <InputGroupAddon align="inline-start" >
  //               <Search className="text-muted-foreground" />
  //             </InputGroupAddon >
  //             <InputGroupInput type="text" id="inline-start-input" placeholder="Busca por nombre, etiqueta, reporte o año" />
  //           </InputGroup>
  //           <div className="flex gap-x-2 items-center">
  //             <span className="text-sm text-current/70">Filter:</span>
  //             <FilterPill />
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   </main>
  // )

  return (
    <div>
      <h1>Insumos</h1>
      <form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel htmlFor="insumo">Insumo</FieldLabel>
          <Input
            id="insumo"
            type="file"
            accept=".pdf,.jpg,.jpeg,.webp,.png"
            onChange={handleFileChange}
          />
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="max-w-60 h-auto" />
          )}
          {errorFile && <p className="text-sm text-red-600">{errorFile}</p>}
          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}
          <FieldDescription>Selecciona un archivo para subir.</FieldDescription>
        </Field>
        <Button type="submit" disabled={!file || isUploading}>
          {isUploading ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
};

export default InsumosPage;
