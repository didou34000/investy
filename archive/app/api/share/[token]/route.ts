import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase"; // Commenté pour simulation

export async function GET(_: Request, { params }: { params: { token: string } }) {
  const t = params.token;
  
  // Simulation de vérification de token
  console.log('🔍 Vérification token:', t);
  
  // Simulation de données de quiz
  const mockResult = {
    id: 'simulated-quiz-' + Date.now(),
    allocation_type: 'equilibre',
    expected_return: 0.05,
    created_at: new Date().toISOString(),
    answers: { age: 3, horizon: 4, tolerance: 3, capacity: 3, experience: 2, drawdownOk: 2 },
    user_id: 'simulated-user-123'
  };

  return NextResponse.json({ 
    result: mockResult,
    note: 'Simulation - Supabase configuration needed'
  });
}
