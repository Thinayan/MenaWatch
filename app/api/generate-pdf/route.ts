import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { reportDate } = await req.json();
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    });

    // Fetch report
    const { data: report } = await supabase
      .from("daily_reports")
      .select("*")
      .eq("date", reportDate)
      .single();

    // Build simple text-based PDF content (HTML approach)
    const title = `MENA.Watch - Daily Report`;
    const date = reportDate || new Date().toISOString().split("T")[0];
    const content = report?.content || "No report available for this date.";
    const marketSnapshot = report?.market_snapshot || {};

    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"><title>${title}</title>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; direction: rtl; color: #1a1a2e; max-width: 800px; margin: 0 auto; }
  h1 { color: #0f3460; border-bottom: 3px solid #22c55e; padding-bottom: 10px; font-size: 24px; }
  h2 { color: #16213e; font-size: 18px; margin-top: 24px; }
  .date { color: #666; font-size: 14px; margin-bottom: 20px; }
  .market-card { display: inline-block; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 12px 16px; margin: 4px; text-align: center; min-width: 120px; }
  .market-val { font-size: 18px; font-weight: bold; color: #0f3460; }
  .content { line-height: 1.8; white-space: pre-wrap; margin-top: 16px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
</style>
</head>
<body>
  <h1>MENA.Watch — التقرير اليومي</h1>
  <div class="date">${date}</div>
  ${Object.keys(marketSnapshot).length > 0 ? `
  <h2>نبض الأسواق</h2>
  <div>
    ${Object.entries(marketSnapshot).map(([k, v]: [string, any]) =>
      `<div class="market-card"><div style="font-size:12px;color:#666">${k}</div><div class="market-val">${v?.val || v}</div></div>`
    ).join("")}
  </div>` : ""}
  <h2>التحليل</h2>
  <div class="content">${content}</div>
  <div class="footer">MENA.Watch &copy; 2026 — منصة الذكاء الاستراتيجي للشرق الأوسط</div>
</body>
</html>`;

    // Return as downloadable HTML file (works as printable "PDF-ready" document)
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="MENA-Watch-${date}.html"`,
      },
    });
  } catch (error) {
    console.error("generate-pdf error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
