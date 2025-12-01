"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"
import { Separator } from "@radix-ui/react-separator"
import { Hash } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Response {
    id: string
    tags: string[]
    created_at: string
    description: string
    title: string
    user: {
        full_name: string
        email: string
        avatar_url: string
    } | null
}

export default function Respuestas() {
    const searchParams = useSearchParams()
    const [responses, setResponses] = useState<Response[] | null>(null)

    const supabase = createClient()
    useEffect(() => {
        const handleData = async () => {
            const { data } = await supabase
                .from("respuestas")
                .select(`
                    id,
                    title,
                    description,
                    tags,
                    created_at,
                    user:users(
                        full_name,
                        email,
                        avatar_url
                    )
                `)
            if (data) {
                // 2. TRANSFORM THE DATA
                // We map over the data to fix the structure before saving it to state.
                const formattedData: Response[] = data.map((item: any) => ({
                    ...item,
                    // If 'user' is an array, take the first item. If not, use it as is.
                    user: Array.isArray(item.user) ? item.user[0] : item.user
                }))
                setResponses(formattedData)
            }
        }
        handleData()
    }, [])

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
                    <div className="max-w-xl w-full mx-auto flex flex-col gap-2">
                        <p>Busca tu información aquí</p>
                        <div>
                            <div className="flex gap-2">
                                <Input type="text" placeholder="#jjf" />
                                <Button>Buscar</Button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 w-full grid grid-cols-4 gap-6">
                        {
                            responses?.map(response => (
                                <div className="bg-zinc-100/50 flex flex-col rounded-sm p-4 max-w-md transition-all duration-300 hover:scale-105 hover:bg-zinc-200 cursor-pointer">
                                    <h2 className="truncate text-md font-bold mb-2">{response.title}</h2>
                                    <p className="line-clamp-6 text-sm text-zinc-500">{response.description}</p>
                                    <div className="text-sm mt-2 mb-1 flex justify-between">
                                        <h3 className="">{response.user?.full_name ?? "Usuario Desconocido"}</h3>
                                        <span>{new Date(response.created_at).toLocaleDateString("es-MX")}</span>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        {
                                            response.tags.map((tag) => (
                                                <Badge className='border-none bg-zinc-700/10 text-zinc-700'>
                                                    <Hash />
                                                    {tag}
                                                </Badge>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

