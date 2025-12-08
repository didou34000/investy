import { createClient } from "@/lib/supabaseServer";

export async function POST() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
  });

  return Response.json({ ok: true });
}

