import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// frontend-user middleware
// Protects /cart, /checkout, /orders — requires USER login cookie
// Redirects away from /login & /register if already logged in

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get('auth_token')?.value;
  const userRole  = request.cookies.get('user_role')?.value;

  const isLoggedIn = !!authToken;

  // Protected routes: must be logged in
  const protectedRoutes = ['/cart', '/checkout', '/orders'];
  if (protectedRoutes.some(r => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Already logged in — redirect away from auth pages
  if ((pathname === '/login' || pathname === '/register') && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cart/:path*', '/checkout/:path*', '/orders/:path*', '/login', '/register'],
};
