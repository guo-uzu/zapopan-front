"use server"
import { Inputs } from "@/hooks/types";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

import { accountMap, areaMap, categoryMap, channelMap, mustMap, priorityMap, socialNetworkMap, statusMap } from "../bitacora/maps";

export const updateDataSupabase = async (
  formData: Inputs,
) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");

  const [year, month, day] = String(formData.created_at).split("-").map(Number)
  const now = new Date()
  const createdAt = new Date(
    year,
    month - 1,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  ).toISOString()

  const payload = {
    latest_updated_user_id: user.id,
    created_at: new Date(year, month - 1, day, 12, 0, 0).toISOString(),
    account_id: mustMap(accountMap, formData.account, "account"),
    area_id: mustMap(
      areaMap,
      formData.area_responsable,
      "area_responsable",
    ),
    category_id: mustMap(categoryMap, formData.category, "category"),
    channel_id: mustMap(channelMap, formData.channel, "channel"),
    priority_id: mustMap(priorityMap, formData.priority, "priority"),
    status_id: mustMap(statusMap, formData.status, "status"),
    colonia: formData.colonia || null,
    description: formData.description,
    link: formData.link || null,
    observations: formData.observations || null,
    updated_at: createdAt,
    folio: formData.folio || null,
    username: formData.username,
    social_network_id: mustMap(
      socialNetworkMap,
      formData.social_network,
      "social_network",
    ),
  };

  const { error } = await supabase
    .from("bitacora")
    .update(payload)
    .eq("id", formData.id);
  if (error) {
    throw new Error("DB insert failed");
  }
  return { ok: true };
};
