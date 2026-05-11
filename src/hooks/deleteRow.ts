"use server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export const deleteRespuesta = async (id: string | undefined) => {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")
  const { error } = await supabase.from("respuestas").update({ available: false }).eq("id", id)
  if (error) {
    throw new Error("Error delete")
  }
  return { ok: true }
}
