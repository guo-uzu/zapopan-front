import Layout from "@/app/(dashboard)/layout";
import { columns } from "@/components/bitacora/bitacora";
import { DataTable } from "@/components/bitacora/table";

export default async function Bitacora({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const search = (await searchParams).id
  return (
    <Layout>
      <DataTable columns={columns} idFilter={search ?? null} />
    </Layout>
  )
}
