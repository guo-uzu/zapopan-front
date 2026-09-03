"use client"
import { FileFormats } from "@/lib/insumos/fileFormats";
import { ImageCard } from "@/components/insumos/image.card";
import Image from "next/image";
import Cat404 from "@/app/assets/cat.404.jpg"
export type Insumo = {
  id_public: string;
  file_name: string;
  title: string;
  created_at: string;
  description: string;
  user_id: {
    full_name: string;
  };
  label_id: {
    name: string;
    id_public: string;
  };
};
export const GridInsumos = ({ insumosArray, BASE_URL }: { insumosArray: Insumo[], BASE_URL: string }) => {
  if (insumosArray.length <= 0) return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-y-6 items-center">
      <p>No se han encontrado coincidencias	(｡•́︿•̀｡)</p>
      <Image src={Cat404} alt="Cat 404"/>
    </div>
  )
  return (
    <div className="grid grid-cols-4 gap-6 p-2">
      {insumosArray.map((e) => {
        const regex = new RegExp(`\\b(${FileFormats.join("|")})\\b`);
        const result = String(e.file_name).replace(regex, "");
        const fileNameClean = result.replace(/\s+/g, " ").trim();
        const thumbnailSrc = `${BASE_URL}thumbnail/thumbnail_${fileNameClean}.webp`;
        const previewSrc = `${BASE_URL}preview/preview_${fileNameClean}.webp`;
        const originalSrc = `${BASE_URL}original/original_${e.file_name}?v=2`;
        return (
          <ImageCard
            key={e.id_public}
            thumbnailSrc={thumbnailSrc}
            element={e}
            previewSrc={previewSrc}
            downloadSrc={originalSrc}
          />
        );
      })}
    </div>
  )
}
