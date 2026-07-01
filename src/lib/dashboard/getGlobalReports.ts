// getReportsToday.ts
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const getGlobalReports = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");

  const { data, error } = await supabase.rpc("get_bitacora_status_counts");

  if (error) throw error;

  return data[0];
};
