// app/page.tsx
import { TodaySummaryCard } from "@/components/dashboard/TodaySummaryCard";
import { DashboardClients } from "@/components/dashboard/DashboardClients";
import { GlobalStadistics } from "@/components/dashboard/GlobalStadistics";

export default function Page() {
  return (
    <DashboardClients
      todaySummary={<TodaySummaryCard />}
      globalStadistics={<GlobalStadistics />}
    />
  );
}
