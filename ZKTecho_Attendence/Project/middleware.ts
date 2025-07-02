import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/api/auth/login'];
  
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Check for authentication on protected routes
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      if (path.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      if (path.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/login']
};