import { createClient } from '@/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  // 1. Obtenemos los parámetros
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // Opcional: Si mandaste un parámetro "next" desde el login, lo recuperamos
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    // 2. Creamos el cliente e intercambiamos el código
    const cookieStore = await cookies()
    // Nota: Asegúrate de que tu createClient soporte recibir cookieStore, 
    // si no, úsalo sin argumentos según tu configuración.
    const supabase = createClient(cookieStore)

    await supabase.auth.exchangeCodeForSession(code)
  }

  // --- AQUÍ ESTÁ EL ARREGLO ---

  // 3. Obtenemos la URL base segura
  // En Producción (Cloud Run) esto leerá "https://atencion-al-usuario.uzu.digital"
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (siteUrl) {
    // Si estamos en producción, forzamos la redirección al dominio correcto
    return NextResponse.redirect(new URL(next, siteUrl))
  } else {
    // Si estamos en local (no existe la variable), usamos el request original
    return NextResponse.redirect(new URL(next, request.url))
  }
}