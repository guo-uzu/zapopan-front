"use server"
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://rpbkprzjlgbjqwgxrdqr.supabase.co"


export const sendData = async (data) => {
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUSHABLE_KEY || ""
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: bitacora, error } = await supabase.from("bitacora").insert({
  })
}
