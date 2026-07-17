import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
const supabase = SingletonClientSupabase.instance;

export const getResponses = async (
  terminos_busqueda: string = "",
  areas_json: { label: string }[] = [{ label: "" }],
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");

  const { data, error } = await supabase
    .rpc("search_responses", {
      areas_json: areas_json,
      terminos_busqueda: terminos_busqueda,
    })
    .range(0, 10);

  console.log("data", data);
  if (error) {
    throw new Error("Error searching the data");
  }
  return data;
};
