import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getUserPlan } from "@/lib/plans";

export async function GET() {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await getUserPlan(session.user.id);
    
    // Mapper le plan pour inclure le nom
    const planNames: Record<string, string> = {
      free: "Gratuit",
      premium: "Premium",
      pro: "Pro",
    };

    return NextResponse.json({
      code: plan.code,
      name: planNames[plan.code] || plan.code,
      max_assets: plan.max_assets,
    });
  } catch (error: any) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

