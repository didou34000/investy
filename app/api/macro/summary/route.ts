import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Données simulées pour le développement
    const mockData = {
      timestamp: new Date().toISOString(),
      markets: [
        { symbol: "CAC40", price: 7423.45, change: 12.34, changePercent: 0.17 },
        { symbol: "S&P500", price: 4567.89, change: -23.45, changePercent: -0.51 },
        { symbol: "EUR/USD", price: 1.0845, change: 0.0023, changePercent: 0.21 },
        { symbol: "BTC", price: 43250.67, change: 1250.34, changePercent: 2.98 },
        { symbol: "10Y US", price: 4.25, change: -0.05, changePercent: -1.16 }
      ],
      alerts: [
        {
          type: "info" as const,
          message: "Le CAC40 affiche une légère hausse de +0.17% ce matin"
        },
        {
          type: "warning" as const,
          message: "Le S&P500 en baisse de -0.51%, volatilité accrue"
        },
        {
          type: "success" as const,
          message: "Bitcoin en forte hausse de +2.98%, momentum positif"
        }
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Erreur API macro:', error);
    return NextResponse.json(
      { error: 'Erreur de récupération des données' },
      { status: 500 }
    );
  }
}