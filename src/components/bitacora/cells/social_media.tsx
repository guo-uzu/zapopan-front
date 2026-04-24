import { Badge } from "@/components/ui/badge";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { BitacoraTable } from "@/types/bitacoraTable";
import type { CellContext } from "@tanstack/react-table";
import { Ban } from "lucide-react";
import { AiFillTikTok } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareInstagram, FaSquareXTwitter } from "react-icons/fa6";

const CellSocialMedia = (props: CellContext<BitacoraTable, unknown>) => {
    const value = String(props.getValue()).trim()
    let color: string | undefined = ColumnsBitacoraOpts.social_network.find(
        (e) => e.id === value,
    )?.color;
    if (!color) {
        color = "oklch(57.7% 0.245 27.325)"
    }
    return (
        <Badge
            style={{ color: color }}
            className="capitalize w-full rounded-full bg-current/10 border-none focus-visible:ring-amber-600/20 focus-visible:outline-none"
        >
            {value === "facebook" ? (
                <FaFacebookSquare />
            ) : value === "x" ? (
                <FaSquareXTwitter />
            ) : value === "instagram" ? (
                <FaSquareInstagram />
            ) : value === "tiktok" ? (
                <AiFillTikTok />
            ) : value === "N/A" ? (
                <Ban />
            ) : ""}
            {value}
        </Badge>
    )
}

export default CellSocialMedia