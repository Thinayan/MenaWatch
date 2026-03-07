import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getAdminSupabase() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return supabase;
}

export async function GET() {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { data, error } = await supabase
      .from("platform_config")
      .select("*")
      .eq("key", "pricing")
      .single();

    if (error) {
      // Return defaults if table doesn't exist yet
      return NextResponse.json({
        pricing: {
          free: { price: 0, ai_limit: 3, features: ["الخريطة الأساسية", "3 تحليلات AI/يوم"] },
          pro: { price: 49, ai_limit: -1, features: ["تحليلات غير محدودة", "غرفة عمليات", "تنبيهات فورية"] },
          enterprise: { price: 299, ai_limit: -1, features: ["API بيانات", "5 مستخدمين", "دعم 24/7"] },
        },
        source: "default",
      });
    }

    return NextResponse.json({ pricing: data.value, source: "live" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { pricing } = await req.json();
    if (!pricing) return NextResponse.json({ error: "Missing pricing data" }, { status: 400 });

    const { error } = await supabase
      .from("platform_config")
      .upsert({ key: "pricing", value: pricing, updated_at: new Date().toISOString() });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
