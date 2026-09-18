import { NextRequest, NextResponse } from "next/server"

// middleware.ts
export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
