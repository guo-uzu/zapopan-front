import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
import { formatDataDate } from "../formatters/date";
import { DateRange } from "react-day-picker";
const supabase = SingletonClientSupabase.instance;

export const getDataDashboard = async (
  dateRange: DateRange | undefined,
  supabaseFunction: string,
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  if (!dateRange?.from || !dateRange?.to) {
    return;
  }

  const dataFrom = new Date(`${formatDataDate(dateRange?.from)}T00:00:00`);
  const dataTo = new Date(`${formatDataDate(dateRange?.to)}T23:59:59`);
  const { data, error } = await supabase.rpc(supabaseFunction, {
    data_from: dataFrom,
    data_to: dataTo,
  });
  if (error) {
    throw Error("Error sending data");
  }
  return data;
};
