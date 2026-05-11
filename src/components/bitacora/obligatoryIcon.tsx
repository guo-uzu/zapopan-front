import { Info } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"

const ObligatoryIcon = () => {
    return (
        <HoverCard openDelay={10} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Info size={16} className="text-red-500"/>
            </HoverCardTrigger>
            <HoverCardContent side="top" className="w-fit">
                <p className="text-xs w-fit">Este campo es obligatorio</p>
            </HoverCardContent>
        </HoverCard>
    )
}

export default ObligatoryIcon