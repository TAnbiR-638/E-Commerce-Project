import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// frontend-admin middleware
// ALL routes except /login require ADMIN role cookie
// /login redirects to / if already admin

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get('auth_token')?.value;
  const userRole  = request.cookies.get('user_role')?.value;

  const isAdmin = !!authToken && userRole === 'ADMIN';

  // Public auth pages — allow access when not logged in
  if (pathname === '/login' || pathname === '/register') {
    if (isAdmin) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  // All other routes: must be admin
  if (!isAdmin) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
