"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"
import { Separator } from "@/components/ui/separator"
import { Hash, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DialogDescription, DialogHeader } from "@/components/ui/dialog"

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
                const formattedData: Response[] = data.map((item) => {
                    console.log(item)
                    return ({
                        ...item,
                        user: Array.isArray(item.user) ? item.user[0] : item.user
                    })
                })
                //     ())
                setResponses(formattedData)
            }
        }
        handleData()
    }, [])

    // 2. THE NEW MULTI-WORD FILTER LOGIC
    const filteredResponses = responses?.filter((response) => {
        if (!searchTerm) return true

        // A. Create an array of terms
        // Input: "obras, seguridad, bache" -> Output: ["obras", "seguridad", "bache"]
        const terms = searchTerm
            .toLowerCase()
            .split(",")
            .map(term => term.trim()) // Remove spaces around words
            .filter(term => term.length > 0) // Remove empty strings (e.g. trailing comma)
        console.log(terms)
        // If user typed a comma but no words yet, return true
        if (terms.length === 0) return true

        // B. Check if ANY of the terms match (OR logic)
        // If you want them to match ALL terms (AND logic), change .some() to .every()
        return terms.some(term => {
            const matchesTitle = response.title.toLowerCase().includes(term)
            const matchesDesc = response.description.toLowerCase().includes(term)
            const matchesTags = response.tags?.some(tag => tag.toLowerCase().includes(term))

            return matchesTitle || matchesDesc || matchesTags
        })
    })

    // Helper to add tags to search when clicked
    const handleTagClick = (tag: string) => {
        if (searchTerm.includes(tag)) return // Avoid duplicates

        // If search is empty, just set the tag
        // If not empty, append with a comma
        setSearchTerm(prev => prev ? `${prev}, ${tag}` : tag)
    }

    return (
        <SidebarProvider className="">
            <AppSidebar />
            <SidebarInset className="flex flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4 w-[1px] bg-zinc-300" />
                    </div>
                </header>
                <div className="px-4 pb-10">

                    {/* SEARCH BAR SECTION */}
                    <div className="max-w-xl w-full mx-auto flex flex-col gap-4 mb-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Respuestas</h1>
                            <p className="text-muted-foreground">Separa con comas para múltiples búsquedas (ej: obras, alumbrado)</p>
                        </div>
                        <div className="relative flex gap-2">
                            <div className="relative w-full">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Buscar por #tema, palabra..."
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
                                <Dialog key={response.id}>
                                    <DialogTrigger asChild>
                                        <Card key={response.id} className="overflow-hidden rounded-lg hover:shadow-md transition-all duration-200 border-zinc-200">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg font-bold leading-tight truncate max-w-[300px]">{response.title}</CardTitle>
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
                                            </CardContent>
                                            <CardFooter>
                                                <div className="flex flex-wrap gap-1.5 mt-auto">
                                                    {
                                                        response.tags?.map((tag, i) => (
                                                            <Badge
                                                                key={i}
                                                                variant="secondary"
                                                                className='cursor-pointer hover:bg-zinc-200/80 transition-colors px-2 py-0.5 text-xs font-normal'
                                                                // 3. UPDATED CLICK HANDLER
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleTagClick(tag) // Now adds with comma!
                                                                }}
                                                            >
                                                                <Hash className="w-3 h-3 mr-1 opacity-50" />
                                                                {tag}
                                                            </Badge>
                                                        ))
                                                    }
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{response.title}</DialogTitle>
                                            <DialogDescription className="text-xs flex flex-col justify-center pt-3">
                                                <span className="block w-full text-center">{response.id}</span>
                                                <div className="flex items-center justify-between text-xs pt-2 w-full">
                                                    <span className="font-medium text-zinc-700">
                                                        {response.user?.full_name ?? "Anónimo"}
                                                    </span>
                                                    <span>
                                                        {new Date(response.created_at).toLocaleDateString("es-MX")}
                                                    </span>
                                                </div>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <CardContent className="flex flex-col gap-4">
                                            <p className="text-sm text-zinc-600 leading-relaxed">
                                                {response.description}
                                            </p>
                                        </CardContent>
                                        <DialogFooter>
                                            <div className="flex flex-wrap gap-1.5 mt-auto w-full">
                                                {
                                                    response.tags?.map((tag, i) => (
                                                        <Badge
                                                            key={i}
                                                            variant="secondary"
                                                            className='cursor-pointer hover:bg-zinc-200/80 transition-colors px-2 py-0.5 text-xs font-normal'
                                                            // 3. UPDATED CLICK HANDLER
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleTagClick(tag) // Now adds with comma!
                                                            }}
                                                        >
                                                            <Hash className="w-3 h-3 mr-1 opacity-50" />
                                                            {tag}
                                                        </Badge>
                                                    ))
                                                }
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            ))
                        }

                        {/* Empty State */}
                        {filteredResponses?.length === 0 && (
                            <div className="col-span-full text-center py-10 text-muted-foreground">
                                <p>No se encontraron resultados para &quot;{searchTerm}&quot;</p>
                                <Button variant="link" onClick={() => setSearchTerm("")}>Limpiar filtros</Button>
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}