import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
const supabase = SingletonClientSupabase.instance;

export const getResponses = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");

  const { data, error } = await supabase
    .from("respuestas")
    .select(
      `
      id,
      title,
      description_jjf,
      description_gob,
      labels_areas,
      created_at,
      updated_at,
      latest_updated_user_id(full_name),
      user_id(full_name,email,avatar_url)
      `,
    )
    .eq("available", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.log(error);
  }
  return data;
};
