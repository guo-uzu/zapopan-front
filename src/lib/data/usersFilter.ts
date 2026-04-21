import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const fetchUsersFilterBitacora = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  let query = await supabase
    .from("users")
    .select(
      `id, full_name`,
      { count: "exact" },
    )
  return query.data;
};
