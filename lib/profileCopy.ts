export type ProfileCopy = {
  code: string;
  label: string;
  paragraph: string;
  bullets: string[];
};

export const profileCopies: Record<string, ProfileCopy> = {
  P0: {
    code: "P0",
    label: "Ultra prudent",
    paragraph: "Tu veux avant tout protéger ton capital. Tu privilégies la stabilité et les placements très sécurisés.",
    bullets: [
      "Objectif principal : préserver la valeur, éviter les à-coups.",
      "Portefeuille centré sur le cash et les obligations très qualitatives.",
      "Peu d’actions, peu ou pas d’alternatifs.",
      "Horizon généralement court à moyen terme."
    ]
  },
  P1: {
    code: "P1",
    label: "Prudent",
    paragraph: "Tu acceptes un peu de volatilité mais la sécurité reste prioritaire. Tu avances avec prudence.",
    bullets: [
      "Portefeuille majoritairement défensif : obligations + ETF larges.",
      "Une petite poche actions pour suivre la croissance globale.",
      "Volatilité modérée, drawdown limité.",
      "Horizon plutôt moyen terme."
    ]
  },
  P2: {
    code: "P2",
    label: "Modéré",
    paragraph: "Tu cherches une progression régulière avec un risque mesuré. Tu es à l’aise avec des baisses temporaires.",
    bullets: [
      "Base diversifiée en ETF monde + obligations.",
      "Une part actions plus visible mais toujours équilibrée.",
      "Tu acceptes des drawdowns modérés en échange de rendement.",
      "Horizon moyen à long terme."
    ]
  },
  P3: {
    code: "P3",
    label: "Équilibré",
    paragraph: "Tu vises un juste milieu : performance long terme et risque maîtrisé. Tu sais rester investi.",
    bullets: [
      "Cœur ETF monde + obligations, poche actions significative.",
      "Répartition flexible selon les cycles, sans excès.",
      "Volatilité modérée, drawdowns acceptés.",
      "Horizon long terme privilégié."
    ]
  },
  P4: {
    code: "P4",
    label: "Dynamique",
    paragraph: "Tu recherches une croissance plus marquée et acceptes la volatilité associée.",
    bullets: [
      "Actions et ETF croissance prennent plus de place.",
      "Obligations en soutien pour amortir les chocs.",
      "Tilts thématiques possibles, mais contrôlés.",
      "Horizon long terme recommandé."
    ]
  },
  P5: {
    code: "P5",
    label: "Agressif",
    paragraph: "Tu es prêt à tolérer des baisses importantes pour viser un rendement plus élevé.",
    bullets: [
      "Poids fort en actions, faibles obligations.",
      "Possibilité de thématiques et d’alternatifs.",
      "Volatilité élevée, drawdowns significatifs possibles.",
      "Horizon long terme quasi indispensable."
    ]
  },
  P6: {
    code: "P6",
    label: "Très offensif",
    paragraph: "Tu acceptes une forte volatilité et cherches des opportunités de croissance marquée.",
    bullets: [
      "Actions growth, thématiques, alternatifs plus présents.",
      "Faible amortisseur obligataire.",
      "Les phases de marché peuvent être très volatiles.",
      "Horizon long terme avec discipline."
    ]
  },
  P7: {
    code: "P7",
    label: "Spéculatif",
    paragraph: "Tu es prêt à une très forte volatilité pour chercher du potentiel. Attention au risque élevé.",
    bullets: [
      "Actions très growth / secteurs volatils, petite poche crypto possible.",
      "Diversification et gestion du risque essentielles.",
      "Acceptation de drawdowns importants.",
      "Horizon long terme, taille de position maîtrisée."
    ]
  },
};

export function getProfileCopy(code: string): ProfileCopy {
  return profileCopies[code] ?? profileCopies["P3"];
}

