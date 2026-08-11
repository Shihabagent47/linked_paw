import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const AUTH_PATHS = ['/login', '/signup', '/callback', '/onboarding']

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — do NOT remove this call
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAuthPath = AUTH_PATHS.some((p) => path.startsWith(p))

  // Unauthenticated user hitting a protected route → /login
  if (!user && !isAuthPath && path !== '/about') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Authenticated user hitting login/signup → home
  if (user && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
