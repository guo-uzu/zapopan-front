import { DashBoardTable } from "@/types/dashboardTable";
import { Button } from "../ui/button";
import { handleFetchPng } from "@/hooks/fetch-data";

export default function DownloadChartBtn({ data, title, dateFrom, dateTo }: { data: DashBoardTable[], title: string, dateFrom?: string, dateTo?: string }) {
    const handlerFetchPng = async () => {
        await handleFetchPng(data, title, dateFrom, dateTo)
    }
    return (
        <Button onClick={handlerFetchPng} variant="outline" className="cursor-pointer">Descargar</Button>
    )
}