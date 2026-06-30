"use server";
import { Inputs } from "@/hooks/types";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

import {
  accountMap,
  areaMap,
  categoryMap,
  channelMap,
  mustMap,
  priorityMap,
  socialNetworkMap,
  statusMap,
} from "../bitacora/maps";

export const updateDataSupabase = async (
  formData: Inputs,
  clientTimeStr: string,
) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  // Fetch current row to compare created_at
  const { data: current, error: fetchError } = await supabase
    .from("bitacora")
    .select("created_at")
    .eq("id", formData.id);
  if (fetchError) throw new Error("Failed to fetch current row");
  const [year, month, day] = String(formData.created_at).split("-").map(Number);
  const formDateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Compare only the date part of the current created_at
  const rawCurrentDateStr = current[0].created_at as string;
  const currentDateStr = rawCurrentDateStr.split("T")[0];
  const updatedTimestamp = `${formDateStr} ${clientTimeStr}`;

  const payload = {
    latest_updated_user_id: user.id,
    ...(formDateStr !== currentDateStr && { created_at: updatedTimestamp }),
    updated_at: updatedTimestamp,
    account_id: mustMap(accountMap, formData.account, "account"),
    area_id: mustMap(areaMap, formData.area_responsable, "area_responsable"),
    category_id: mustMap(categoryMap, formData.category, "category"),
    channel_id: mustMap(channelMap, formData.channel, "channel"),
    priority_id: mustMap(priorityMap, formData.priority, "priority"),
    status_id: mustMap(statusMap, formData.status, "status"),
    colonia: formData.colonia || null,
    description: formData.description,
    link: formData.link || null,
    observations: formData.observations || null,
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

  if (error) throw new Error("DB update failed");
  return { ok: true };
};
