import { columns } from "@/components/bitacora/bitacora";
import { DataTable } from "@/components/bitacora/table";

type SearchParams = Promise<{ id?: string }>;
export default async function Bitacora({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = (await searchParams).id;
  return <DataTable columns={columns} idFilter={search ?? null} />;
}
