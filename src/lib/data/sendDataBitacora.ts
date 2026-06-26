"use server"
import { createClient } from "@/utils/supabase/server";
import { Inputs } from "@/hooks/types";
import { cookies } from "next/headers";
import { mustMap, accountMap, areaMap, categoryMap, channelMap, priorityMap, statusMap, socialNetworkMap } from "@/lib/bitacora/maps";

export const sendDataBitacora = async (formData: Inputs, clientTimeStr: string) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  const [year, month, day] = String(formData.created_at).split("-").map(Number)
  const createdTimestamp = `${year}-${month}-${day} ${clientTimeStr}`
  console.log(createdTimestamp)
  const payload = {
    user_id: user.id,
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
    created_at: createdTimestamp,
    username: formData.username,
    folio: formData.folio || null,
    social_network_id: mustMap(
      socialNetworkMap,
      formData.social_network,
      "social_network",
    ),
  };
  const { error } = await supabase.from("bitacora").insert(payload);
  if (error) {
    throw new Error("DB insert failed");
  }
  return { ok: true };
};

