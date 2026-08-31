import AdminLabels from "@/components/insumos/admin.labels";
import UploadFiles from "@/components/insumos/upload.files";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { getUserId } from "@/lib/insumos/getUser";
import { getLabels } from "@/lib/insumos/labelsOperations";
import FilterLabels from "@/components/insumos/filter.labels";
import { getInsumos } from "@/lib/insumos/insumosOperations";

import { FileFormats } from "@/lib/insumos/fileFormats";
import { ImageCard } from "@/components/insumos/image.card";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const InsumosPage = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const BASE_URL = "https://static-zapopan-api.appsuzu.fun/";
  const userData = await getUserId();
  const labelsArray = await getLabels();
  const { data: insumosArray } = await getInsumos();
  const channels = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "insumos" },
      (payload) => {
        console.log("Change received!", payload);
      },
    )
    .subscribe();
  console.log(channels);

  return (
    <main>
      <section className="max-w-300 mx-auto">
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-3xl font-black">Insumos</h1>
              <p className="text-md">
                Busca los insumos por nombre, etiqueta, año y revisa cuando se
                subieron.
              </p>
            </div>
            <div className="flex gap-x-4">
              <AdminLabels labels={labelsArray} />
              <UploadFiles userData={userData} labels={labelsArray} />
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <InputGroup className="flex">
              <InputGroupAddon align="inline-start">
                <Search className="text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                id="inline-start-input"
                placeholder="Busca por nombre, etiqueta, reporte o año"
              />
            </InputGroup>
            <div className="flex gap-x-2 items-center">
              <span className="text-sm text-current/70">Filter:</span>
              <FilterLabels labels={labelsArray} />
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-300 mx-auto">
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
                thumbnailSrc={thumbnailSrc}
                element={e}
                previewSrc={previewSrc}
                downloadSrc={originalSrc}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default InsumosPage;
