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
    .from('daily_area_counts')
    .select('*')
    .eq("municipal", true)
    .order('date', { ascending: true });
  return data
}

export const getDataChartsAreaEstatal = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")
  const { data } = await supabase
    .from('daily_area_counts')
    .select('*')
    .eq("municipal", false)
    .order('date', { ascending: true });
  return data
}

export const getPendientesUser = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")
  const { data, error } = await supabase
    .from('bitacora')
    .select('status_id', { head: false })
    .eq("user_id", user.id)
    .in("status_id", [0, 1, 2, 3])

  if (error) throw error

  const counts = {
    status0: data.filter(x => x.status_id === 0).length,
    status1: data.filter(x => x.status_id === 1).length,
    status2: data.filter(x => x.status_id === 2).length,
    status3: data.filter(x => x.status_id === 3).length,
  }
  return { counts, error }
}

export const getPendientesTotal = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")
  const { data, error } = await supabase
    .from('bitacora')
    .select('status_id', { head: false })
    .in("status_id", [0, 1, 2, 3])

  if (error) throw error

  const counts = {
    status0: data.filter(x => x.status_id === 0).length,
    status1: data.filter(x => x.status_id === 1).length,
    status2: data.filter(x => x.status_id === 2).length,
    status3: data.filter(x => x.status_id === 3).length,
  }
  return { counts, error }
}


interface Response {
  id: string
  tags: string[]
  created_at: string
  description_jjf: string
  description_gob: string
  title: string
  user: {
    full_name: string
    email: string
    avatar_url: string
  } | undefined
}

export const getResponses = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")
  const { data } = await supabase
    .from("respuestas")
    .select(`
                    id,
                    title,
                    description_jjf,
                    description_gob,
                    tags,
                    created_at,
                    user:users(
                        full_name,
                        email,
                        avatar_url
                    )
                `)

  if (data) {
    const formattedData: Response[] = data.map((item) => {
      return ({
        ...item,
        user: Array.isArray(item.user) ? item.user[0] : item.user
      })
    })
    return formattedData
  }
}