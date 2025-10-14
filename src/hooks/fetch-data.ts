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
      name,
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
      channel_bitacora:channel_id(name)
    `)
    .order("created_at", { ascending: false })
  console.log("Si llego aca", response)
  return response
}
