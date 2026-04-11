import { createClient } from "@/utils/supabase/client";
import { cache } from "react";
const supabase = createClient();

export const fetchBitacora = cache(async (id?: string | null) => {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not founded");
    let query = supabase
        .from("bitacora")
        .select(
            `
      id,
      user_id(full_name),
      account_bitacora:account_id(name),
      created_at,
      category_bitacora:category_id(name),
      description,
      folio,
      link,
      observations,
      priority_bitacora:priority_id(name),
      status_bitacora:status_id(name),
      username,
      responsable_area_bitacora:area_id(name),
      colonia,
      channel_bitacora:channel_id(name),
      social_network_bitacora:social_network_id(name),
      updated_at,
      latest_updated_user_id(full_name),
      snapshot_before_edit(*),
      created_by_name
    `,
        )
        .eq("available", true);

    if (id) {
        query = query.eq("id", id);
    }
    const response = await query.order("created_at", { ascending: false });
    console.log(response);
    return response;
});
