import { createClient } from "@/utils/supabase/client"

export const fetchData = async (id?: string | null) => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")
  let query = supabase
    .from("bitacora")
    .select(`
      id,
      users:user_id(full_name),
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
      social_network_bitacora:social_network_id(name)
    `)
    .eq("available", true)

  if (id) {
    query = query.eq("id", id)
  }

  const response = await query.order("created_at", { ascending: false })
  console.log(response)
  return response
}

export const getDataChartsGeneral = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")
  const { data } = await supabase
    .from('daily_area_counts ')
    .select('*')
    .order('date', { ascending: true });
  console.log(data)
  return data
}

export const getPendientesUser = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")
  console.log(user.id)
  const { data } = await supabase
    .from('bitacora')
    .select('*', { count: "exact", head: true })
  console.log(data)
  return data
}