import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Password gate middleware (disabled by default)
 *
 * Set PASSWORD_GATE_ENABLED=true in .env to enable
 * Set PASSWORD_GATE_VALUE to the password
 *
 * This is a simple implementation for v1.
 * For production, consider more secure authentication.
 */
export function middleware(request: NextRequest) {
  const enabled = process.env.PASSWORD_GATE_ENABLED === 'true';

  if (!enabled) {
    return NextResponse.next();
  }

  const password = process.env.PASSWORD_GATE_VALUE || 'changeme';
  const authCookie = request.cookies.get('rh_auth');

  // If user is authenticated, allow
  if (authCookie?.value === password) {
    return NextResponse.next();
  }

  // If accessing the auth page, allow
  if (request.nextUrl.pathname === '/auth') {
    return NextResponse.next();
  }

  // If accessing API routes for auth, allow
  if (request.nextUrl.pathname === '/api/auth/login') {
    return NextResponse.next();
  }

  // Otherwise, redirect to auth page
  const url = request.nextUrl.clone();
  url.pathname = '/auth';
  url.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimisation files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
