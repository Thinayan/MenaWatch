// ============================================================
// MENA Watch — API تسجيل المشتركين
// /api/subscribe.ts
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

export async function POST(req: NextRequest) {
  try {
    const { email, fullName, source } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "بريد إلكتروني غير صالح" }, { status: 400 });
    }

    const supabase = getSupabase();
    const resend = getResend();

    // ١. التحقق من وجود المستخدم مسبقاً
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, is_active")
      .eq("email", email)
      .single();

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json({
          success: false,
          message: "أنت مشترك بالفعل!"
        });
      }
      // إعادة تفعيل
      await supabase
        .from("subscribers")
        .update({ is_active: true, resubscribed_at: new Date().toISOString() })
        .eq("email", email);
    } else {
      // ٢. إضافة مشترك جديد
      await supabase.from("subscribers").insert({
        email,
        full_name: fullName || email.split("@")[0],
        source: source || "website",
        is_active: true,
        subscribed_at: new Date().toISOString(),
      });
    }

    // ٣. إرسال إيميل ترحيب
    await resend.emails.send({
      from: "MENA Watch <welcome@mena.watch>",
      to: email,
      subject: "🌍 أهلاً بك في MENA Watch — تم تفعيل اشتراكك",
      html: buildWelcomeEmail(fullName || email.split("@")[0]),
    });

    return NextResponse.json({
      success: true,
      message: "تم التسجيل بنجاح! ستصلك رسالة ترحيب على بريدك.",
    });

  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "حدث خطأ، يرجى المحاولة لاحقاً" }, { status: 500 });
  }
}

function buildWelcomeEmail(name: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#060d18;font-family:'Segoe UI',Tahoma,Arial,sans-serif;direction:rtl;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://mena.watch/logo-md.png" alt="MENA.Watch — مراقب الشرق الأوسط" style="height:70px;width:auto;" />
    </div>

    <!-- Welcome card -->
    <div style="background:#0a1628;border:1px solid #22c55e33;border-radius:12px;padding:28px;margin-bottom:24px;">
      <div style="font-size:22px;font-weight:700;color:#f8fafc;margin-bottom:8px;">أهلاً ${name}! 👋</div>
      <div style="font-size:14px;color:#94a3b8;line-height:1.8;margin-bottom:16px;">
        تم تفعيل اشتراكك في MENA Watch — منصة الذكاء الإقليمي اليومية الأولى باللغة العربية.
      </div>
      <div style="font-size:13px;color:#22c55e;font-weight:600;">ستصلك كل صباح الساعة 6:00 بتوقيت الرياض:</div>
    </div>

    <!-- What you'll receive -->
    <div style="display:grid;gap:10px;margin-bottom:24px;">
      ${[
        { icon: "📊", title: "التقرير الصباحي", desc: "ملخص تنفيذي يومي بتحليل Claude AI" },
        { icon: "🚨", title: "تنبيهات DEFCON", desc: "إشعار فوري عند تصاعد التوترات الإقليمية" },
        { icon: "💹", title: "نبض الأسواق", desc: "تاسي + برنت + الذهب + العملات" },
        { icon: "🌍", title: "رصد لحظي", desc: "الخريطة الذكية + غرفة العمليات" },
      ].map(i => `
        <div style="background:#0f1f3d;border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:12px;">
          <span style="font-size:20px;">${i.icon}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:#e2e8f0;">${i.title}</div>
            <div style="font-size:11px;color:#64748b;">${i.desc}</div>
          </div>
        </div>
      `).join("")}
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://mena.watch" style="display:inline-block;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:700;">
        افتح المنصة الآن →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;font-size:10px;color:#334155;border-top:1px solid #1e293b;padding-top:16px;">
      <img src="https://mena.watch/logo-sm.png" alt="MENA.Watch" style="height:20px;width:auto;margin-bottom:4px;" /><br>
      مراقب الشرق الأوسط<br>
      <a href="https://mena.watch/unsubscribe" style="color:#475569;">إلغاء الاشتراك</a>
    </div>
  </div>
</body>
</html>`;
}
