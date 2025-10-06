
import { createClient } from "@supabase/supabase-js"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUSHABLE_KEY || ""
import { auth } from "@clerk/nextjs/server";

export const realtimeBitacora = async () => {
  const { userId } = await auth()
  const supabase = createClient(supabaseUrl, supabaseKey)
  await supabase.realtime.setAuth()
  const channel = supabase
    .channel(`bitacora: ${userId}`, { config: { private: true } })
    .on("broadcast", { event: "INSERT" }, (payload) => console.log("New bitacora row: ", payload))
    .on("broadcast", { event: "UPDATE" }, (payload) => console.log("New bitacora row: ", payload))
    .subscribe((status) => {
      console.log("Subscription status: ", status)
    })

}
