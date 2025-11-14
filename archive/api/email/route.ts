import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, profile, allocation, monthly, horizon, projection } = await req.json();
    
    if (!email || !profile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Générer un token de partage
    const shareResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/api/share/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(r => r.json()).catch(() => null);

    const shareLink = shareResponse?.token
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/share/${shareResponse.token}`
      : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}`;

    // Simulation d'envoi d'email avec lien de partage
    console.log('📧 Email envoyé à:', email);
    console.log('📊 Profil:', profile);
    console.log('📈 Allocation:', allocation);
    console.log('💰 Montant mensuel:', monthly);
    console.log('⏰ Horizon:', horizon);
    console.log('🎯 Projection:', projection);
    console.log('🔗 Lien de partage:', shareLink);

    return NextResponse.json({ 
      success: true, 
      message: 'Plan d\'investissement envoyé par email',
      shareLink,
      note: 'Simulation - Resend API à configurer'
    });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
