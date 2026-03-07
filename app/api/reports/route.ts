import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ reports: [], source: "no-config" });
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    });

    const { data, error } = await supabase
      .from("daily_reports")
      .select("id, date, content, market_snapshot, created_at")
      .order("date", { ascending: false })
      .limit(10);

    if (error) {
      console.error("reports error:", error);
      return NextResponse.json({ reports: [], source: "error" });
    }

    return NextResponse.json({ reports: data || [], source: "live" });
  } catch (err) {
    console.error("reports catch:", err);
    return NextResponse.json({ reports: [], source: "error" });
  }
}
