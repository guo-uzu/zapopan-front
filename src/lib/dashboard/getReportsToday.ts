import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
import { unstable_noStore as noStore } from "next/cache";

const supabase = SingletonClientSupabase.instance;

export const getReportsToday = async (date: string) => {
  noStore();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  let query = await supabase
    .from("bitacora")
    .select("*", { count: "exact", head: true })
    .gte("created_at", date)
    .eq("available", true);
  return query.count;
};
