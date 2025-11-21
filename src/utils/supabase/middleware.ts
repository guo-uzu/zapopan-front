import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request cookies
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // And update the response cookies
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request cookies
          // FIX: Pass only the 'name', not the whole object
          request.cookies.delete(name)
          
          // And update the response cookies
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // We return both the client and the response.
  // The client will be used to check auth status.
  // The response will be returned from the main middleware.
  return { supabase, response }
}