import { DashBoardTable } from "@/types/dashboardTable";

const totalDashboard = (data: DashBoardTable[]): number => {
    let total = 0;
    data.forEach((e) => (total += Number(e.n_reports)));
    return total;
};

export default totalDashboard;
