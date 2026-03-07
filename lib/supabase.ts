import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — only initialized on first property access at runtime
// Uses createBrowserClient from @supabase/ssr to store auth tokens in cookies
// so the middleware can read them for server-side auth checks
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.warn("⚠️ Supabase env vars not set — auth features disabled");
      // Return a stub that won't crash but returns empty data
      return new Proxy({} as SupabaseClient, {
        get(_, prop) {
          if (prop === "auth") {
            return {
              getUser: async () => ({ data: { user: null }, error: null }),
              signOut: async () => ({ error: null }),
              signInWithPassword: async () => ({ data: null, error: { message: "Supabase not configured" } }),
              signUp: async () => ({ data: null, error: { message: "Supabase not configured" } }),
              signInWithOAuth: async () => ({ data: null, error: { message: "Supabase not configured" } }),
              onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            };
          }
          if (prop === "from") {
            return () => ({
              select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), data: [], error: null }), data: [], error: null }),
              insert: async () => ({ data: null, error: null }),
              update: () => ({ eq: async () => ({ data: null, error: null }) }),
              delete: () => ({ eq: async () => ({ data: null, error: null }) }),
            });
          }
          return undefined;
        },
      }) as unknown as SupabaseClient;
    }
    _client = createBrowserClient(url, key) as unknown as SupabaseClient;
  }
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const c = getClient();
    const v = (c as any)[prop];
    return typeof v === "function" ? v.bind(c) : v;
  },
});

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}
