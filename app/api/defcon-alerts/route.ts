import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ alerts: [], source: "no-config" });
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    });

    const { data, error } = await supabase
      .from("defcon_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("defcon-alerts error:", error);
      return NextResponse.json({ alerts: [], source: "error" });
    }

    return NextResponse.json({ alerts: data || [], source: "live" });
  } catch (err) {
    console.error("defcon-alerts catch:", err);
    return NextResponse.json({ alerts: [], source: "error" });
  }
}
