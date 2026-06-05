"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { mustMap, accountMap, areaMap, categoryMap, channelMap, priorityMap, statusMap, socialNetworkMap } from "@/lib/bitacora/maps";
import { BitacoraRecord } from "@/types/bitacoraTable";

type DuplicateRow = {
  record: BitacoraRecord
  n: number
}

export const sendDuplicateRow = async ({ record, n }: DuplicateRow) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");

  const payload = {
    user_id: record.user_id,
    account_id: mustMap(accountMap, record.account_id?.name, "account"),
    area_id: mustMap(areaMap, record.area_id?.name, "area_responsable"),
    category_id: mustMap(categoryMap, record.category_id?.name, "category"),
    channel_id: mustMap(channelMap, record.channel_id?.name, "channel"),
    priority_id: mustMap(priorityMap, record.priority_id?.name, "priority"),
    status_id: mustMap(statusMap, record.status_id?.name, "status"),
    colonia: record.colonia || null,
    description: record.description,
    link: record.link || null,
    observations: record.observations || null,
    created_at: record.created_at,
    username: record.username,
    folio: record.folio || null,
    social_network_id: mustMap(
      socialNetworkMap,
      record.social_network_id?.name,
      "social_network",
    ),
  };

  const arrayPayloads = Array(n).fill(payload)

  const { error } = await supabase.from("bitacora").insert(arrayPayloads);
  if (error) {
    throw new Error("DB insert failed");
  }
  return { ok: true };
};

