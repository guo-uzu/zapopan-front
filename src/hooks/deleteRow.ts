"use server"
import { createClient } from "@/utils/supabase/server"

export const deleteRowBitacora = async (id: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("User not founded")
    const { error } = await supabase.from("bitacora").update({ available: false }).eq("id", id)
    if (error) {
        console.log("error bitacora delete", error)
        throw new Error("Error delete")
    }
    return { ok: true }
}