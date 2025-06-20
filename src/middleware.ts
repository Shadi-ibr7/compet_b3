import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export default async function middleware(request: NextRequestWithAuth) {
  const path = request.nextUrl.pathname;

  // Protéger les routes admin
  if (path.startsWith('/admin')) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    // Vérifier si l'utilisateur est un admin
    if (!token || token.role !== 'admin') {
      // Rediriger vers la page d'accueil si l'utilisateur n'est pas un admin
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Configuration des routes à protéger
export const config = {
  matcher: [
    '/admin/:path*'
  ]
} 