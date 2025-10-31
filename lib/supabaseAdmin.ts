import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function initClient() {
  if (_client) return _client;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    console.warn("Supabase admin client: missing env vars");
    // Return a no-op client
    return {
      from: () => ({
        select: async () => ({ data: null, error: null }),
        insert: async () => ({ data: null, error: null }),
      }),
    } as any;
  }
  
  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  return _client;
}

// Lazy initialization - only creates client when actually used at runtime
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    const client = initClient();
    return client[prop as keyof typeof client];
  }
});


