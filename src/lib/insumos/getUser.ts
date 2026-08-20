import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const getUserId = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { id: user?.id, name: user?.user_metadata.full_name };
};
