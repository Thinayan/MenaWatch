"use client";
import { useState, useEffect, useCallback } from "react";

// ── Sample headlines for analysis ─────────────────────────────────────
const SAMPLE_HEADLINES = [
  { title: "ارتفاع مؤشر تاسي بنسبة 1.2% مع تحسن أسعار النفط", description: "شهدت السوق السعودية صعوداً ملحوظاً مع نمو قطاع الطاقة واستثمارات جديدة", source: "الاقتصادية" },
  { title: "اتفاق سعودي إماراتي لتعزيز الشراكة الاقتصادية", description: "تعاون جديد يشمل استثمار مشترك في قطاعات التقنية والسياحة وتحقيق إنجاز تنموي", source: "العربية" },
  { title: "توتر متصاعد في البحر الأحمر وتهديدات أمنية للملاحة", description: "هجوم جديد على سفينة تجارية وتصعيد في المنطقة مع تحذيرات من خطر على التجارة", source: "الجزيرة" },
  { title: "أزمة اقتصادية في لبنان وتراجع حاد في قيمة الليرة", description: "انهيار مستمر في العملة وركود اقتصادي وخسارة كبيرة في القطاع المصرفي", source: "الحدث" },
  { title: "نجاح قمة الخليج في تحقيق استقرار إقليمي", description: "اتفاق شامل على تعزيز التعاون الأمني والاقتصادي وسلام دائم بين الأطراف", source: "وكالة الأنباء السعودية" },
  { title: "Saudi Arabia announces major investment in renewable energy", description: "Growth in clean energy sector with new partnership agreements and positive economic outlook", source: "Arab News" },
  { title: "صراع مسلح في السودان يخلف ضحايا مدنيين", description: "اشتباكات عنيفة وقصف على مناطق سكنية مع فشل المفاوضات", source: "بي بي سي عربي" },
  { title: "تقدم ملحوظ في مشاريع رؤية 2030 وازدهار القطاع السياحي", description: "إنجازات جديدة في التنويع الاقتصادي مع انتعاش السياحة وتطور البنية التحتية", source: "عكاظ" },
  { title: "Oil prices surge amid supply concerns and OPEC agreement", description: "Recovery in crude markets brings profit and gain for Gulf economies", source: "Reuters" },
  { title: "عقوبات جديدة تزيد الضغط على إيران مع انسحاب دبلوماسي", description: "تهديد بمزيد من العزلة وعجز اقتصادي متفاقم", source: "فرانس 24" },
  { title: "مكاسب قوية للأسهم الخليجية مع تفاؤل المستثمرين", description: "ربح ملحوظ في قطاع البنوك والطاقة مع فرصة للنمو", source: "أرقام" },
  { title: "Military tensions escalate near Gulf waters", description: "Threat of conflict rises as defense forces mobilize amid security concerns", source: "Al Jazeera English" },
];

// ── Category labels ───────────────────────────────────────────────────
const CATEGORY_LABELS = {
  political: { ar: "سياسي", icon: "🏛" },
  economic: { ar: "اقتصادي", icon: "📊" },
  security: { ar: "أمني", icon: "🛡" },
  general: { ar: "عام", icon: "📰" },
};

const TREND_MAP = {
  improving: { arrow: "\u2191", label: "تحسّن", color: "#22c55e" },
  declining: { arrow: "\u2193", label: "تراجع", color: "#ef4444" },
  stable:    { arrow: "\u2192", label: "مستقر", color: "#eab308" },
};

const LABEL_MAP = {
  positive: { ar: "إيجابي", color: "#22c55e" },
  negative: { ar: "سلبي", color: "#ef4444" },
  neutral:  { ar: "محايد", color: "#eab308" },
};

export default function SentimentWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchSentiment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: SAMPLE_HEADLINES }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message || "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSentiment();
    const interval = setInterval(fetchSentiment, 10 * 60 * 1000); // every 10 min
    return () => clearInterval(interval);
  }, [fetchSentiment]);

  // ── Gauge helpers ─────────────────────────────────────────────────
  // score is -1 to +1, we map to 0-100 for the gauge
  const gaugePercent = data ? Math.round((data.overall.score + 1) * 50) : 50;
  const trendInfo = data ? TREND_MAP[data.overall.trend] || TREND_MAP.stable : TREND_MAP.stable;
  const labelInfo = data ? LABEL_MAP[data.overall.label] || LABEL_MAP.neutral : LABEL_MAP.neutral;

  // Distribution bar widths
  const dist = data?.distribution || { positive: 0, negative: 0, neutral: 0 };
  const distTotal = dist.positive + dist.negative + dist.neutral || 1;
  const pctPositive = Math.round((dist.positive / distTotal) * 100);
  const pctNegative = Math.round((dist.negative / distTotal) * 100);
  const pctNeutral = 100 - pctPositive - pctNegative;

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');

        .sentiment-widget {
          font-family: 'IBM Plex Sans Arabic', sans-serif;
          direction: rtl;
          background: #0a1628;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 16px;
          color: #e2e8f0;
          max-width: 340px;
          width: 100%;
        }

        .sw-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .sw-title {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sw-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          animation: sw-pulse 2s ease-in-out infinite;
        }

        @keyframes sw-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .sw-time {
          font-size: 10px;
          color: #94a3b8;
        }

        /* ── Gauge ── */
        .sw-gauge-wrap {
          position: relative;
          margin: 0 auto 14px;
          width: 180px;
          height: 100px;
          overflow: hidden;
        }

        .sw-gauge-bg {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 180px;
          height: 90px;
          border-radius: 90px 90px 0 0;
          background: conic-gradient(
            from 180deg at 50% 100%,
            #ef4444 0deg,
            #f97316 45deg,
            #eab308 90deg,
            #84cc16 135deg,
            #22c55e 180deg
          );
          opacity: 0.25;
        }

        .sw-gauge-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 180px;
          height: 90px;
          border-radius: 90px 90px 0 0;
          background: conic-gradient(
            from 180deg at 50% 100%,
            #ef4444 0deg,
            #f97316 45deg,
            #eab308 90deg,
            #84cc16 135deg,
            #22c55e 180deg
          );
          clip-path: polygon(50% 100%, 0% 100%, 0% 0%, var(--clip-x) 0%, 50% 100%);
          transition: clip-path 0.8s ease-in-out;
        }

        .sw-gauge-needle {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 2px;
          height: 70px;
          background: #e2e8f0;
          transform-origin: bottom center;
          transition: transform 0.8s ease-in-out;
          border-radius: 2px;
        }

        .sw-gauge-center {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e2e8f0;
          border: 2px solid #0a1628;
        }

        .sw-gauge-label {
          text-align: center;
          margin-top: 2px;
        }

        .sw-gauge-score {
          font-size: 22px;
          font-weight: 700;
          line-height: 1;
        }

        .sw-gauge-text {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .sw-gauge-endpoints {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #94a3b8;
          margin-top: -4px;
          padding: 0 10px;
        }

        /* ── Trend badge ── */
        .sw-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* ── Distribution bar ── */
        .sw-dist-wrap {
          margin: 14px 0 12px;
        }

        .sw-dist-label {
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 6px;
        }

        .sw-dist-bar {
          display: flex;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          gap: 2px;
        }

        .sw-dist-seg {
          height: 100%;
          border-radius: 4px;
          transition: width 0.8s ease-in-out;
          position: relative;
        }

        .sw-dist-seg.positive {
          background: linear-gradient(90deg, #16a34a, #22c55e);
        }
        .sw-dist-seg.neutral {
          background: linear-gradient(90deg, #ca8a04, #eab308);
        }
        .sw-dist-seg.negative {
          background: linear-gradient(90deg, #dc2626, #ef4444);
        }

        .sw-dist-legend {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          font-size: 10px;
          color: #94a3b8;
        }

        .sw-dist-legend span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .sw-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        /* ── Category breakdown ── */
        .sw-cats {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 12px;
        }

        .sw-cat-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid #1e293b;
        }

        .sw-cat-icon {
          font-size: 16px;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }

        .sw-cat-info {
          flex: 1;
          min-width: 0;
        }

        .sw-cat-name {
          font-size: 12px;
          font-weight: 500;
          color: #e2e8f0;
        }

        .sw-cat-bar-bg {
          height: 4px;
          background: #1e293b;
          border-radius: 2px;
          margin-top: 4px;
          overflow: hidden;
        }

        .sw-cat-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.8s ease-in-out;
        }

        .sw-cat-score {
          font-size: 12px;
          font-weight: 600;
          min-width: 38px;
          text-align: left;
          flex-shrink: 0;
        }

        .sw-cat-count {
          font-size: 9px;
          color: #94a3b8;
          margin-top: 1px;
        }

        /* ── Loading / error ── */
        .sw-loading {
          text-align: center;
          padding: 30px 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .sw-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #1e293b;
          border-top-color: #3b82f6;
          border-radius: 50%;
          margin: 0 auto 8px;
          animation: sw-spin 0.8s linear infinite;
        }

        @keyframes sw-spin {
          to { transform: rotate(360deg); }
        }

        .sw-error {
          text-align: center;
          padding: 20px 0;
          color: #ef4444;
          font-size: 12px;
        }

        .sw-retry {
          margin-top: 8px;
          padding: 4px 12px;
          border-radius: 6px;
          border: 1px solid #374151;
          background: transparent;
          color: #94a3b8;
          font-size: 11px;
          cursor: pointer;
          font-family: inherit;
        }
        .sw-retry:hover {
          background: #1e293b;
          color: #e2e8f0;
        }

        /* ── Animated gradient shimmer on gauge bg ── */
        @keyframes sw-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .sw-dist-bar {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          background-size: 200% 100%;
          animation: sw-shimmer 3s ease-in-out infinite;
        }
      `}</style>

      <div className="sentiment-widget">
        {/* Header */}
        <div className="sw-header">
          <div className="sw-title">
            <div className="sw-live-dot" />
            <span>مؤشر المزاج العام</span>
            <span style={{ fontSize: 9, color: "#f59e0b", background: "#f59e0b18", border: "1px solid #f59e0b33", borderRadius: 3, padding: "1px 6px", fontWeight: 600 }}>(تجريبي)</span>
          </div>
          {lastUpdate && (
            <span className="sw-time">
              {lastUpdate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {/* Loading state */}
        {loading && !data && (
          <div className="sw-loading">
            <div className="sw-spinner" />
            جاري التحليل...
          </div>
        )}

        {/* Error state */}
        {error && !data && (
          <div className="sw-error">
            <div>{error}</div>
            <button className="sw-retry" onClick={fetchSentiment}>إعادة المحاولة</button>
          </div>
        )}

        {/* Main content */}
        {data && (
          <>
            {/* Semicircular gauge */}
            <div className="sw-gauge-wrap">
              <div className="sw-gauge-bg" />
              <div
                className="sw-gauge-fill"
                style={{
                  "--clip-x": `${gaugePercent}%`,
                }}
              />
              <div
                className="sw-gauge-needle"
                style={{
                  transform: `rotate(${-90 + gaugePercent * 1.8}deg)`,
                }}
              />
              <div className="sw-gauge-center" />
            </div>

            <div className="sw-gauge-endpoints">
              <span>سلبي</span>
              <span>إيجابي</span>
            </div>

            {/* Score + trend */}
            <div className="sw-gauge-label">
              <div className="sw-gauge-score" style={{ color: labelInfo.color }}>
                {data.overall.score > 0 ? "+" : ""}
                {(data.overall.score * 100).toFixed(0)}%
              </div>
              <div className="sw-gauge-text">
                <span
                  className="sw-trend"
                  style={{ color: trendInfo.color, borderColor: `${trendInfo.color}33` }}
                >
                  <span>{trendInfo.arrow}</span>
                  <span>{labelInfo.ar} &middot; {trendInfo.label}</span>
                </span>
              </div>
            </div>

            {/* Distribution bar */}
            <div className="sw-dist-wrap">
              <div className="sw-dist-label">توزيع المشاعر ({data.overall.total_articles} مقال)</div>
              <div className="sw-dist-bar">
                <div
                  className="sw-dist-seg positive"
                  style={{ width: `${pctPositive}%` }}
                />
                <div
                  className="sw-dist-seg neutral"
                  style={{ width: `${pctNeutral}%` }}
                />
                <div
                  className="sw-dist-seg negative"
                  style={{ width: `${pctNegative}%` }}
                />
              </div>
              <div className="sw-dist-legend">
                <span>
                  <span className="sw-dot" style={{ background: "#22c55e" }} />
                  إيجابي {dist.positive}
                </span>
                <span>
                  <span className="sw-dot" style={{ background: "#eab308" }} />
                  محايد {dist.neutral}
                </span>
                <span>
                  <span className="sw-dot" style={{ background: "#ef4444" }} />
                  سلبي {dist.negative}
                </span>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="sw-cats">
              {(data.categories || [])
                .filter((c) => c.category !== "general")
                .map((cat) => {
                  const catMeta = CATEGORY_LABELS[cat.category] || CATEGORY_LABELS.general;
                  const catLabelInfo = LABEL_MAP[cat.label] || LABEL_MAP.neutral;
                  // Map score -1..+1 to 0..100 for the bar
                  const barWidth = Math.round((cat.score + 1) * 50);
                  const barColor =
                    cat.label === "positive"
                      ? "#22c55e"
                      : cat.label === "negative"
                      ? "#ef4444"
                      : "#eab308";

                  return (
                    <div className="sw-cat-row" key={cat.category}>
                      <div className="sw-cat-icon">{catMeta.icon}</div>
                      <div className="sw-cat-info">
                        <div className="sw-cat-name">{catMeta.ar}</div>
                        <div className="sw-cat-bar-bg">
                          <div
                            className="sw-cat-bar-fill"
                            style={{
                              width: `${barWidth}%`,
                              background: barColor,
                            }}
                          />
                        </div>
                        <div className="sw-cat-count">{cat.count} مقال</div>
                      </div>
                      <div className="sw-cat-score" style={{ color: catLabelInfo.color }}>
                        {catLabelInfo.ar}
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
