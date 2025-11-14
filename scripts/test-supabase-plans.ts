/**
 * Script de test pour vérifier la connexion Supabase et les tables plans/subscriptions
 * Usage: npx tsx scripts/test-supabase-plans.ts
 */

import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error("❌ Variables d'environnement manquantes:");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", URL ? "✅" : "❌");
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", KEY ? "✅" : "❌");
  process.exit(1);
}

const supabase = createClient(URL, KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function testConnection() {
  console.log("\n🔍 Test de connexion à Supabase...\n");

  try {
    // Test 1: Lire les plans
    console.log("1️⃣ Test: Lecture des plans");
    const { data: plans, error: plansError } = await supabase
      .from("plans")
      .select("*")
      .order("price_cents", { ascending: true });

    if (plansError) {
      console.error("   ❌ Erreur:", plansError.message);
    } else {
      console.log(`   ✅ ${plans?.length || 0} plan(s) trouvé(s):`);
      plans?.forEach((p) => {
        console.log(`      - ${p.code} (${p.name}): ${p.price_cents / 100}€, ${p.max_assets} actifs max`);
      });
    }

    // Test 2: Compter les user_plans
    console.log("\n2️⃣ Test: Compter les abonnements utilisateurs");
    const { count, error: countError } = await supabase
      .from("user_plans")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("   ❌ Erreur:", countError.message);
    } else {
      console.log(`   ✅ ${count || 0} abonnement(s) utilisateur trouvé(s)`);
    }

    // Test 3: Vérifier les subscriptions
    console.log("\n3️⃣ Test: Vérifier les subscriptions");
    const { data: subs, error: subsError } = await supabase
      .from("subscriptions")
      .select("id, user_id, symbol, frequency, enabled")
      .limit(5);

    if (subsError) {
      console.error("   ❌ Erreur:", subsError.message);
    } else {
      console.log(`   ✅ ${subs?.length || 0} subscription(s) trouvée(s)`);
      subs?.forEach((s) => {
        console.log(`      - ${s.symbol} (${s.frequency}, enabled: ${s.enabled})`);
      });
    }

    // Test 4: Vérifier les deliveries
    console.log("\n4️⃣ Test: Vérifier les deliveries");
    const { count: delCount, error: delError } = await supabase
      .from("deliveries")
      .select("*", { count: "exact", head: true });

    if (delError) {
      console.error("   ❌ Erreur:", delError.message);
    } else {
      console.log(`   ✅ ${delCount || 0} delivery(s) trouvée(s)`);
    }

    // Test 5: Tester la fonction getUserPlan (si on a un user_id de test)
    console.log("\n5️⃣ Test: Fonction getUserPlan");
    const { data: testUser } = await supabase.auth.admin.listUsers({ limit: 1 });
    if (testUser?.users && testUser.users.length > 0) {
      const userId = testUser.users[0].id;
      console.log(`   Test avec user_id: ${userId.substring(0, 8)}...`);
      
      const { data: userPlan, error: userPlanError } = await supabase
        .from("user_plans")
        .select("plan_code, plans!inner(max_assets, max_runs_per_day)")
        .eq("user_id", userId)
        .maybeSingle();

      if (userPlanError) {
        console.error("   ❌ Erreur:", userPlanError.message);
      } else {
        const plan = Array.isArray(userPlan?.plans) ? userPlan.plans[0] : userPlan?.plans;
        console.log(`   ✅ Plan trouvé: ${userPlan?.plan_code || "free"} (${plan?.max_assets || 1} actifs max)`);
      }
    } else {
      console.log("   ⚠️  Aucun utilisateur trouvé pour le test");
    }

    console.log("\n✅ Tests terminés!\n");
  } catch (error: any) {
    console.error("\n❌ Erreur générale:", error.message);
    console.error(error);
    process.exit(1);
  }
}

testConnection();

