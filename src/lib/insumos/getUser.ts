import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
const supabase = SingletonClientSupabase.instance;

export const getUserId = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user)
  return { id: user?.id }
};
