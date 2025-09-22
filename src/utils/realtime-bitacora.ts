"use server"
import { createClient } from "@supabase/supabase-js"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUSHABLE_KEY || ""

export const realtimeBitacora = async () => {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const channels = supabase.getChannels()
  console.log(channels)
}
