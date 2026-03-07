// ============================================================
// MENA Watch — تنبيهات DEFCON الفورية
// /api/defcon-alert.ts
// يُستدعى عند رصد تغيير في مستوى DEFCON لأي منطقة
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { buildDefconAlertEmail } from "@/lib/email-templates";

function getResend() { return new Resend(process.env.RESEND_API_KEY!); }
function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const DEFCON_LABELS: Record<number, string> = {
  1: "حرجي — خطر وشيك",
  2: "عالي — توتر مرتفع",
  3: "متصاعد — مراقبة مكثفة",
  4: "معتدل — وضع طبيعي",
  5: "مستقر — هادئ",
};

const DEFCON_COLORS: Record<number, string> = {
  1: "#7f1d1d",
  2: "#991b1b",
  3: "#92400e",
  4: "#1e3a5f",
  5: "#064e3b",
};

export async function POST(req: NextRequest) {
  // التحقق من المصدر
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const resend = getResend();
    const body = await req.json();
    const { region, previousLevel, newLevel, reason, source } = body;

    // التحقق من صحة البيانات
    if (!region || !previousLevel || !newLevel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isEscalation = newLevel < previousLevel; // D2 أخطر من D4

    // ١. جلب المشتركين المهتمين بهذه المنطقة
    const { data: subscribers } = await supabase
      .from("profiles")
      .select("email, full_name, alert_regions")
      .eq("is_active", true)
      .not("email", "is", null);

    const relevantSubscribers = (subscribers || []).filter(s => {
      if (!s.alert_regions || s.alert_regions.length === 0) return true; // كل المناطق
      return s.alert_regions.includes(region);
    });

    console.log(`⚠️ تنبيه DEFCON: ${region} D${previousLevel}→D${newLevel} | ${relevantSubscribers.length} مشترك`);

    // ٢. بناء الإيميل
    const emailHtml = buildDefconAlertEmail({
      region,
      previousLevel,
      newLevel,
      isEscalation,
      label: DEFCON_LABELS[newLevel],
      color: DEFCON_COLORS[newLevel],
      reason: reason || "تطورات ميدانية جديدة",
      source: source || "MENA Watch Monitoring",
      timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" }),
    });

    // ٣. إرسال التنبيهات
    const results = [];
    for (const sub of relevantSubscribers) {
      const urgencyPrefix = isEscalation ? "🚨 تصاعد" : "✅ تحسن";
      try {
        await resend.emails.send({
          from: "MENA Watch Alerts <alerts@mena.watch>",
          to: sub.email,
          subject: `${urgencyPrefix} DEFCON — ${region}: D${previousLevel} → D${newLevel}`,
          html: emailHtml,
        });
        results.push({ email: sub.email, status: "sent" });
      } catch (err) {
        results.push({ email: sub.email, status: "failed" });
      }
    }

    // ٤. تسجيل التنبيه في قاعدة البيانات
    await supabase.from("defcon_alerts").insert({
      region,
      previous_level: previousLevel,
      new_level: newLevel,
      is_escalation: isEscalation,
      reason,
      source,
      sent_to: results.filter(r => r.status === "sent").length,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      region,
      change: `D${previousLevel} → D${newLevel}`,
      isEscalation,
      sent: results.filter(r => r.status === "sent").length,
    });

  } catch (error) {
    console.error("❌ خطأ في تنبيه DEFCON:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
