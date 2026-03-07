import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    });

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

    // Parallel queries
    const [subscribers, profiles, reports, alerts, emailLogs] = await Promise.all([
      supabase.from("subscribers").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("daily_reports").select("*", { count: "exact", head: true }),
      supabase.from("defcon_alerts").select("*", { count: "exact", head: true }),
      supabase.from("email_logs").select("*", { count: "exact", head: true }),
    ]);

    // AI usage
    const { data: aiData } = await supabase.from("profiles").select("ai_uses_today");
    const totalAiToday = aiData?.reduce((sum: number, p: any) => sum + (p.ai_uses_today || 0), 0) || 0;

    return NextResponse.json({
      subscribers: subscribers.count || 0,
      users: profiles.count || 0,
      reports: reports.count || 0,
      alerts: alerts.count || 0,
      emailsSent: emailLogs.count || 0,
      aiUsesToday: totalAiToday,
    });
  } catch (err) {
    console.error("analytics error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
