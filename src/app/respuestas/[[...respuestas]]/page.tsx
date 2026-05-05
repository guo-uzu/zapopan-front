"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"
import { Separator } from "@/components/ui/separator"
import { Hash, LoaderCircleIcon, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { sendResponse, updateResponse } from "@/hooks/sendData"
import { getResponses } from "@/hooks/fetch-data"
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns"
import MultipleSelector, { Option } from "./multi-select"
import { toast } from "sonner"
import { AlertDialogFooter, AlertDialogHeader, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog"
import { deleteRespuesta } from "@/hooks/deleteRow"

interface Response {
    id: string
    labels_areas: Option[]
    created_at: string
    description_jjf: string
    description_gob: string
    title: string
    updated_at: string
    latest_updated_user_id?: {
        full_name: string
    }
    user_id: {
        full_name: string
        email: string
        avatar_url: string
    }
}

interface DefaultForm {
    id?: string
    title: string
    jjfDescription: string
    gobDescription: string
    selectedAreas: Option[]
}

export default function Respuestas() {
    const [formDefaultData, setFormDefaultData] = useState<DefaultForm>({
        title: "",
        jjfDescription: "",
        gobDescription: "",
        selectedAreas: [],
    })
    const [responses, setResponses] = useState<Response[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [openSheet, setOpenSheet] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [isEditing, setEditing] = useState(false)

    const [selectedResponse, setSelectedResponse] = useState<Response>()

    const [upperMenu, setUpperMenu] = useState(false)

    const supabase = createClient()

    const handleData = async () => {
        const data = await getResponses()
        if (!data) {
            setResponses([])
            return
        }
        const formattedData = data.map((item: any) => ({
            ...item,

            // REGLA: Si user_id es un array, extrae la posición [0]. Si ya es objeto o null, déjalo igual.
            user_id: Array.isArray(item.user_id)
                ? item.user_id[0]
                : item.user_id,

            // Misma lógica para el usuario que actualizó
            latest_updated_user_id: Array.isArray(item.latest_updated_user_id)
                ? item.latest_updated_user_id[0]
                : item.latest_updated_user_id
        }))

        // Ahora sí, los datos coinciden perfectamente con tu interfaz Response[]
        setResponses(formattedData as Response[])
    }

    useEffect(() => {
        if (searchTerm !== "") {
            setUpperMenu(true)
        } else if (searchTerm === "") {
            setUpperMenu(false)
        }
    }, [searchTerm])

    useEffect(() => {
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
        // If user typed a comma but no words yet, return true
        if (terms.length === 0) return true

        // B. Check if ANY of the terms match (OR logic)
        // If you want them to match ALL terms (AND logic), change .some() to .every()
        return terms.some((term: string) => {
            const matchesTitle = response.title.toLowerCase().includes(term)
            const matchesDescJJF = response.description_jjf.toLowerCase().includes(term)
            const matchesTagsAreas = response.labels_areas?.some(tag => tag.label.toLowerCase().includes(term.split("#")[1]))
            return matchesTitle || matchesDescJJF || matchesTagsAreas
        })
    })

    const handleTagClick = (tag: string) => {
        const tagWithHash = `#${tag}`
        if (searchTerm.includes(tagWithHash)) return

        // If search is empty, just set the tag
        // If not empty, append with a comma
        setSearchTerm(prev => prev ? `${prev}, ${tagWithHash}` : tagWithHash)
    }

    useEffect(() => {
        if (!openSheet) {
            setEditing(false)
        }
    }, [openSheet])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpenSheet((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if (formDefaultData.selectedAreas.length === 0) {
            toast.error("Error. Verifica los datos ingresados", { position: "top-center" })
            setLoading(false)
            return
        }
        if (!isEditing) {
            const formData: DefaultForm = {
                title: formDefaultData.title,
                jjfDescription: formDefaultData.jjfDescription,
                gobDescription: formDefaultData.gobDescription,
                selectedAreas: formDefaultData.selectedAreas,
            }
            toast.promise(
                sendResponse(formData),
                {
                    loading: "Cargando...",
                    success: (response) => {
                        if (response.ok === true) {
                            setLoading(false)
                            handleReset()
                        }
                        return "Respuesta creada"
                    },
                    error: "Error",
                    position: "top-center"
                }
            )
        } else {
            const formData: DefaultForm = formDefaultData
            toast.promise(
                updateResponse(formData),
                {
                    loading: "Cargando...",
                    success: (response) => {
                        if (response.ok === true) {
                            setLoading(false)
                        }
                        handleReset()
                        return "Respuesta actualizada"
                    },
                    error: "Error",
                    position: "top-center"
                }
            )
        }
    }

    const handleReset = () => {
        setFormDefaultData({
            id: "",
            title: "",
            jjfDescription: "",
            gobDescription: "",
            selectedAreas: [],
        })
    }

    const handleDeleteRespuesta = async () => {
        toast.promise(deleteRespuesta(selectedResponse?.id), {
            loading: "Eliminando registro...",
            success: "Registro eliminado correctamente.",
            error: "Error eliminado este registro, intente nuevamente más tarde.",
            position: "top-center"
        })
    }

    const handleEditRespuesta = async () => {
        setOpenSheet(!openSheet)
        setEditing(!isEditing)
        setOpenDialog(!openDialog)
        setFormDefaultData({
            id: selectedResponse?.id,
            title: selectedResponse?.title || "",
            jjfDescription: selectedResponse?.description_jjf || "",
            gobDescription: selectedResponse?.description_gob || "",
            selectedAreas: selectedResponse?.labels_areas || [],
        })
    }

    const handleViewDialog = (item: Response) => {
        setSelectedResponse(item)
        setOpenDialog(!openDialog)
    }

    useEffect(() => {
        const subscription = supabase
            .channel("changes")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "respuestas"
            }, () => {
                handleData()
            })
            .subscribe()
        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    const formatDataFrom = (dateString?: string) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "Fecha inválida"
        const day = String(date?.getDate()).padStart(2, "0")
        const month = date?.toLocaleDateString("es-MX", { month: "short" })
        return `${day}/${month}/${date?.getFullYear()}`
    }


    return (
        <SidebarProvider >
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
                        <div className="relative flex flex-col gap-2">
                            <div className="relative w-full">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Buscar por #etiqueta, palabra..."
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
                            <div>
                                <Sheet open={openSheet} onOpenChange={() => {
                                    setOpenSheet((openSheet) => !openSheet)
                                    if (isEditing) {
                                        handleReset()
                                    }
                                }} >
                                    <SheetTrigger className="text-muted-foreground text-sm">
                                        Click aquí para crear una respuesta o teclea {" "}
                                        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                                            <span className="text-xs">⌘</span>J
                                        </kbd>
                                    </SheetTrigger>
                                    <SheetContent className="overflow-y-scroll">
                                        <SheetHeader>
                                            <SheetTitle>Crea una respuesta</SheetTitle>
                                        </SheetHeader>
                                        <form onSubmit={handleFormSubmit} className="grid flex-1 auto-rows-min gap-6 px-4">
                                            <FieldGroup>
                                                <FieldGroup>
                                                    <Field>
                                                        <Label htmlFor="title">Título</Label>
                                                        <Input required value={formDefaultData.title} onChange={(e) => setFormDefaultData({ ...formDefaultData, title: e.target.value })} type="text" name="title" id="title" />
                                                    </Field>
                                                    <Field>
                                                        <Label htmlFor="description_jjf">Descripción Frangie</Label>
                                                        <Textarea required value={formDefaultData.jjfDescription} id="description_jjf" rows={4} onChange={(e) => setFormDefaultData({ ...formDefaultData, jjfDescription: e.target.value })} />
                                                    </Field>
                                                    <Field>
                                                        <Label htmlFor="description_gob">Descripción Gobierno de Zapopan</Label>
                                                        <Textarea required id="description_gob" value={formDefaultData.gobDescription} rows={4} onChange={(e) => setFormDefaultData({ ...formDefaultData, gobDescription: e.target.value })} />
                                                    </Field>
                                                    <FieldSet>
                                                        <FieldLegend>Etiquetas</FieldLegend>
                                                        <FieldGroup>
                                                            <Field orientation="vertical">
                                                                <FieldLabel>Áreas responsables <span className="text-red-500">*</span></FieldLabel>
                                                                <MultipleSelector
                                                                    commandProps={{
                                                                        label: 'Selecciona un área'
                                                                    }}
                                                                    defaultOptions={ColumnsBitacoraOpts.area_id}
                                                                    placeholder='Selecciona un área'
                                                                    hidePlaceholderWhenSelected
                                                                    emptyIndicator={<p className='text-center text-sm'>No se encontraron resultados</p>}
                                                                    value={formDefaultData.selectedAreas}
                                                                    onChange={(data) => setFormDefaultData({
                                                                        ...formDefaultData,
                                                                        selectedAreas: data
                                                                    })}
                                                                    className='w-full'
                                                                />
                                                            </Field>
                                                        </FieldGroup>
                                                    </FieldSet>
                                                    <Field orientation="responsive">
                                                        <Button type="submit" disabled={isLoading}>
                                                            {
                                                                !isLoading ? (
                                                                    <>
                                                                        Enviar
                                                                    </>
                                                                )
                                                                    :
                                                                    (
                                                                        <>
                                                                            <LoaderCircleIcon className='animate-spin' />
                                                                            Cargando
                                                                        </>
                                                                    )
                                                            }
                                                        </Button>
                                                        <Button onClick={handleReset} type="reset" variant="secondary">Borrar</Button>
                                                    </Field>
                                                </FieldGroup>
                                            </FieldGroup>
                                        </form>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                    {/* Upper Menu */}
                    {
                        upperMenu ? (
                            <div className="scroller w-full flex flex-row gap-x-2 overflow-x-scroll text-xs py-2 px-8">
                                <Badge>Áreas responsables</Badge>
                                {
                                    ColumnsBitacoraOpts.area_id.map((area, index) => (
                                        <Badge key={index} variant="outline" onClick={() => handleTagClick(area.label)} className="cursor-pointer hover:bg-zinc-200/80 transition-colors px-2 py-0.5 text-xs font-normal">
                                            {area.value}
                                        </Badge>
                                    ))
                                }

                            </div>
                        )
                            :
                            ""
                    }

                    {/* RESULTS GRID */}
                    <div>
                        <div className={`flex flex-col gap-6 mb-10`}>
                            {
                                !upperMenu ? (
                                    <>
                                        <h2 className="text-xl font-bold">Área responsable</h2>
                                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {
                                                ColumnsBitacoraOpts.area_id
                                                    // 1. FILTER: Keep only the items that are NOT in the excluded_view list
                                                    .filter((area) => !ColumnsBitacoraOpts.excluded_view.find((data) => area.id === data.id))
                                                    // 2. MAP: Render the remaining items
                                                    .map((area, index) => (
                                                        <Card
                                                            key={index}
                                                            onClick={() => {
                                                                handleTagClick(area.label)
                                                                setUpperMenu((prev) => !prev)
                                                            }}
                                                            className="rounded-lg hover:shadow-md transition-all duration-200"
                                                        >
                                                            <CardHeader>{area.value}</CardHeader>
                                                        </Card>
                                                    ))
                                            }
                                        </div>
                                    </>
                                )
                                    : ""
                            }
                        </div>
                        <div className={` w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
                            {
                                //  Data 
                            }
                            {
                                !upperMenu ?
                                    ""
                                    :
                                    filteredResponses?.map(response => (
                                        <Card onClick={() => handleViewDialog(response)} key={response.id} className="overflow-hidden rounded-lg hover:shadow-md transition-all duration-200 border-zinc-200">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg font-bold leading-tight truncate max-w-[300px]">{response.title}</CardTitle>
                                                <CardDescription className="flex items-center justify-between text-xs mt-2">
                                                    <span className="font-medium text-zinc-700 truncate max-w-[120px]">
                                                        {response.user_id?.full_name ?? "Anónimo"}
                                                    </span>
                                                    <span>
                                                        {formatDataFrom(response.created_at)}
                                                    </span>
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col gap-4">
                                                <div>
                                                    <h2 className="text-sm font-bold">JJF</h2>
                                                    <p className="line-clamp-4 text-sm text-zinc-600 leading-relaxed">
                                                        {response.description_jjf}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h2 className="text-sm font-bold">Gobierno de Zapopan</h2>
                                                    <p className="line-clamp-4 text-sm text-zinc-600 leading-relaxed">
                                                        {response.description_gob}
                                                    </p>
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <div className="flex flex-wrap gap-1.5 mt-auto">
                                                    {
                                                        response.labels_areas?.map((tag, i) => (
                                                            <Badge
                                                                key={i}
                                                                variant="secondary"
                                                                className='cursor-pointer hover:bg-zinc-200/80 transition-colors px-2 py-0.5 text-xs font-normal'
                                                                // 3. UPDATED CLICK HANDLER
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleTagClick(tag.label) // Now adds with comma!
                                                                }}
                                                            >
                                                                <Hash className="w-3 h-3 mr-1 opacity-50" />
                                                                {tag.label}
                                                            </Badge>
                                                        ))
                                                    }

                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))
                            }
                        </div>
                        <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{selectedResponse?.title}</DialogTitle>
                                    <DialogDescription className="flex flex-col gap-2 text-xs mt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="flex flex-row items-center justify-between text-xs pt-2 w-full font-medium text-zinc-700">
                                                {selectedResponse?.user_id?.full_name ?? "Anónimo"}
                                            </span>
                                            <span>
                                                {formatDataFrom(selectedResponse?.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex flex-row items-center justify-between text-xs pt-2 w-full font-medium text-zinc-700">
                                                {selectedResponse?.latest_updated_user_id?.full_name ?? "Anónimo"}
                                            </span>
                                            <span>
                                                {formatDataFrom(selectedResponse?.updated_at)}
                                            </span>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                                <CardContent className="flex flex-col gap-4 max-h-96 overflow-y-scroll">
                                    <div>
                                        <h2 className="text-sm font-bold">JJF</h2>
                                        <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap break-words">
                                            {selectedResponse?.description_jjf}
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold">Gobierno de Zapopan</h2>
                                        <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap break-words">
                                            {selectedResponse?.description_gob}
                                        </p>
                                    </div>
                                </CardContent>
                                <DialogFooter>
                                    <div className="flex flex-col w-full gap-8">
                                        <div className="flex flex-wrap gap-1.5 mt-auto w-full">
                                            {
                                                selectedResponse?.labels_areas?.map((tag, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="secondary"
                                                        className='cursor-pointer hover:bg-zinc-200/80 transition-colors px-2 py-0.5 text-xs font-normal'
                                                        // 3. UPDATED CLICK HANDLER
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleTagClick(tag.label)
                                                        }}
                                                    >
                                                        <Hash className="w-3 h-3 mr-1 opacity-50" />
                                                        {tag.label}
                                                    </Badge>
                                                ))
                                            }
                                        </div>
                                        <div className="flex justify-end">
                                            <div className="flex gap-2">
                                                <AlertDialog>
                                                    <Button onClick={handleEditRespuesta}>
                                                        Editar
                                                    </Button>
                                                    <AlertDialogTrigger asChild>
                                                        <Button>Borrar</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className='top-0 mt-6 translate-y-0 sm:max-w-[425px]'>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                ¿Estás seguro de eliminar esta respuesta?
                                                            </AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <AlertDialogDescription>Esta acción no se puede deshacer. Contacte al administrador en caso de equivocación.</AlertDialogDescription>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleDeleteRespuesta}>Eliminar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

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
        </SidebarProvider >
    )
}
