import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware minimal - laisse passer toutes les requêtes
// Les routes API gèrent leur propre authentification via Supabase
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Middleware désactivé - ne s'applique à aucune route
// Les routes API gèrent leur propre authentification
export const config = {
  matcher: []
}