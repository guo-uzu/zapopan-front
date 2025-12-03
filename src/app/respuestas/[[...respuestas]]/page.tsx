"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"
import { Separator } from "@/components/ui/separator" // Ensure this imports from your UI component or Radix
import { Hash, Search, X } from "lucide-react" // Added Search and X icons
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
    const [responses, setResponses] = useState<Response[] | null>(null)
    // 1. New State for the filter text
    const [searchTerm, setSearchTerm] = useState("")

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
                const formattedData: Response[] = data.map((item: any) => ({
                    ...item,
                    user: Array.isArray(item.user) ? item.user[0] : item.user
                }))
                setResponses(formattedData)
            }
        }
        handleData()
    }, [])

    // 2. THE FILTER LOGIC
    // We create a derived variable. This updates instantly when searchTerm changes.
    const filteredResponses = responses?.filter((response) => {

        if (!searchTerm) return true

        const term = searchTerm.toLowerCase()

        // Check Title
        const matchesTitle = response.title.toLowerCase().includes(term)
        // Check Description
        const matchesDesc = response.description.toLowerCase().includes(term)
        // Check Tags (Loop through the array)
        const matchesTags = response.tags?.some(tag => tag.toLowerCase().includes(term))

        return matchesTitle || matchesDesc || matchesTags
    })

    return (
        <SidebarProvider className="">
            <AppSidebar />
            <SidebarInset className="flex flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4 w-[1px] bg-zinc-300" // Simple styling for separator
                        />
                    </div>
                </header>
                <div className="px-4 pb-10"> {/* Added pb-10 for scroll space */}

                    {/* SEARCH BAR SECTION */}
                    <div className="max-w-xl w-full mx-auto flex flex-col gap-4 mb-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Respuestas</h1>
                            <p className="text-muted-foreground">Busca reportes, hashtags o palabras clave.</p>
                        </div>
                        <div className="relative flex gap-2">
                            <div className="relative w-full">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Buscar por #tema o palabra..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-black"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RESULTS GRID */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {
                            filteredResponses?.map(response => (
                                <Card key={response.id} className="overflow-hidden rounded-lg hover:shadow-md transition-all duration-200 border-zinc-200">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <CardTitle className="text-lg font-bold leading-tight">{response.title}</CardTitle>
                                            {/* Optional: Add a status icon or category badge here */}
                                        </div>
                                        <CardDescription>
                                            <div className="flex items-center justify-between text-xs mt-2">
                                                <span className="font-medium text-zinc-700 truncate max-w-[120px]">
                                                    {response.user?.full_name ?? "Anónimo"}
                                                </span>
                                                <span>
                                                    {new Date(response.created_at).toLocaleDateString("es-MX")}
                                                </span>
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <p className="line-clamp-4 text-sm text-zinc-600 leading-relaxed">
                                            {response.description}
                                        </p>

                                        {/* TAGS SECTION */}
                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            {
                                                response.tags?.map((tag, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="secondary"
                                                        className='cursor-pointer hover:bg-zinc-200/80 transition-colors px-2 py-0.5 text-xs font-normal'
                                                        // 3. CLICK TO FILTER
                                                        onClick={(e) => {
                                                            e.stopPropagation() // Prevent card click if you have one
                                                            setSearchTerm(tag) // <--- Updates search bar
                                                        }}
                                                    >
                                                        <Hash className="w-3 h-3 mr-1 opacity-50" />
                                                        {tag}
                                                    </Badge>
                                                ))
                                            }
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        }

                        {/* Empty State */}
                        {filteredResponses?.length === 0 && (
                            <div className="col-span-full text-center py-10 text-muted-foreground">
                                <p>No se encontraron resultados para "{searchTerm}"</p>
                                <Button variant="link" onClick={() => setSearchTerm("")}>Limpiar filtros</Button>
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}