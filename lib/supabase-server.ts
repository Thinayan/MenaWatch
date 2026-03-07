import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client with service_role key.
 * Used ONLY in API routes / server functions for write operations
 * that need to bypass RLS (e.g., content-sync cron).
 *
 * NEVER expose this client to client-side code.
 */

let _serverClient: SupabaseClient | null = null;

export function getServerClient(): SupabaseClient {
  if (!_serverClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      console.warn("⚠️ Supabase server env vars not set — server features disabled");
      // Return a stub that won't crash but returns empty data
      return new Proxy({} as SupabaseClient, {
        get(_, prop) {
          if (prop === "from") {
            return (table: string) => ({
              select: (...args: any[]) => ({
                eq: (...a: any[]) => ({
                  single: async () => ({ data: null, error: null }),
                  order: (...o: any[]) => ({
                    limit: async () => ({ data: [], error: null }),
                    range: async () => ({ data: [], error: null, count: 0 }),
                  }),
                  limit: async () => ({ data: [], error: null }),
                  data: [],
                  error: null,
                }),
                order: (...o: any[]) => ({
                  limit: async () => ({ data: [], error: null }),
                  range: async () => ({ data: [], error: null, count: 0 }),
                }),
                textSearch: (...a: any[]) => ({ data: [], error: null }),
                data: [],
                error: null,
              }),
              insert: async () => ({ data: null, error: null }),
              upsert: async () => ({ data: null, error: null }),
              update: () => ({ eq: async () => ({ data: null, error: null }) }),
              delete: () => ({ eq: async () => ({ data: null, error: null }) }),
            });
          }
          if (prop === "rpc") {
            return async () => ({ data: null, error: null });
          }
          return undefined;
        },
      }) as unknown as SupabaseClient;
    }

    _serverClient = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _serverClient;
}

export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const c = getServerClient();
    const v = (c as any)[prop];
    return typeof v === "function" ? v.bind(c) : v;
  },
});
