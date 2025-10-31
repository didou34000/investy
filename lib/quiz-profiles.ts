export type InvestmentProfile = {
  id: string;
  name: string;
  description: string;
  riskLevel: number; // 1-10
  expectedReturn: number; // Annualized
  volatility: number; // Annualized volatility
  timeHorizon: string;
  allocation: Record<string, number>;
  characteristics: string[];
  suitableFor: string[];
  warnings: string[];
  color: string;
  icon: string;
};

export const INVESTMENT_PROFILES: InvestmentProfile[] = [
  {
    id: "ultra_conservateur",
    name: "Ultra Conservateur",
    description: "Sécurité maximale, capital préservé avant tout",
    riskLevel: 1,
    expectedReturn: 0.015,
    volatility: 0.02,
    timeHorizon: "Court terme (1-3 ans)",
    allocation: {
      "Liquidités": 60,
      "Obligations court terme": 30,
      "Or": 10
    },
    characteristics: [
      "Préserve le capital",
      "Faible volatilité",
      "Liquidité élevée",
      "Rendement modeste mais sûr"
    ],
    suitableFor: [
      "Épargne de précaution",
      "Objectifs à court terme",
      "Personnes très averses au risque",
      "Fonds d'urgence"
    ],
    warnings: [
      "Rendement peut être inférieur à l'inflation",
      "Opportunités de croissance limitées"
    ],
    color: "#6B7280",
    icon: "🛡️"
  },
  {
    id: "conservateur",
    name: "Conservateur",
    description: "Sécurité avant tout avec un peu de croissance",
    riskLevel: 2,
    expectedReturn: 0.025,
    volatility: 0.04,
    timeHorizon: "Court à moyen terme (2-5 ans)",
    allocation: {
      "Obligations": 70,
      "Actions défensives": 20,
      "Liquidités": 10
    },
    characteristics: [
      "Stabilité du capital",
      "Revenus réguliers",
      "Faible exposition aux actions",
      "Protection contre l'inflation"
    ],
    suitableFor: [
      "Retraite proche",
      "Épargne logement",
      "Investisseurs débutants",
      "Personnes proches de la retraite"
    ],
    warnings: [
      "Croissance limitée",
      "Sensible aux taux d'intérêt"
    ],
    color: "#3B82F6",
    icon: "🏛️"
  },
  {
    id: "prudent",
    name: "Prudent",
    description: "Équilibre sécurité-croissance avec dominante défensive",
    riskLevel: 3,
    expectedReturn: 0.035,
    volatility: 0.06,
    timeHorizon: "Moyen terme (3-7 ans)",
    allocation: {
      "Obligations": 50,
      "Actions monde": 40,
      "Immobilier": 10
    },
    characteristics: [
      "Équilibre risque/rendement",
      "Diversification modérée",
      "Stabilité relative",
      "Croissance progressive"
    ],
    suitableFor: [
      "Épargne retraite",
      "Objectifs à moyen terme",
      "Investisseurs modérés",
      "Familles avec enfants"
    ],
    warnings: [
      "Volatilité occasionnelle",
      "Nécessite patience"
    ],
    color: "#10B981",
    icon: "🌱"
  },
  {
    id: "equilibre",
    name: "Équilibré",
    description: "Balance parfaite entre rendement et risque",
    riskLevel: 5,
    expectedReturn: 0.045,
    volatility: 0.10,
    timeHorizon: "Moyen à long terme (5-10 ans)",
    allocation: {
      "Actions monde": 50,
      "Obligations": 30,
      "Immobilier": 15,
      "Liquidités": 5
    },
    characteristics: [
      "Diversification optimale",
      "Équilibre actions/obligations",
      "Croissance régulière",
      "Gestion du risque"
    ],
    suitableFor: [
      "Épargne long terme",
      "Préparation retraite",
      "Investisseurs expérimentés",
      "Objectifs financiers variés"
    ],
    warnings: [
      "Volatilité modérée",
      "Nécessite discipline"
    ],
    color: "#8B5CF6",
    icon: "⚖️"
  },
  {
    id: "dynamique",
    name: "Dynamique",
    description: "Recherche de performance avec protection partielle",
    riskLevel: 7,
    expectedReturn: 0.055,
    volatility: 0.15,
    timeHorizon: "Long terme (7-15 ans)",
    allocation: {
      "Actions monde": 60,
      "Actions émergentes": 20,
      "Obligations": 15,
      "Alternatives": 5
    },
    characteristics: [
      "Orientation croissance",
      "Exposition internationale",
      "Diversification avancée",
      "Potentiel de rendement élevé"
    ],
    suitableFor: [
      "Jeunes investisseurs",
      "Objectifs ambitieux",
      "Tolérance au risque élevée",
      "Horizon long terme"
    ],
    warnings: [
      "Volatilité importante",
      "Nécessite patience et discipline"
    ],
    color: "#F59E0B",
    icon: "🚀"
  },
  {
    id: "agressif",
    name: "Agressif",
    description: "Maximisation du rendement avec forte exposition actions",
    riskLevel: 8,
    expectedReturn: 0.065,
    volatility: 0.20,
    timeHorizon: "Long terme (10+ ans)",
    allocation: {
      "Actions monde": 70,
      "Actions émergentes": 20,
      "Crypto": 5,
      "Alternatives": 5
    },
    characteristics: [
      "Maximisation croissance",
      "Exposition actions élevée",
      "Innovation technologique",
      "Potentiel de rendement très élevé"
    ],
    suitableFor: [
      "Investisseurs expérimentés",
      "Objectifs très ambitieux",
      "Tolérance au risque très élevée",
      "Horizon très long terme"
    ],
    warnings: [
      "Volatilité très importante",
      "Risque de perte significative",
      "Nécessite expertise"
    ],
    color: "#EF4444",
    icon: "⚡"
  },
  {
    id: "entrepreneur",
    name: "Entrepreneur",
    description: "Stratégie alternative avec private equity et actifs non cotés",
    riskLevel: 9,
    expectedReturn: 0.075,
    volatility: 0.25,
    timeHorizon: "Très long terme (15+ ans)",
    allocation: {
      "Actions monde": 50,
      "Actions émergentes": 25,
      "Crypto": 15,
      "Capital-risque": 10
    },
    characteristics: [
      "Stratégie alternative",
      "Innovation et disruption",
      "Exposition non cotée",
      "Potentiel de rendement exceptionnel"
    ],
    suitableFor: [
      "Professionnels de la finance",
      "Objectifs exceptionnels",
      "Tolérance au risque maximale",
      "Expertise avancée"
    ],
    warnings: [
      "Volatilité extrême",
      "Risque de perte totale",
      "Nécessite expertise très avancée",
      "Liquidité limitée"
    ],
    color: "#8B5CF6",
    icon: "💎"
  }
];

export function getProfileByScore(score: number): InvestmentProfile {
  if (score <= 10) return INVESTMENT_PROFILES[0]; // Ultra Conservateur
  if (score <= 20) return INVESTMENT_PROFILES[1]; // Conservateur
  if (score <= 30) return INVESTMENT_PROFILES[2]; // Prudent
  if (score <= 45) return INVESTMENT_PROFILES[3]; // Équilibré
  if (score <= 60) return INVESTMENT_PROFILES[4]; // Dynamique
  if (score <= 75) return INVESTMENT_PROFILES[5]; // Agressif
  return INVESTMENT_PROFILES[6]; // Entrepreneur
}

export function getAllProfiles(): InvestmentProfile[] {
  return INVESTMENT_PROFILES;
}
