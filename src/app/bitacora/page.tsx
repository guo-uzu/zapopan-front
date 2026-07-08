import { columns } from "@/components/bitacora/bitacora";
import { DataTable } from "@/components/bitacora/table";

type SearchParams = Promise<{ id?: string; status?: string }>;
export default async function Bitacora({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { id, status } = await searchParams;
  return (
    <DataTable
      columns={columns}
      idFilter={id ?? null}
      statusFilter={status ?? null}
    />
  );
}
