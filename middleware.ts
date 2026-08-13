import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Route Protection Rules ────────────────────────────────────────
// /admin/*           → requires ADMIN role  (except /admin/login)
// /cart, /checkout, /orders → requires any authenticated user
// /login, /register  → redirect to / if already logged in as USER
// /admin/login       → redirect to /admin if already logged in as ADMIN

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read cookies set during login
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole  = request.cookies.get('user_role')?.value;   // 'USER' | 'ADMIN'

  const isLoggedIn  = !!authToken;
  const isAdmin     = userRole === 'ADMIN';
  const isUser      = userRole === 'USER';

  // ── 1. Admin login page: redirect away if already admin ──────────
  if (pathname === '/admin/login') {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // ── 2. Admin area: block non-admins ──────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── 3. Protected user routes: require login ───────────────────────
  const protectedUserRoutes = ['/cart', '/checkout', '/orders'];
  if (protectedUserRoutes.some(r => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── 4. User auth pages: redirect away if already logged in ───────
  if (pathname === '/login' || pathname === '/register') {
    if (isUser)  return NextResponse.redirect(new URL('/', request.url));
    if (isAdmin) return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all relevant routes, skip static assets & API
  matcher: [
    '/admin/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/login',
    '/register',
  ],
};
