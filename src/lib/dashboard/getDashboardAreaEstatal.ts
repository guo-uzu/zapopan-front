import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
import { formatDataDate } from "../formatters/date";
const supabase = SingletonClientSupabase.instance;

export const getDashboardAreaEstatal = async (
  data_from: Date,
  data_to: Date,
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  if (!data_from && !data_to) {
    return;
  }
  const dataFrom = new Date(`${formatDataDate(data_from)}T00:00:00`);
  const dataTo = new Date(`${formatDataDate(data_to)}T23:59:59`);
  const { data, error } = await supabase.rpc("getareacount", {
    data_from: dataFrom.toISOString(),
    data_to: dataTo.toISOString(),
  });
  if (error) {
    console.log("Error", error);
  }
  return data;
};
