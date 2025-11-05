import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// API routes à protéger
const PROTECTED_API_ROUTES = [
  '/api/alerts',
  '/api/cron',
  '/api/email',
  '/api/ingest',
  '/api/analytics',
  '/api/feedback',
  '/api/events',
  '/api/macro',
  '/api/quotes',
  '/api/reco',
  '/api/share',
  '/api/subscribe',
  '/api/unsub'
]

// Clé API pour l'authentification
const API_KEY = process.env.API_KEY || 'your-secret-api-key-here'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const res = NextResponse.next();

  // Note: La synchronisation Supabase se fait dans les routes API via createServerComponentClient
  // Le middleware ne peut pas utiliser cookies() directement, donc on laisse les routes gérer la session

  // Vérifier si c'est une route API protégée
  const isProtectedRoute = PROTECTED_API_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Vérifier la clé API dans les headers
    const apiKey = request.headers.get('x-api-key')
    
    if (!apiKey || apiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - API key required' },
        { status: 401 }
      )
    }
  }

  return res
}

export const config = {
  matcher: [
    // Routes API protégées
    '/api/((?!health|ingest|cron).*)',
    // Toutes les autres routes (pour la sync Supabase)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}