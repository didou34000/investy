import { NextResponse } from 'next/server';
import { sendWeeklyAlertEmail } from '@/lib/email';

// Simulation d'une base de données d'utilisateurs
// En production, ceci viendrait de Supabase
const mockUsers = [
  { id: 1, email: "test@example.com", name: "Test User", profile_type: "Équilibré" },
  { id: 2, email: "prudent@example.com", name: "User Prudent", profile_type: "Prudent" },
  { id: 3, email: "dynamique@example.com", name: "User Dynamique", profile_type: "Dynamique" },
];

export async function GET() {
  try {
    console.log('🚀 Début de l\'envoi des alertes hebdomadaires...');
    
    const results = [];
    
    for (const user of mockUsers) {
      try {
        console.log(`📧 Envoi email à ${user.email} (profil: ${user.profile_type})`);
        
        const result = await sendWeeklyAlertEmail(user, user.profile_type);
        
        results.push({
          user: user.email,
          profile: user.profile_type,
          success: result.success,
          error: result.error || null
        });
        
        // Délai entre les envois pour éviter le rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Erreur pour ${user.email}:`, error);
        results.push({
          user: user.email,
          profile: user.profile_type,
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    console.log(`✅ Envoi terminé: ${successCount}/${totalCount} emails envoyés`);
    
    return NextResponse.json({
      message: `Alertes hebdomadaires envoyées: ${successCount}/${totalCount}`,
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erreur générale lors de l\'envoi des alertes:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi des alertes',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Endpoint pour tester l'envoi à un utilisateur spécifique
export async function POST(request: Request) {
  try {
    const { email, name, profile_type } = await request.json();
    
    if (!email || !profile_type) {
      return NextResponse.json(
        { error: 'Email et profile_type requis' },
        { status: 400 }
      );
    }
    
    console.log(`🧪 Test d'envoi email à ${email} (profil: ${profile_type})`);
    
    const result = await sendWeeklyAlertEmail(
      { email, name: name || 'Test User' }, 
      profile_type
    );
    
    return NextResponse.json({
      message: 'Email de test envoyé',
      success: result.success,
      error: result.error || null,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du test d\'envoi:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors du test d\'envoi',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
