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
  title
}: {
  data: DashBoardTable[];
  config: ChartConfig;
  title: string
}) => {
  const keys = Object.keys(config);
  return (
    <div className="w-full h-auto">
      <ChartContainer config={config}>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <YAxis
            dataKey="n_reports"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <XAxis
            dataKey="name"
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
      <span className="text-center mx-auto block w-full text-sm font-bold">{title}</span>
    </div>
  );
};

export default ChartDashboard;
