/**
 * Traduction automatique EN -> FR via Google Translate (gratuit)
 * Fallback sur dictionnaire de base si l'API échoue
 */

export async function translateToFrench(text: string): Promise<string> {
  if (!text) return text;

  try {
    // Utiliser Google Translate API gratuite
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(text)}`);
    
    if (!response.ok) {
      return fallbackTranslate(text);
    }

    const data = await response.json();
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    
    return fallbackTranslate(text);
  } catch (error) {
    console.error('Translation error:', error);
    return fallbackTranslate(text);
  }
}

function fallbackTranslate(text: string): string {
  // Dictionnaire de termes financiers pour fallback
  const dict: Record<string, string> = {
    // Termes financiers
    'market': 'marché',
    'markets': 'marchés',
    'stock': 'action',
    'stocks': 'actions',
    'stock market': 'marché boursier',
    'stock exchange': 'bourse',
    'trading': 'négociation',
    'earnings': 'résultats',
    'earnings report': 'publication de résultats',
    'revenue': 'revenus',
    'profit': 'profit',
    'loss': 'perte',
    'gain': 'gain',
    'price': 'prix',
    'share': 'action',
    'shares': 'actions',
    'investor': 'investisseur',
    'investment': 'investissement',
    'company': 'entreprise',
    'companies': 'entreprises',
    'CEO': 'PDG',
    'board': 'conseil',
    'chair': 'président',
    'chairman': 'président',
    'chairwoman': 'présidente',

    // Crypto
    'crypto': 'crypto',
    'bitcoin': 'bitcoin',
    'ethereum': 'ethereum',
    'cryptocurrency': 'cryptomonnaie',

    // Économie
    'inflation': 'inflation',
    'rates': 'taux',
    'interest rate': 'taux d\'intérêt',
    'GDP': 'PIB',
    'unemployment': 'chômage',

    // Tech
    'AI': 'IA',
    'artificial intelligence': 'intelligence artificielle',
    'chip': 'puce',
    'semiconductor': 'semi-conducteur',
    'tech': 'tech',
    'technology': 'technologie',

    // Énergie
    'oil': 'pétrole',
    'gas': 'gaz',
    'energy': 'énergie',

    // Verbes courants
    'says': 'déclare',
    'say': 'dit',
    'risks': 'risque',
    'wants': 'souhaite',
    'want': 'souhaite',
    'prevents': 'prévient',
    'prevent': 'prévient',
    'approves': 'approuve',
    'approval': 'approbation',
    'eye': 'surveille',
    'breaks': 'franchit',
    'break': 'franchit',
    'breaking': 'franchissement de',
    'battles': 'combat',
    'back': 'retour',
    'trimming': 'réduit',
    'move': 'mouvement',
    'see': 'constate',
    'linked': 'lié',
    'sanctioned': 'sanctionné',

    // Mots courants
    'if': 'si',
    'that': 'que',
    'this': 'ce',
    'just': 'vient de',
    'huge': 'énorme',
    'pay': 'paiement',
    'package': 'paquet',
    'trillion': 'milliards',
    'jump': 'saut',
    'rebound': 'rebond',
    'flows': 'flux',
    'entities': 'entités',
    'frustrating': 'frustrant',
    'post': 'post',
    'help': 'aider',
    'hosts': 'hôtes',
    'halloween': 'halloween',
    'parties': 'fêtes',
    'U.S.': 'États-Unis',
    'Canada': 'Canada',
    'South Korean': 'Sud-coréen',
    'Cambodian': 'cambodgien',
    'we\'re': 'nous',
    'it': 'il',
    'the': 'le',
    'a': 'un',
    'an': 'un',
  };

  // Remplacer les termes du dictionnaire (priorité aux phrases complètes)
  const phrases = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
  
  for (const [en, fr] of phrases) {
    const regex = new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    translated = translated.replace(regex, fr);
  }

  // Capitaliser la première lettre
  if (translated.length > 0) {
    translated = translated.charAt(0).toUpperCase() + translated.slice(1);
  }

  return translated;
}

