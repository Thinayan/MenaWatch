// ============================================================
// MENA Watch — قوالب الإيميلات
// /lib/email-templates.ts
// ============================================================

// ── التقرير الصباحي ───────────────────────────────────────
export function buildDailyReportEmail({
  date, content, market, defcon,
}: {
  date: string;
  content: string;
  market: any;
  defcon: any[];
}): string {

  const defconColors: Record<number, string> = {
    1: "#ef4444", 2: "#f87171", 3: "#f59e0b", 4: "#3b82f6", 5: "#22c55e",
  };

  // تحويل markdown بسيط → HTML
  const contentHtml = content
    .replace(/\*\*(.*?)\*\*/g, "<strong style='color:#f8fafc'>$1</strong>")
    .replace(/^#{1,3}\s(.+)$/gm, "<h3 style='color:#22c55e;font-size:15px;margin:16px 0 8px'>$1</h3>")
    .replace(/^[-•]\s(.+)$/gm, "<li style='color:#94a3b8;margin:4px 0'>$1</li>")
    .replace(/\n\n/g, "</p><p style='color:#94a3b8;line-height:1.8;margin:8px 0'>")
    .replace(/\n/g, "<br>");

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تقرير MENA Watch — ${date}</title>
</head>
<body style="margin:0;padding:0;background:#060d18;font-family:'Segoe UI',Tahoma,Arial,sans-serif;direction:rtl;">
<div style="max-width:620px;margin:0 auto;padding:24px 16px;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0a1628,#0f2040);border:1px solid #1e3a5f;border-radius:12px;padding:20px 24px;margin-bottom:20px;text-align:center;">
    <img src="https://mena.watch/logo-md.png" alt="MENA.Watch" style="height:60px;width:auto;margin-bottom:4px;" />
    <div style="font-size:11px;color:#475569;letter-spacing:3px;margin-top:2px;">التقرير الصباحي اليومي</div>
    <div style="font-size:13px;color:#64748b;margin-top:8px;">${date}</div>
    <div style="display:inline-block;background:#ef444422;border:1px solid #ef4444;border-radius:4px;padding:3px 10px;font-size:10px;color:#ef4444;margin-top:8px;font-weight:700;">
      ⏰ تقرير الساعة 6:00 — بتوقيت الرياض
    </div>
  </div>

  <!-- Market strip -->
  <div style="background:#0a1628;border:1px solid #1e293b;border-radius:8px;padding:14px 20px;margin-bottom:16px;display:flex;justify-content:space-around;text-align:center;">
    ${[
      { label: "تاسي", val: market.tasi.val, chg: market.tasi.chg, up: market.tasi.up },
      { label: "برنت", val: market.brent.val + "$", chg: market.brent.chg, up: market.brent.up },
      { label: "ذهب", val: market.gold.val + "$", chg: market.gold.chg, up: market.gold.up },
      { label: "USD/SAR", val: market.usdsar.val, chg: market.usdsar.chg, up: market.usdsar.up },
    ].map(m => `
      <div>
        <div style="font-size:10px;color:#475569;margin-bottom:3px;">${m.label}</div>
        <div style="font-size:15px;font-weight:700;color:#f8fafc;">${m.val}</div>
        <div style="font-size:10px;color:${m.up === true ? "#22c55e" : m.up === false ? "#ef4444" : "#64748b"};font-weight:600;">${m.chg}</div>
      </div>
    `).join('<div style="width:1px;background:#1e293b;"></div>')}
  </div>

  <!-- DEFCON bar -->
  <div style="background:#0a1628;border:1px solid #1e293b;border-radius:8px;padding:12px 16px;margin-bottom:16px;">
    <div style="font-size:10px;color:#475569;margin-bottom:8px;">مؤشر DEFCON الإقليمي</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      ${defcon.map(d => `
        <div style="background:${defconColors[d.level]}22;border:1px solid ${defconColors[d.level]}55;border-radius:5px;padding:4px 10px;display:flex;align-items:center;gap:6px;">
          <span style="font-size:10px;color:#e2e8f0;">${d.region}</span>
          <span style="font-size:11px;font-weight:700;color:${defconColors[d.level]};">D${d.level}</span>
        </div>
      `).join("")}
    </div>
  </div>

  <!-- Report content -->
  <div style="background:#0a1628;border:1px solid #22c55e33;border-radius:12px;padding:24px;margin-bottom:16px;">
    <div style="font-size:12px;color:#22c55e;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:6px;">
      <span style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;"></span>
      تحليل Claude AI — التقرير الاستراتيجي
    </div>
    <div style="font-size:13px;color:#94a3b8;line-height:1.9;">
      <p style="margin:0 0 12px">${contentHtml}</p>
    </div>
  </div>

  <!-- CTA -->
  <div style="text-align:center;margin-bottom:20px;">
    <a href="https://mena.watch" style="display:inline-block;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:700;margin-left:8px;">
      🗺️ افتح الخريطة
    </a>
    <a href="https://mena.watch/ops" style="display:inline-block;background:#0f1f3d;border:1px solid #1e3a5f;color:#93c5fd;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:700;">
      📊 غرفة العمليات
    </a>
  </div>

  <!-- Upgrade CTA -->
  <div style="background:linear-gradient(135deg,#0f2040,#1a1040);border:1px solid #8b5cf655;border-radius:10px;padding:16px 20px;margin-bottom:20px;text-align:center;">
    <div style="font-size:13px;color:#e2e8f0;margin-bottom:8px;">⭐ هل تريد تحليلاً أعمق؟</div>
    <div style="font-size:11px;color:#64748b;margin-bottom:12px;">حساب الخبير يمنحك تقارير مفصلة + تنبيهات مخصصة + API</div>
    <a href="https://mena.watch/expert" style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:12px;font-weight:700;">
      ترقية لحساب الخبير
    </a>
  </div>

  <!-- Footer -->
  <div style="text-align:center;font-size:10px;color:#334155;border-top:1px solid #1e293b;padding-top:16px;">
    <img src="https://mena.watch/logo-sm.png" alt="MENA.Watch" style="height:20px;width:auto;margin-bottom:4px;" /><br>
    مراقب الشرق الأوسط — يصلك هذا التقرير يومياً الساعة 6:00 بتوقيت الرياض<br><br>
    <a href="https://mena.watch/unsubscribe" style="color:#334155;text-decoration:none;">إلغاء الاشتراك</a>
    &nbsp;•&nbsp;
    <a href="https://mena.watch/preferences" style="color:#334155;text-decoration:none;">تعديل التفضيلات</a>
  </div>

</div>
</body>
</html>`;
}

// ── تنبيه DEFCON ──────────────────────────────────────────
export function buildDefconAlertEmail({
  region, previousLevel, newLevel, isEscalation,
  label, color, reason, source, timestamp,
}: {
  region: string; previousLevel: number; newLevel: number;
  isEscalation: boolean; label: string; color: string;
  reason: string; source: string; timestamp: string;
}): string {

  const urgencyText = isEscalation ? "تصاعد في مستوى التوتر" : "تحسن في الوضع";
  const urgencyIcon = isEscalation ? "🚨" : "✅";
  const urgencyColor = isEscalation ? "#ef4444" : "#22c55e";

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#060d18;font-family:'Segoe UI',Tahoma,Arial,sans-serif;direction:rtl;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;">

  <!-- Alert Header -->
  <div style="background:${color}22;border:2px solid ${color};border-radius:12px;padding:20px 24px;margin-bottom:20px;text-align:center;">
    <div style="font-size:32px;margin-bottom:8px;">${urgencyIcon}</div>
    <img src="https://mena.watch/logo-sm.png" alt="MENA.Watch" style="height:20px;width:auto;margin-bottom:6px;" />
    <div style="font-size:11px;color:#475569;letter-spacing:3px;margin-bottom:4px;">تنبيه فوري</div>
    <div style="font-size:20px;font-weight:900;color:${urgencyColor};">${urgencyText}</div>
    <div style="font-size:13px;color:#64748b;margin-top:4px;">${timestamp}</div>
  </div>

  <!-- Region Card -->
  <div style="background:#0a1628;border:1px solid ${color}55;border-radius:10px;padding:20px;margin-bottom:16px;">
    <div style="font-size:11px;color:#64748b;margin-bottom:12px;">المنطقة المتأثرة</div>
    <div style="font-size:24px;font-weight:900;color:#f8fafc;margin-bottom:12px;">${region}</div>

    <!-- DEFCON change -->
    <div style="display:flex;align-items:center;justify-content:center;gap:16px;background:#0f172a;border-radius:8px;padding:14px;margin-bottom:12px;">
      <div style="text-align:center;">
        <div style="font-size:10px;color:#64748b;margin-bottom:4px;">المستوى السابق</div>
        <div style="font-size:36px;font-weight:900;color:#64748b;">D${previousLevel}</div>
      </div>
      <div style="font-size:24px;color:${urgencyColor};">${isEscalation ? "→" : "→"}</div>
      <div style="text-align:center;">
        <div style="font-size:10px;color:#64748b;margin-bottom:4px;">المستوى الجديد</div>
        <div style="font-size:36px;font-weight:900;color:${color};text-shadow:0 0 20px ${color}66;">D${newLevel}</div>
      </div>
    </div>

    <div style="background:${color}11;border:1px solid ${color}33;border-radius:6px;padding:10px 14px;text-align:center;">
      <div style="font-size:14px;font-weight:700;color:${color};">${label}</div>
    </div>
  </div>

  <!-- Reason -->
  <div style="background:#0a1628;border:1px solid #1e293b;border-radius:8px;padding:14px 16px;margin-bottom:16px;">
    <div style="font-size:10px;color:#475569;margin-bottom:6px;">سبب التنبيه</div>
    <div style="font-size:13px;color:#cbd5e1;line-height:1.7;">${reason}</div>
    <div style="font-size:10px;color:#334155;margin-top:8px;">المصدر: ${source}</div>
  </div>

  <!-- CTA -->
  <div style="text-align:center;margin-bottom:20px;">
    <a href="https://mena.watch/ops" style="display:inline-block;background:${urgencyColor};color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:700;">
      📊 فتح غرفة العمليات
    </a>
  </div>

  <!-- Footer -->
  <div style="text-align:center;font-size:10px;color:#334155;border-top:1px solid #1e293b;padding-top:16px;">
    <img src="https://mena.watch/logo-sm.png" alt="MENA.Watch" style="height:20px;width:auto;margin-bottom:4px;" /><br>
    نظام الإنذار المبكر<br>
    <a href="https://mena.watch/alerts" style="color:#334155;text-decoration:none;">إدارة التنبيهات</a>
    &nbsp;•&nbsp;
    <a href="https://mena.watch/unsubscribe" style="color:#334155;text-decoration:none;">إلغاء الاشتراك</a>
  </div>

</div>
</body>
</html>`;
}
