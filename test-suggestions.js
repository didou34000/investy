// Script de test pour simuler un quiz complet et tester les suggestions
const testData = {
  riskIndex: 65,
  monthly: 500,
  answers: {
    drawdown_max: "20%",
    horizon_years: "7-15",
    wealth_share: "50%",
    pref_return: "8%",
    asset_interest: "Actions",
    monthly_investment: "1000",
    reaction_drop: "3",
    follow_intensity: "3",
    reinvest: "true"
  }
};

// Simuler le stockage en sessionStorage
if (typeof window !== 'undefined') {
  sessionStorage.setItem('investy_result', JSON.stringify(testData));
  console.log('✅ Données de test stockées en sessionStorage');
  console.log('📊 Profil simulé:', testData);
} else {
  console.log('⚠️ Ce script doit être exécuté dans le navigateur');
}
