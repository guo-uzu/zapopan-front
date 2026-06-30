import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";

const supabase = SingletonClientSupabase.instance;

export const fetchUsersFilterBitacora = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  let query = await supabase
    .from("users")
    .select(`id, full_name`, { count: "exact" })
    .eq("available", true);
  return query.data;
};

export type FetchUsersFilter = Awaited<
  ReturnType<typeof fetchUsersFilterBitacora>
>;
