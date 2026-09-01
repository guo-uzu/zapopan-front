"use client"
import { FileFormats } from "@/lib/insumos/fileFormats";
import { ImageCard } from "@/components/insumos/image.card";
type Insumo = {
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
export const GridInsumos = ({ insumosArray, BASE_URL}: {insumosArray: Insumo[], BASE_URL: string}) => {
  return (
    <div className="grid grid-cols-4 gap-6 p-2">
      {insumosArray.map((e) => {
        const regex = new RegExp(`\\b(${FileFormats.join("|")})\\b`);
        const result = String(e.file_name).replace(regex, "");
        const fileNameClean = result.replace(/\s+/g, " ").trim();
        const thumbnailSrc = `${BASE_URL}thumbnail/thumbnail_${fileNameClean}.webp`;
        const previewSrc = `${BASE_URL}preview/preview_${fileNameClean}.webp`;
        const originalSrc = `${BASE_URL}original/original_${e.file_name}`;
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
