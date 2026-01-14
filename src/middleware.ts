import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. Get the client and the default response
  const { supabase, response } = createClient(request)

  // 2. CRITICAL CHANGE: Use getUser() instead of getSession()
  //    getUser() validates the auth token against the server. 
  //    getSession() is insecure in middleware and causes the "double login" bug.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Get the path
  const { pathname } = request.nextUrl

  // 4. Public routes
  const publicRoutes = ['/sign-in', '/auth/callback']

  // 5. Check if public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // --- Main Security Logic ---

  // 6. Check against 'user' instead of 'session'
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return Response.redirect(url)
  }

  // --- Optional UX Improvement ---

  // 7. Check against 'user'
  if (user && pathname === '/sign-in') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return Response.redirect(url)
  }

  // 8. Return response
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}