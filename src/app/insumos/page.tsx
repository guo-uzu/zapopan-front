import AdminLabels from "@/components/insumos/admin.labels";
import UploadFiles from "@/components/insumos/upload.files";

import { getUserId } from "@/lib/insumos/getUser";
import { getLabels } from "@/lib/insumos/labelsOperations";
import FilterLabels from "@/components/insumos/filter.labels";
import { getInsumos } from "@/lib/insumos/insumosOperations";

import { InsumosRealtime, LabelsRealtime } from "@/components/insumos/realtime";
import { GridInsumos } from "@/components/insumos/grid.insumos";
import InputSearchGrid from "@/components/insumos/input.search.grid";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

const InsumosPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const BASE_URL = "https://static-zapopan-api.appsuzu.fun/";
  const userData = await getUserId();
  const labelsArray = await getLabels();
  const { data: insumosArray } = await getInsumos(resolvedSearchParams);

  return (
    <main>
      <section className="max-w-300 mx-auto">
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-3xl font-black">Insumos</h1>
              <p className="text-md">
                Busca los insumos por nombre, etiqueta y revisa cuando se
                subieron.
              </p>
            </div>
            <div className="flex gap-x-4">
              <AdminLabels labels={labelsArray} />
              <UploadFiles userData={userData} labels={labelsArray} />
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <InputSearchGrid />
            <div className="flex gap-x-2 items-center">
              <span className="text-sm text-current/70">Filter:</span>
              <FilterLabels labels={labelsArray} />
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-300 mx-auto">
        <InsumosRealtime />
        <LabelsRealtime />
        <GridInsumos insumosArray={insumosArray} BASE_URL={BASE_URL} />
      </section>
    </main>
  );
};

export default InsumosPage;
