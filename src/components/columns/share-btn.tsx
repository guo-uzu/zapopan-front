"use client"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "../ui/badge"
import { Share2 } from "lucide-react"

export default function Share({ id }: { id?: string }) {
    const pathname = usePathname()
    const handleCopy = () => {
        // 2. Now we can safely use 'pathname' inside the click handler
        // We usually want the full URL, so we combine origin + path + id
        const fullUrl = `${window.location.origin}${pathname}?id=${id}`

        navigator.clipboard.writeText(fullUrl)
        toast.success("Link copiado al portapapeles")
    }
    return (
        <div className="w-full flex items-center justify-center">
            <Badge onClick={handleCopy} className='cursor-pointer w-full max-w-[200px] whitespace-normal capitalize rounded-full border-none shadow-xl bg-black/10 text-black focus-visible:outline-none'>
                <Share2 className="min-w-[20px]" />
                Compartir
            </Badge>
        </div>
    )
}