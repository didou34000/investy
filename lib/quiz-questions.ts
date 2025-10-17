export type QuizQuestion = {
  id: string;
  question: string;
  description?: string;
  options: {
    text: string;
    value: number;
    explanation?: string;
  }[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "riskTolerance",
    question: "Comment réagissez-vous aux fluctuations importantes du marché ?",
    description: "Votre confort face à la volatilité est clé pour définir votre profil.",
    options: [
      { 
        text: "Je panique et vends tout", 
        value: 1, 
        explanation: "Une aversion très forte au risque." 
      },
      { 
        text: "Je suis inquiet mais j'attends", 
        value: 2, 
        explanation: "Une tolérance faible à modérée." 
      },
      { 
        text: "Je vois les baisses comme des opportunités d'achat", 
        value: 3, 
        explanation: "Une forte tolérance au risque." 
      },
      { 
        text: "Je ne regarde pas mes investissements souvent", 
        value: 4, 
        explanation: "Une approche sereine face aux marchés." 
      },
    ],
  },
  {
    id: "investmentHorizon",
    question: "Quel est votre horizon de placement principal ?",
    description: "La durée de votre investissement influence les types d'actifs adaptés.",
    options: [
      { 
        text: "Moins de 3 ans (court terme)", 
        value: 1, 
        explanation: "Privilégie la liquidité et la sécurité." 
      },
      { 
        text: "3 à 7 ans (moyen terme)", 
        value: 2, 
        explanation: "Permet une exposition modérée au risque." 
      },
      { 
        text: "7 à 15 ans (long terme)", 
        value: 3, 
        explanation: "Idéal pour la croissance et la diversification." 
      },
      { 
        text: "Plus de 15 ans (très long terme)", 
        value: 4, 
        explanation: "Maximise le potentiel de rendement des actifs risqués." 
      },
    ],
  },
  {
    id: "financialSituation",
    question: "Quelle proportion de votre épargne êtes-vous prêt à investir dans des actifs potentiellement volatils ?",
    description: "Votre capacité à investir sans compromettre votre sécurité financière.",
    options: [
      { 
        text: "Moins de 10%", 
        value: 1, 
        explanation: "Une approche très prudente." 
      },
      { 
        text: "10% à 30%", 
        value: 2, 
        explanation: "Une part mesurée de votre capital." 
      },
      { 
        text: "30% à 60%", 
        value: 3, 
        explanation: "Une allocation significative pour la croissance." 
      },
      { 
        text: "Plus de 60%", 
        value: 4, 
        explanation: "Une stratégie agressive pour maximiser les gains." 
      },
    ],
  },
  {
    id: "investmentExperience",
    question: "Quelle est votre expérience en matière d'investissement ?",
    description: "Votre connaissance des marchés financiers et des produits d'investissement.",
    options: [
      { 
        text: "Débutant, je n'ai jamais investi", 
        value: 1, 
        explanation: "Nécessite une approche éducative et sécurisée." 
      },
      { 
        text: "J'ai quelques notions, j'ai déjà investi un peu", 
        value: 2, 
        explanation: "Prêt à explorer des options plus variées." 
      },
      { 
        text: "Je suis informé et j'ai une bonne expérience", 
        value: 3, 
        explanation: "Capable de gérer des portefeuilles plus complexes." 
      },
      { 
        text: "Expert, je gère activement mes investissements", 
        value: 4, 
        explanation: "Recherche des opportunités avancées et des stratégies sophistiquées." 
      },
    ],
  },
  {
    id: "lossReaction",
    question: "Si votre portefeuille perdait 20% de sa valeur en un mois, que feriez-vous ?",
    description: "Votre réaction émotionnelle face à une perte est un indicateur clé de votre profil de risque.",
    options: [
      { 
        text: "Je vendrais tout pour limiter les pertes", 
        value: 1, 
        explanation: "Réaction de panique, forte aversion à la perte." 
      },
      { 
        text: "J'attendrais que ça remonte, sans agir", 
        value: 2, 
        explanation: "Passivité, espoir d'un rebond naturel." 
      },
      { 
        text: "J'analyserais la situation et envisagerais d'acheter plus", 
        value: 3, 
        explanation: "Approche rationnelle, voit les opportunités." 
      },
      { 
        text: "J'achèterais plus, c'est le moment des bonnes affaires", 
        value: 4, 
        explanation: "Confiance dans le marché, stratégie contrarienne." 
      },
    ],
  },
  {
    id: "investmentGoals",
    question: "Quel est votre objectif principal en investissant ?",
    description: "Vos objectifs définissent la stratégie d'investissement la plus appropriée.",
    options: [
      { 
        text: "Préserver mon capital et générer un petit revenu", 
        value: 1, 
        explanation: "Objectif de sécurité et de revenu stable." 
      },
      { 
        text: "Faire fructifier mon épargne à moyen terme", 
        value: 2, 
        explanation: "Objectif de croissance modérée." 
      },
      { 
        text: "Maximiser la croissance de mon capital sur le long terme", 
        value: 3, 
        explanation: "Objectif de performance élevée." 
      },
      { 
        text: "Atteindre l'indépendance financière rapidement", 
        value: 4, 
        explanation: "Objectif de croissance agressive et rapide." 
      },
    ],
  },
  {
    id: "assetPreference",
    question: "Parmi ces actifs, lesquels vous attirent le plus ?",
    description: "Vos préférences peuvent indiquer une affinité pour certains niveaux de risque.",
    options: [
      { 
        text: "Livrets d'épargne, fonds euros", 
        value: 1, 
        explanation: "Sécurité maximale, faible rendement." 
      },
      { 
        text: "Obligations, fonds obligataires", 
        value: 2, 
        explanation: "Revenu stable, risque modéré." 
      },
      { 
        text: "Actions de grandes entreprises, ETF diversifiés", 
        value: 3, 
        explanation: "Croissance, risque modéré à élevé." 
      },
      { 
        text: "Actions de petites capitalisations, cryptomonnaies, capital-risque", 
        value: 4, 
        explanation: "Fort potentiel de croissance, risque très élevé." 
      },
    ],
  },
];

export function calculateScore(answers: Record<string, number>): number {
  let score = 0;
  // Scoring avec pondération différente selon l'importance de chaque question
  score += answers.riskTolerance * 4;        // Très important
  score += answers.investmentHorizon * 3;    // Important
  score += answers.financialSituation * 3;   // Important
  score += answers.investmentExperience * 2; // Modérément important
  score += answers.lossReaction * 4;         // Très important
  score += answers.investmentGoals * 3;      // Important
  score += answers.assetPreference * 2;      // Modérément important

  // Score maximum possible: (4*4) + (4*3) + (4*3) + (4*2) + (4*4) + (4*3) + (4*2) = 16 + 12 + 12 + 8 + 16 + 12 + 8 = 84
  return Math.round(score);
}
