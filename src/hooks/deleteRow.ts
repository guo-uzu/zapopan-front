"use server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export const deleteRowBitacora = async (id: string) => {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")
  const { error } = await supabase.from("bitacora").update({ available: false }).eq("id", id)
  if (error) {
    console.log("error bitacora delete", error)
    throw new Error("Error delete")
  }
  return { ok: true }
}

export const deleteRespuesta = async (id: string | undefined) => {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")
  console.log(id)
  const { error } = await supabase.from("respuestas").update({ available: false }).eq("id", id)
  if (error) {
    console.log("error bitacora delete", error)
    throw new Error("Error delete")
  }
  return { ok: true }
}
