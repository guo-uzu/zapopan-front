import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. Get the client and the default response
  const { supabase, response } = createClient(request)

  // 2. Refresh the session (this also writes the new cookie to 'response')
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 3. Get the path the user is trying to access
  const { pathname } = request.nextUrl

  // 4. Define all routes that are "public" (accessible to logged-out users)
  //    According to your request, this is '/sign-in' and '/bitacora'.
  const publicRoutes = ['/sign-in', '/bitacora', '/auth/callback']

  // 5. Check if the current route is in our public list
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // --- Main Security Logic ---

  // 6. IF the user is NOT logged in (!session)
  //    AND the route is NOT public...
  if (!session && !isPublicRoute) {
    // ...then redirect them to the sign-in page.
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return Response.redirect(url)
  }

  // --- Optional UX Improvement ---

  // 7. IF the user IS logged in (session)
  //    AND they are trying to go to the '/sign-in' page...
  if (session && pathname === '/sign-in') {
    // ...redirect them to the dashboard (which is '/')
    const url = request.nextUrl.clone()
    url.pathname = '/' // Redirect to your dashboard
    return Response.redirect(url)
  }

  // 8. If none of the above rules matched, let the user proceed.
  //    This returns the 'response' which includes the refreshed session cookie.
  return response
}

// 6. Configure the matcher (same as before)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}