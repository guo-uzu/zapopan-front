"use server";
// getGlobalReports.ts
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

type DatesToSearch = {
  from: string | null;
  to: string | null;
};

export const getUserReports = async ({ from, to }: DatesToSearch) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  const { data, error } = await supabase.rpc(
    "get_bitacora_status_counts_user",
    {
      userid: user.id,
      from_date: from,
      to_date: to,
    },
  );

  if (error) throw error;
  return data[0];
};
