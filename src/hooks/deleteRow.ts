"use server"

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/client"


export const deleteRowBitacora = async (id: string) => {
    const { userId } = await auth()
    if (!userId) throw new Error("User not founded")
    const supabase = createClient()
    const { error } = await supabase.from("bitacora").update({ available: false }).eq("id", id)
    if (error) {
        console.log("error bitacora delete", error)
        throw new Error("Error delete")
    }
    return { ok: true }
}