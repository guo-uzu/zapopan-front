"use server"
import { createClient } from "@/utils/supabase/client"
import { auth } from "@clerk/nextjs/server";

export const fetchData = async () => {
  const { userId } = await auth()
  if (!userId) throw new Error("User not founded")
  const supabase = createClient()
  const response = await supabase
    .from("bitacora")
    .select(`
      id,
      users_clerk:user_id(id,first_name, last_name, status, img_url),
      account_bitacora:account_id(name),
      created_at,
      category_bitacora:category_id(name),
      description,
      direction,
      folio,
      link,
      observations,
      priority_bitacora:priority_id(name),
      status_bitacora:status_id(name),
      username,
      responsable_area_bitacora:area_id(name),
      colonia,
      channel_bitacora:channel_id(name),
      social_network_bitacora:social_network_id(name)
    `)
    .eq("available", true)
    .order("created_at", { ascending: false })
  console.log(response)
  return response
}

export const getDataChartsGeneral = async () => {
  const supabase = createClient()
  const { userId } = await auth()
  if (!userId) throw new Error("User not founded")
  const { data } = await supabase
    .from('bitacora_counts_by_day')          // or _v2
    .select('day_date, day_label, count')    // if using the two-column version
    .order('day_date', { ascending: true });
  return data
}