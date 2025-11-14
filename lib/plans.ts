import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export type Plan = { 
  code: string; 
  max_assets: number; 
  max_runs_per_day: number;
};

export async function getUserPlan(userId: string): Promise<Plan> {
  const sb = createClient(URL, KEY);
  
  const { data, error } = await sb
    .from("user_plans")
    .select("plan_code, plans!inner(max_assets, max_runs_per_day)")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  // Handle both array and object response formats from Supabase
  const p = Array.isArray(data?.plans) ? data.plans[0] : data?.plans;
  
  return {
    code: data?.plan_code ?? "free",
    max_assets: p?.max_assets ?? 1,
    max_runs_per_day: p?.max_runs_per_day ?? 1,
  };
}

export async function countUserActiveSubs(userId: string): Promise<number> {
  const sb = createClient(URL, KEY);
  
  const { count } = await sb
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("enabled", true);

  return count ?? 0;
}

