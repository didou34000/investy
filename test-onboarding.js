// Script de test pour simuler un quiz complet et tester le flux d'onboarding
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
  console.log('🎯 Testez maintenant:');
  console.log('1. Allez sur http://localhost:3005/result');
  console.log('2. Vérifiez que le panneau d\'onboarding s\'affiche');
  console.log('3. Testez l\'authentification par email');
  console.log('4. Testez la sauvegarde du profil');
} else {
  console.log('⚠️ Ce script doit être exécuté dans le navigateur');
  console.log('📋 Instructions manuelles:');
  console.log('1. Ouvrez http://localhost:3005/quiz');
  console.log('2. Complétez le quiz avec des réponses variées');
  console.log('3. Allez sur /result et vérifiez le panneau d\'onboarding');
  console.log('4. Testez l\'authentification et la sauvegarde');
}
