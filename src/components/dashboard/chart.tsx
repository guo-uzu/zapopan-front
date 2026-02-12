import { DashBoardTable } from "@/types/dashboardTable";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const ChartDashboard = ({
    data,
    config,
}: {
    data: DashBoardTable[];
    config: ChartConfig;
}) => {
    const keys = Object.keys(config);
    return (
        <ChartContainer className="w-full h-auto" config={config}>
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <YAxis
                    dataKey="n_reports"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <XAxis
                    dataKey="category_name"
                    tickLine={true}
                    tickMargin={10}
                    axisLine={false}
                    interval={1}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                {keys.map((key) => (
                    <Bar
                        dataKey={key}
                        fill={`var(--color-${key})`}
                        radius={4}
                    />
                ))}
            </BarChart>
        </ChartContainer>
    );
};

export default ChartDashboard;
