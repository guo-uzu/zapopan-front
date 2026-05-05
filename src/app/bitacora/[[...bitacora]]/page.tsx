"use client";
import { columns } from "@/components/bitacora/bitacora";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { DataTable } from "@/components/bitacora/table";
import { useSearchParams } from "next/navigation";

export default function Bitacora() {
  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  return (
    <SidebarProvider className="">
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="px-4">
          <DataTable columns={columns} idFilter={search} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
