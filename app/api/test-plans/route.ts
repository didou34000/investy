import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserPlan, countUserActiveSubs } from "@/lib/plans";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  if (!URL || !KEY) {
    return NextResponse.json(
      {
        error: "Variables d'environnement manquantes",
        hasUrl: !!URL,
        hasKey: !!KEY,
      },
      { status: 500 }
    );
  }

  const supabase = createClient(URL, KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  try {
    // Test 1: Lire les plans
    const { data: plans, error: plansError } = await supabase
      .from("plans")
      .select("*")
      .order("price_cents", { ascending: true });

    results.tests.plans = {
      success: !plansError,
      error: plansError?.message,
      count: plans?.length || 0,
      data: plans,
    };

    // Test 2: Compter les user_plans
    const { count: userPlansCount, error: userPlansError } = await supabase
      .from("user_plans")
      .select("*", { count: "exact", head: true });

    results.tests.userPlans = {
      success: !userPlansError,
      error: userPlansError?.message,
      count: userPlansCount || 0,
    };

    // Test 3: Vérifier les subscriptions
    const { data: subs, error: subsError } = await supabase
      .from("subscriptions")
      .select("id, user_id, symbol, frequency, enabled")
      .limit(5);

    results.tests.subscriptions = {
      success: !subsError,
      error: subsError?.message,
      count: subs?.length || 0,
      data: subs,
    };

    // Test 4: Vérifier les deliveries
    const { count: delCount, error: delError } = await supabase
      .from("deliveries")
      .select("*", { count: "exact", head: true });

    results.tests.deliveries = {
      success: !delError,
      error: delError?.message,
      count: delCount || 0,
    };

    // Test 5: Tester getUserPlan avec un utilisateur réel si disponible
    const { data: users } = await supabase.auth.admin.listUsers({ limit: 1 });
    if (users?.users && users.users.length > 0) {
      const userId = users.users[0].id;
      try {
        const plan = await getUserPlan(userId);
        const activeSubs = await countUserActiveSubs(userId);
        results.tests.functions = {
          success: true,
          userId: userId.substring(0, 8) + "...",
          plan,
          activeSubs,
        };
      } catch (funcError: any) {
        results.tests.functions = {
          success: false,
          error: funcError?.message,
        };
      }
    } else {
      results.tests.functions = {
        success: null,
        message: "Aucun utilisateur trouvé pour tester les fonctions",
      };
    }

    const allSuccess = Object.values(results.tests).every(
      (t: any) => t.success !== false
    );

    return NextResponse.json(
      {
        ...results,
        overall: allSuccess ? "✅ Tous les tests passent" : "⚠️ Certains tests ont échoué",
      },
      { status: allSuccess ? 200 : 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
        ...results,
      },
      { status: 500 }
    );
  }
}

