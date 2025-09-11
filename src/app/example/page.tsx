
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {data: status_bitacora} = await supabase.from('status_bitacora').select("*")

  return (
    <ul>
      {status_bitacora?.map((status_bitacora) => (
        <li key={status_bitacora.id}>{status_bitacora.name}</li>
      ))}
    </ul>
  )
}
