import { DashBoardTable } from "@/types/dashboardTable";
import { Button } from "../ui/button";
import { handleFetchPng } from "@/hooks/fetch-data";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

export default function DownloadChartBtn({ data, title, dateFrom, dateTo }: { data: DashBoardTable[], title: string, dateFrom?: string, dateTo?: string }) {
    const handleDownloadBtn = async (formatFile: string) => {
        await handleFetchPng(data, title, dateFrom, dateTo, formatFile)
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="outline" className="cursor-pointer">Descargar <Download /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Formatos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDownloadBtn("png")} className="cursor-pointer">PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadBtn("jpg")} className="cursor-pointer">JPG</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadBtn("pdf")} className="cursor-pointer">PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadBtn("svg")} className="cursor-pointer">SVG</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}