// Script de test pour l'endpoint /api/ingest
const testIngest = async () => {
  try {
    console.log('🧪 Test de l\'endpoint /api/ingest...');
    
    const response = await fetch('http://localhost:3005/api/ingest');
    const data = await response.json();
    
    console.log('📊 Résultat:', data);
    
    if (data.success) {
      console.log('✅ Test réussi !');
    } else {
      console.log('❌ Test échoué:', data.error);
    }
  } catch (error) {
    console.error('❌ Erreur de test:', error);
  }
};

testIngest();
