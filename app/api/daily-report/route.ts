// ============================================================
// MENA Watch — التقرير الصباحي اليومي
// /api/daily-report.ts
// يشتغل كل يوم الساعة 6:00 صباحاً بتوقيت الرياض (03:00 UTC)
// عبر Vercel Cron Jobs
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { buildDailyReportEmail } from "@/lib/email-templates";
import { toWestern } from "@/lib/format";

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! }); }
function getResend() { return new Resend(process.env.RESEND_API_KEY!); }
function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// ── بيانات السوق اللحظية (استبدل بـ API حقيقي لاحقاً) ───
async function fetchMarketData() {
  // TODO: استبدل بـ Twelve Data API
  return {
    tasi:   { val: "12,847", chg: "+0.42%", up: true  },
    brent:  { val: "82.14",  chg: "-0.8%",  up: false },
    gold:   { val: "2,318",  chg: "+0.3%",  up: true  },
    usdsar: { val: "3.751",  chg: "ثابت",   up: null  },
  };
}

// ── مؤشرات DEFCON الحالية ─────────────────────────────────
async function fetchDefconData() {
  // TODO: اربط بـ GDELT API أو مصدر حقيقي
  return [
    { region: "اليمن",    level: 2, trend: "مستقر"   },
    { region: "السودان",  level: 3, trend: "تصاعد"   },
    { region: "إيران",    level: 3, trend: "مستقر"   },
    { region: "السعودية", level: 5, trend: "مستقر"   },
    { region: "الإمارات", level: 5, trend: "مستقر"   },
  ];
}

// ── توليد التقرير بـ Claude ───────────────────────────────
async function generateReport(market: any, defcon: any[]) {
  const today = toWestern(new Date().toLocaleDateString("ar-EG", {
    timeZone: "Asia/Riyadh",
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }));

  const prompt = `
أنت محلل استراتيجي رفيع في منصة MENA Watch. اكتب التقرير الصباحي اليومي ليوم ${today}.

بيانات السوق:
- تاسي: ${market.tasi.val} (${market.tasi.chg})
- برنت: ${market.brent.val}$/برميل (${market.brent.chg})
- ذهب: ${market.gold.val}$/أوقية (${market.gold.chg})
- USD/SAR: ${market.usdsar.val}

مؤشرات DEFCON:
${defcon.map(d => `- ${d.region}: D${d.level} (${d.trend})`).join("\n")}

اكتب تقريراً صباحياً احترافياً يتضمن:
1. **ملخص تنفيذي** (3 جمل — أهم ما يجب معرفته اليوم)
2. **المشهد الأمني** (فقرة واحدة — أبرز التطورات الأمنية)
3. **النبض الاقتصادي** (فقرة واحدة — أسواق + طاقة + فرص)
4. **نقطة الاهتمام** (فقرة — حدث واحد يستحق المتابعة اليوم)
5. **توقعات اليوم** (3 نقاط موجزة)

الأسلوب: احترافي، موجز، عربي فصيح، مناسب للمديرين التنفيذيين.
`;

  const response = await getAnthropic().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

// ── جلب المشتركين من Supabase ─────────────────────────────
async function getSubscribers() {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("email, full_name")
    .eq("is_active", true)
    .not("email", "is", null);

  if (error) throw error;
  return data || [];
}

// ── Handler الرئيسي ───────────────────────────────────────
export async function GET(req: NextRequest) {
  // التحقق من Cron secret لمنع الاستدعاء غير المصرح
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("🌅 بدء إرسال التقرير الصباحي...");

    // ١. جلب البيانات
    const [market, defcon] = await Promise.all([
      fetchMarketData(),
      fetchDefconData(),
    ]);

    // ٢. توليد التقرير بـ Claude
    const reportContent = await generateReport(market, defcon);
    console.log("✅ تم توليد التقرير");

    // ٣. جلب المشتركين
    const subscribers = await getSubscribers();
    console.log(`📧 إرسال لـ ${subscribers.length} مشترك`);

    // ٤. بناء قالب الإيميل
    const today = toWestern(new Date().toLocaleDateString("ar-EG", {
      timeZone: "Asia/Riyadh",
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    }));

    const emailHtml = buildDailyReportEmail({
      date: today,
      content: reportContent,
      market,
      defcon,
    });

    // ٥. إرسال الإيميلات (batch لتفادي rate limits)
    const results = [];
    for (const sub of subscribers) {
      try {
        const result = await getResend().emails.send({
          from: "MENA Watch <morning@mena.watch>",
          to: sub.email,
          subject: `📊 تقرير MENA Watch الصباحي — ${today}`,
          html: emailHtml,
        });
        results.push({ email: sub.email, status: "sent", id: result.data?.id });
      } catch (err) {
        results.push({ email: sub.email, status: "failed", error: String(err) });
      }
      // تأخير 100ms بين كل إيميل
      await new Promise(r => setTimeout(r, 100));
    }

    // ٦. تسجيل في قاعدة البيانات
    await getSupabase().from("daily_reports").insert({
      date: new Date().toISOString().split("T")[0],
      content: reportContent,
      sent_to: subscribers.length,
      success_count: results.filter(r => r.status === "sent").length,
      market_snapshot: market,
    });

    return NextResponse.json({
      success: true,
      sent: results.filter(r => r.status === "sent").length,
      failed: results.filter(r => r.status === "failed").length,
      total: subscribers.length,
    });

  } catch (error) {
    console.error("❌ خطأ في التقرير الصباحي:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
