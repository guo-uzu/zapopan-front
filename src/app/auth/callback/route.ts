import { createClient } from '@/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // 1. Get the URL from the incoming request
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  // 2. If there's a 'code' in the URL...
  if (code) {
    // 3. Create a Supabase client that can run on the server
    const supabase = createClient()

    // 4. Exchange the 'code' for a real user session
    //    This also automatically sets the auth cookie for us!
    await supabase.auth.exchangeCodeForSession(code)
  }

  // 5. Send the user back to the main page (your dashboard)
  //    They are now logged in!
  return NextResponse.redirect(new URL('/', request.url))
}