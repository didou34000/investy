/**
 * Script de vérification pour diagnostiquer les problèmes Vercel vs Localhost
 * Usage: node scripts/check-vercel-setup.js
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

const optionalEnvVars = [
  'RESEND_API_KEY',
  'NEXT_PUBLIC_BASE_URL',
  'OPENAI_API_KEY',
];

console.log('🔍 Vérification de la configuration Vercel\n');

console.log('📋 Variables d\'environnement requises:');
let missing = [];
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ❌ ${varName}: MANQUANT`);
    missing.push(varName);
  }
});

console.log('\n📋 Variables optionnelles:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: configurée`);
  } else {
    console.log(`  ⚠️  ${varName}: non configurée (optionnel)`);
  }
});

if (missing.length > 0) {
  console.log('\n❌ ERREUR: Variables manquantes!');
  console.log('\n📝 Action requise:');
  console.log('1. Aller sur https://vercel.com/dashboard');
  console.log('2. Sélectionner ton projet');
  console.log('3. Settings → Environment Variables');
  console.log('4. Ajouter les variables manquantes:');
  missing.forEach(v => console.log(`   - ${v}`));
  console.log('5. Redéployer');
  process.exit(1);
}

console.log('\n✅ Toutes les variables requises sont présentes!');
console.log('\n📝 Prochaines étapes:');
console.log('1. Vérifier que les migrations SQL sont exécutées sur Supabase PROD');
console.log('2. Tester: https://ton-domaine.vercel.app/api/test-plans');
console.log('3. Vérifier les logs Vercel si des erreurs persistent');

