// ============================================================
// MENA Watch — إيميل الإحصائيات اليومي للأدمن
// /api/admin/daily-stats-email
// يشتغل يومياً الساعة 8:00 صباحاً بتوقيت الرياض (05:00 UTC)
// عبر Vercel Cron Jobs
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { toWestern } from "@/lib/format";

// ── حالة تطوير المنصة (FEATURES_COMING) ─────────────────────
const PLATFORM_FEATURES = [
  { icon: "🛡️", label: "خريطة أمنية تفاعلية", status: "جاهز 100%", percent: 100, done: true },
  { icon: "⚡", label: "لوحة اقتصادية حية", status: "جاهز 100%", percent: 100, done: true },
  { icon: "🤖", label: "تحليل Claude AI", status: "جاهز 100%", percent: 100, done: true },
  { icon: "🔍", label: "البحث المتقدم", status: "جاهز 100%", percent: 100, done: true },
  { icon: "🏛️", label: "الأرشيف التاريخي", status: "جاهز 80%", percent: 80, done: false },
  { icon: "📡", label: "تنبيهات فورية", status: "قيد التطوير", percent: 40, done: false },
  { icon: "📊", label: "تقارير PDF تلقائية", status: "قيد التطوير", percent: 60, done: false },
  { icon: "🔗", label: "API للمطورين", status: "مخطط", percent: 10, done: false },
  { icon: "💳", label: "نظام الاشتراكات", status: "مخطط", percent: 15, done: false },
  { icon: "📱", label: "تطبيق الجوال", status: "مخطط", percent: 5, done: false },
];

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

// ── جمع إحصائيات المنصة ─────────────────────────────────────
async function gatherPlatformStats() {
  const sb = getSupabase();
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const yesterday = new Date(now.getTime() - 86400000).toISOString().split("T")[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split("T")[0];
  const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString().split("T")[0];

  // استعلامات متوازية لجمع كل البيانات
  const [
    totalUsers,
    newUsersToday,
    newUsersWeek,
    newUsersMonth,
    totalProfiles,
    adminProfiles,
    proProfiles,
    totalComments,
    newCommentsToday,
    pendingComments,
    totalPolls,
    totalPollVotes,
    totalArticles,
    newArticlesToday,
    totalReports,
    totalAlerts,
    totalSubscribers,
    totalEmailLogs,
    aiUsage,
    recentUsers,
  ] = await Promise.all([
    // إجمالي المستخدمين
    sb.from("profiles").select("*", { count: "exact", head: true }),
    // مسجلين اليوم
    sb.from("profiles").select("*", { count: "exact", head: true })
      .gte("created_at", today),
    // مسجلين هذا الأسبوع
    sb.from("profiles").select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo),
    // مسجلين هذا الشهر
    sb.from("profiles").select("*", { count: "exact", head: true })
      .gte("created_at", monthAgo),
    // إجمالي الحسابات (كل الأدوار)
    sb.from("profiles").select("role", { count: "exact", head: false }),
    // أدمن
    sb.from("profiles").select("*", { count: "exact", head: true })
      .eq("role", "admin"),
    // خبراء
    sb.from("profiles").select("*", { count: "exact", head: true })
      .eq("role", "pro"),
    // إجمالي التعليقات
    sb.from("comments").select("*", { count: "exact", head: true }),
    // تعليقات اليوم
    sb.from("comments").select("*", { count: "exact", head: true })
      .gte("created_at", today),
    // تعليقات بانتظار الموافقة
    sb.from("comments").select("*", { count: "exact", head: true })
      .eq("is_approved", false),
    // استطلاعات
    sb.from("polls").select("*", { count: "exact", head: true }),
    // أصوات الاستطلاعات
    sb.from("poll_votes").select("*", { count: "exact", head: true }),
    // مقالات
    sb.from("articles").select("*", { count: "exact", head: true }),
    // مقالات اليوم
    sb.from("articles").select("*", { count: "exact", head: true })
      .gte("pub_date", today),
    // تقارير يومية
    sb.from("daily_reports").select("*", { count: "exact", head: true }),
    // تنبيهات DEFCON
    sb.from("defcon_alerts").select("*", { count: "exact", head: true }),
    // مشتركين
    sb.from("subscribers").select("*", { count: "exact", head: true }),
    // إيميلات مرسلة
    sb.from("email_logs").select("*", { count: "exact", head: true }),
    // استخدام AI اليوم
    sb.from("profiles").select("ai_uses_today"),
    // آخر 5 مستخدمين مسجلين
    sb.from("profiles")
      .select("email, full_name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalAiToday = aiUsage.data?.reduce(
    (sum: number, p: any) => sum + (p.ai_uses_today || 0), 0
  ) || 0;

  // حساب نسبة التطوير الكلية
  const overallProgress = Math.round(
    PLATFORM_FEATURES.reduce((sum, f) => sum + f.percent, 0) / PLATFORM_FEATURES.length
  );

  return {
    // المستخدمين
    users: {
      total: totalUsers.count || 0,
      newToday: newUsersToday.count || 0,
      newThisWeek: newUsersWeek.count || 0,
      newThisMonth: newUsersMonth.count || 0,
      admins: adminProfiles.count || 0,
      pros: proProfiles.count || 0,
      free: (totalUsers.count || 0) - (adminProfiles.count || 0) - (proProfiles.count || 0),
      recentSignups: recentUsers.data || [],
    },
    // التعليقات
    comments: {
      total: totalComments.count || 0,
      today: newCommentsToday.count || 0,
      pending: pendingComments.count || 0,
    },
    // الاستطلاعات
    polls: {
      total: totalPolls.count || 0,
      totalVotes: totalPollVotes.count || 0,
    },
    // المحتوى
    content: {
      articles: totalArticles.count || 0,
      articlesToday: newArticlesToday.count || 0,
      reports: totalReports.count || 0,
      alerts: totalAlerts.count || 0,
    },
    // التواصل
    outreach: {
      subscribers: totalSubscribers.count || 0,
      emailsSent: totalEmailLogs.count || 0,
    },
    // AI
    ai: {
      usesToday: totalAiToday,
    },
    // تقدم التطوير
    development: {
      overallProgress,
      features: PLATFORM_FEATURES,
    },
    // التاريخ
    generatedAt: now.toLocaleString("en-US", {
      timeZone: "Asia/Riyadh",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
}

// ── بناء قالب الإيميل HTML ───────────────────────────────────
function buildAdminStatsEmail(stats: Awaited<ReturnType<typeof gatherPlatformStats>>): string {
  const s = (n: number) => n.toLocaleString("en-US");

  const featureRows = stats.development.features.map(f => {
    const barColor = f.done ? "#22c55e" : f.percent >= 50 ? "#f59e0b" : "#3b82f6";
    return `
      <tr>
        <td style="padding:6px 8px;font-size:13px;color:#e2e8f0;white-space:nowrap;">${f.icon} ${f.label}</td>
        <td style="padding:6px 8px;width:50%;">
          <div style="background:#1e293b;border-radius:4px;overflow:hidden;height:8px;">
            <div style="height:100%;width:${f.percent}%;background:${barColor};border-radius:4px;"></div>
          </div>
        </td>
        <td style="padding:6px 8px;font-size:11px;color:${barColor};font-weight:700;text-align:left;white-space:nowrap;">${f.status}</td>
      </tr>`;
  }).join("");

  const recentUsersRows = stats.users.recentSignups.map((u: any) => {
    const date = toWestern(new Date(u.created_at).toLocaleDateString("ar-EG", { timeZone: "Asia/Riyadh", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }));
    const roleLabel = u.role === "admin" ? "أدمن" : u.role === "pro" ? "خبير" : "مجاني";
    const roleColor = u.role === "admin" ? "#f59e0b" : u.role === "pro" ? "#8b5cf6" : "#64748b";
    return `
      <tr>
        <td style="padding:5px 8px;font-size:12px;color:#cbd5e1;">${u.full_name || u.email?.split("@")[0] || "—"}</td>
        <td style="padding:5px 8px;font-size:11px;color:#64748b;direction:ltr;text-align:left;">${u.email || "—"}</td>
        <td style="padding:5px 8px;font-size:10px;color:${roleColor};font-weight:700;">${roleLabel}</td>
        <td style="padding:5px 8px;font-size:10px;color:#475569;">${date}</td>
      </tr>`;
  }).join("");

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تقرير إحصائيات المنصة — ${stats.generatedAt}</title>
</head>
<body style="margin:0;padding:0;background:#060d18;font-family:'Segoe UI',Tahoma,Arial,sans-serif;direction:rtl;">
<div style="max-width:680px;margin:0 auto;padding:24px 16px;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0a1628,#1a0a28);border:1px solid #8b5cf644;border-radius:12px;padding:20px 24px;margin-bottom:20px;text-align:center;">
    <img src="https://mena.watch/logo-md.png" alt="MENA.Watch" style="height:50px;width:auto;margin-bottom:4px;" />
    <div style="font-size:11px;color:#8b5cf6;letter-spacing:3px;margin-top:4px;font-weight:700;">تقرير الأدمن اليومي</div>
    <div style="font-size:12px;color:#64748b;margin-top:6px;">${stats.generatedAt}</div>
  </div>

  <!-- ═══════ القسم 1: إحصائيات المستخدمين ═══════ -->
  <div style="background:#0a1628;border:1px solid #1e293b;border-radius:10px;padding:20px;margin-bottom:16px;">
    <div style="font-size:13px;color:#22c55e;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:6px;">
      <span>👥</span> المستخدمون
    </div>

    <!-- بطاقات الأرقام -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
      <div style="flex:1;min-width:120px;background:#060d18;border:1px solid #22c55e33;border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:28px;font-weight:900;color:#22c55e;">${s(stats.users.total)}</div>
        <div style="font-size:10px;color:#64748b;">إجمالي المستخدمين</div>
      </div>
      <div style="flex:1;min-width:80px;background:#060d18;border:1px solid #3b82f633;border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:22px;font-weight:900;color:#3b82f6;">+${s(stats.users.newToday)}</div>
        <div style="font-size:10px;color:#64748b;">اليوم</div>
      </div>
      <div style="flex:1;min-width:80px;background:#060d18;border:1px solid #8b5cf633;border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:22px;font-weight:900;color:#8b5cf6;">+${s(stats.users.newThisWeek)}</div>
        <div style="font-size:10px;color:#64748b;">هذا الأسبوع</div>
      </div>
      <div style="flex:1;min-width:80px;background:#060d18;border:1px solid #f59e0b33;border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:22px;font-weight:900;color:#f59e0b;">+${s(stats.users.newThisMonth)}</div>
        <div style="font-size:10px;color:#64748b;">هذا الشهر</div>
      </div>
    </div>

    <!-- توزيع الأدوار -->
    <div style="display:flex;gap:10px;margin-bottom:14px;">
      <div style="display:flex;align-items:center;gap:4px;">
        <span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;display:inline-block;"></span>
        <span style="font-size:11px;color:#94a3b8;">أدمن: <strong style="color:#f59e0b;">${s(stats.users.admins)}</strong></span>
      </div>
      <div style="display:flex;align-items:center;gap:4px;">
        <span style="width:8px;height:8px;border-radius:50%;background:#8b5cf6;display:inline-block;"></span>
        <span style="font-size:11px;color:#94a3b8;">خبير: <strong style="color:#8b5cf6;">${s(stats.users.pros)}</strong></span>
      </div>
      <div style="display:flex;align-items:center;gap:4px;">
        <span style="width:8px;height:8px;border-radius:50%;background:#64748b;display:inline-block;"></span>
        <span style="font-size:11px;color:#94a3b8;">مجاني: <strong style="color:#94a3b8;">${s(stats.users.free)}</strong></span>
      </div>
    </div>

    <!-- آخر المسجلين -->
    ${stats.users.recentSignups.length > 0 ? `
    <div style="font-size:11px;color:#475569;margin-bottom:6px;">آخر المسجلين:</div>
    <table style="width:100%;border-collapse:collapse;background:#060d18;border-radius:6px;overflow:hidden;">
      ${recentUsersRows}
    </table>` : ""}
  </div>

  <!-- ═══════ القسم 2: التفاعل والمحتوى ═══════ -->
  <div style="background:#0a1628;border:1px solid #1e293b;border-radius:10px;padding:20px;margin-bottom:16px;">
    <div style="font-size:13px;color:#3b82f6;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:6px;">
      <span>📊</span> التفاعل والمحتوى
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <!-- التعليقات -->
      <div style="flex:1;min-width:140px;background:#060d18;border:1px solid #1e293b;border-radius:8px;padding:14px;">
        <div style="font-size:10px;color:#475569;margin-bottom:6px;">💬 التعليقات</div>
        <div style="font-size:20px;font-weight:800;color:#e2e8f0;margin-bottom:4px;">${s(stats.comments.total)}</div>
        <div style="font-size:10px;color:#64748b;">
          اليوم: <strong style="color:#3b82f6;">${s(stats.comments.today)}</strong>
          &nbsp;|&nbsp;
          بانتظار: <strong style="color:#f59e0b;">${s(stats.comments.pending)}</strong>
        </div>
      </div>

      <!-- الاستطلاعات -->
      <div style="flex:1;min-width:140px;background:#060d18;border:1px solid #1e293b;border-radius:8px;padding:14px;">
        <div style="font-size:10px;color:#475569;margin-bottom:6px;">📋 الاستطلاعات</div>
        <div style="font-size:20px;font-weight:800;color:#e2e8f0;margin-bottom:4px;">${s(stats.polls.total)}</div>
        <div style="font-size:10px;color:#64748b;">
          أصوات: <strong style="color:#8b5cf6;">${s(stats.polls.totalVotes)}</strong>
        </div>
      </div>

      <!-- المقالات -->
      <div style="flex:1;min-width:140px;background:#060d18;border:1px solid #1e293b;border-radius:8px;padding:14px;">
        <div style="font-size:10px;color:#475569;margin-bottom:6px;">📰 المقالات</div>
        <div style="font-size:20px;font-weight:800;color:#e2e8f0;margin-bottom:4px;">${s(stats.content.articles)}</div>
        <div style="font-size:10px;color:#64748b;">
          اليوم: <strong style="color:#22c55e;">${s(stats.content.articlesToday)}</strong>
        </div>
      </div>

      <!-- AI -->
      <div style="flex:1;min-width:140px;background:#060d18;border:1px solid #1e293b;border-radius:8px;padding:14px;">
        <div style="font-size:10px;color:#475569;margin-bottom:6px;">🤖 استخدام AI</div>
        <div style="font-size:20px;font-weight:800;color:#e2e8f0;margin-bottom:4px;">${s(stats.ai.usesToday)}</div>
        <div style="font-size:10px;color:#64748b;">طلب اليوم</div>
      </div>
    </div>

    <!-- صف إضافي -->
    <div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap;">
      <div style="font-size:11px;color:#94a3b8;">📝 التقارير: <strong>${s(stats.content.reports)}</strong></div>
      <div style="font-size:11px;color:#94a3b8;">🚨 التنبيهات: <strong>${s(stats.content.alerts)}</strong></div>
      <div style="font-size:11px;color:#94a3b8;">📧 المشتركون: <strong>${s(stats.outreach.subscribers)}</strong></div>
      <div style="font-size:11px;color:#94a3b8;">✉️ إيميلات مرسلة: <strong>${s(stats.outreach.emailsSent)}</strong></div>
    </div>
  </div>

  <!-- ═══════ القسم 3: تقدم تطوير المنصة ═══════ -->
  <div style="background:#0a1628;border:1px solid #1e293b;border-radius:10px;padding:20px;margin-bottom:16px;">
    <div style="font-size:13px;color:#f59e0b;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
      <span>🚀</span> تقدم تطوير المنصة
    </div>
    <div style="font-size:11px;color:#64748b;margin-bottom:16px;">
      الإنجاز الكلي: <strong style="color:#f59e0b;font-size:14px;">${stats.development.overallProgress}%</strong>
    </div>

    <!-- شريط التقدم الكلي -->
    <div style="background:#1e293b;border-radius:6px;overflow:hidden;height:10px;margin-bottom:16px;">
      <div style="height:100%;width:${stats.development.overallProgress}%;background:linear-gradient(90deg,#22c55e,#f59e0b);border-radius:6px;"></div>
    </div>

    <table style="width:100%;border-collapse:collapse;">
      ${featureRows}
    </table>
  </div>

  <!-- ═══════ CTA ═══════ -->
  <div style="text-align:center;margin-bottom:20px;">
    <a href="https://mena.watch/admin" style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:700;">
      ⚙️ فتح لوحة الأدمن
    </a>
  </div>

  <!-- Footer -->
  <div style="text-align:center;font-size:10px;color:#334155;border-top:1px solid #1e293b;padding-top:16px;">
    <img src="https://mena.watch/logo-sm.png" alt="MENA.Watch" style="height:18px;width:auto;margin-bottom:4px;" /><br>
    تقرير تلقائي — يصلك يومياً الساعة 8:00 بتوقيت الرياض<br>
    هذا التقرير مخصص للأدمن فقط
  </div>

</div>
</body>
</html>`;
}

// ── Handler الرئيسي ───────────────────────────────────────
export async function GET(req: NextRequest) {
  // التحقق من Cron secret أو من أدمن مسجل
  const authHeader = req.headers.get("authorization");
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;

  if (!isCron) {
    return NextResponse.json({ error: "Unauthorized — cron only" }, { status: 401 });
  }

  try {
    console.log("📊 بدء إعداد تقرير إحصائيات الأدمن...");

    // 1. جمع الإحصائيات
    const stats = await gatherPlatformStats();
    console.log("✅ تم جمع الإحصائيات");

    // 2. بناء الإيميل
    const emailHtml = buildAdminStatsEmail(stats);

    // 3. جلب إيميلات الأدمن
    const sb = getSupabase();
    const { data: admins } = await sb
      .from("profiles")
      .select("email, full_name")
      .eq("role", "admin")
      .not("email", "is", null);

    if (!admins || admins.length === 0) {
      console.log("⚠️ لا يوجد أدمن لإرسال التقرير");
      return NextResponse.json({ warning: "No admin emails found" });
    }

    console.log(`📧 إرسال لـ ${admins.length} أدمن`);

    // 4. إرسال الإيميلات
    const resend = getResend();
    const results = [];

    for (const admin of admins) {
      try {
        const result = await resend.emails.send({
          from: "MENA Watch <stats@mena.watch>",
          to: admin.email,
          subject: `📊 تقرير المنصة — ${stats.users.total} مستخدم | +${stats.users.newToday} اليوم | ${stats.development.overallProgress}% تطوير`,
          html: emailHtml,
        });
        results.push({ email: admin.email, status: "sent", id: result.data?.id });
      } catch (err) {
        console.error(`❌ فشل إرسال لـ ${admin.email}:`, err);
        results.push({ email: admin.email, status: "failed", error: String(err) });
      }
      await new Promise(r => setTimeout(r, 100));
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: stats.users.total,
        newToday: stats.users.newToday,
        comments: stats.comments.total,
        articles: stats.content.articles,
        overallProgress: stats.development.overallProgress,
      },
      emailsSent: results.filter(r => r.status === "sent").length,
      adminCount: admins.length,
    });

  } catch (error) {
    console.error("❌ خطأ في تقرير الإحصائيات:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
