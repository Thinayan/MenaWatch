"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COUNTRIES = [
  { value: "SA", label: "🇸🇦 السعودية" }, { value: "AE", label: "🇦🇪 الإمارات" },
  { value: "QA", label: "🇶🇦 قطر" }, { value: "EG", label: "🇪🇬 مصر" },
  { value: "KW", label: "🇰🇼 الكويت" }, { value: "OM", label: "🇴🇲 عمان" },
];

const INDICATORS = [
  { value: "gdp", label: "الناتج المحلي (GDP)" },
  { value: "inflation", label: "التضخم" },
  { value: "unemployment", label: "البطالة" },
  { value: "oil_price", label: "سعر النفط" },
  { value: "fdi", label: "الاستثمار الأجنبي" },
];

const CHART_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function IndicatorCharts() {
  const [country, setCountry] = useState("SA");
  const [indicator, setIndicator] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ country });
    if (indicator) params.set("indicator", indicator);

    fetch(`/api/archive/indicators?${params}`)
      .then(r => r.json())
      .then(d => {
        const raw = d.indicators || [];
        // Group by indicator_key, then merge by period
        const byPeriod = {};
        raw.forEach(item => {
          const year = item.period?.slice(0, 4) || "?";
          if (!byPeriod[year]) byPeriod[year] = { year };
          byPeriod[year][item.indicator_key] = parseFloat(item.value);
        });
        setData(Object.values(byPeriod).sort((a, b) => a.year.localeCompare(b.year)));
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [country, indicator]);

  // Detect which indicators are in the data
  const activeIndicators = [...new Set(data.flatMap(d => Object.keys(d).filter(k => k !== "year")))];

  const selectStyle = {
    padding: "6px 10px", background: "#0a1628", border: "1px solid #1e293b",
    borderRadius: 6, color: "#e2e8f0", fontSize: 11, fontFamily: "inherit",
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <select value={country} onChange={e => setCountry(e.target.value)} style={selectStyle}>
          {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={indicator} onChange={e => setIndicator(e.target.value)} style={selectStyle}>
          <option value="">جميع المؤشرات</option>
          {INDICATORS.map(ind => <option key={ind.value} value={ind.value}>{ind.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ height: 300, background: "#0a1628", borderRadius: 10, animation: "pulse 1.5s infinite" }} />
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>📊</div>
          <div style={{ fontSize: 13 }}>لا توجد بيانات مؤشرات لهذه الدولة</div>
          <div style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>تأكد من تشغيل migrations المرحلة 4 وإضافة بيانات</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Line Chart */}
          <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f8fafc", marginBottom: 12 }}>📈 المؤشرات عبر الزمن</div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, fontSize: 11, direction: "rtl" }}
                  labelStyle={{ color: "#f8fafc" }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {activeIndicators.map((key, i) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name={INDICATORS.find(ind => ind.value === key)?.label || key}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Area Chart (if single indicator) */}
          {activeIndicators.length === 1 && (
            <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f8fafc", marginBottom: 12 }}>
                📊 {INDICATORS.find(ind => ind.value === activeIndicators[0])?.label || activeIndicators[0]}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip
                    contentStyle={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, fontSize: 11 }}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeIndicators[0]}
                    stroke="#22c55e"
                    fill="#22c55e22"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
