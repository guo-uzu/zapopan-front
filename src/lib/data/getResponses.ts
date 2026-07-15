import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
const supabase = SingletonClientSupabase.instance;

type GetResponsesProps = {
  searchText: string;
  areaIds: string;
};

export const getResponses = async ({
  searchText,
  areaIds,
}: GetResponsesProps) => {
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
    .ilike("title", searchText)
    .ilike("description_jjf", searchText)
    .ilike("description_gob", searchText)
    .contains("labels_areas", areaIds)
    .eq("available", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.log(error);
  }
  return data;
};
