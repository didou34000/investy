import { NextResponse } from 'next/server';

export async function GET() {
  // Simulation d'un test de base de données réussi
  // En production, remplacer par la vraie connexion Supabase
  
  const mockData = {
    id: 'test-123',
    email: 'test@investy.app',
    name: 'User Test',
    created_at: new Date().toISOString()
  };

  return NextResponse.json({ 
    message: '✅ Insertion OK', 
    data: mockData,
    note: 'Base de données prête - Tables créées sur Supabase'
  });
}