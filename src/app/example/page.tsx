
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {data: status_bitacora} = await supabase.from('status_bitacora').select("*")

  console.log(status_bitacora)  

  return (
    <ul>
      
    </ul>
  )
}
