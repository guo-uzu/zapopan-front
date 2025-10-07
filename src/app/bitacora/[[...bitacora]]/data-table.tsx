"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { createClient } from "@/utils/supabase/client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchData } from "@/hooks/fetch-data"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {

  const { userId, isLoaded } = useAuth()
  const supabase = createClient()
  const [dataFetch, setDataFetch] = useState<TData[]>([])
  const table = useReactTable({
    data: dataFetch,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    handleFetchData()
    console.log(dataFetch)
  }, [])

  useEffect(() => {
    if (!isLoaded || !userId) return
    const subscription = supabase
      .channel("changes")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "bitacora"
      }, () => {
        handleFetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [isLoaded, userId])

  const handleFetchData = async () => {
    const { data } = await fetchData()
    if (data) setDataFetch(data as TData[])
  }

  return (
    <div className="overflow-hidden rounded-md border col-span-2">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  < TableCell key={cell.id} >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Cargando datos...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div >
  )
}
