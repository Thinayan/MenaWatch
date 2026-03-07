"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COUNTRIES = [
  { value: "SA", label: "🇸🇦 السعودية" }, { value: "AE", label: "🇦🇪 الإمارات" },
  { value: "QA", label: "🇶🇦 قطر" }, { value: "EG", label: "🇪🇬 مصر" },
  { value: "KW", label: "🇰🇼 الكويت" }, { value: "OM", label: "🇴🇲 عمان" },
  { value: "BH", label: "🇧🇭 البحرين" }, { value: "IQ", label: "🇮🇶 العراق" },
  { value: "JO", label: "🇯🇴 الأردن" }, { value: "LB", label: "🇱🇧 لبنان" },
];

const INDICATORS = [
  { value: "gdp", label: "الناتج المحلي" },
  { value: "inflation", label: "التضخم" },
  { value: "unemployment", label: "البطالة" },
];

const getLabel = (code) => COUNTRIES.find(c => c.value === code)?.label || code;

export default function ComparisonDashboard() {
  const [c1, setC1] = useState("SA");
  const [c2, setC2] = useState("AE");
  const [indicator, setIndicator] = useState("gdp");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/archive/compare?country1=${c1}&country2=${c2}&indicator=${indicator}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [c1, c2, indicator]);

  const selectStyle = {
    padding: "6px 10px", background: "#0a1628", border: "1px solid #1e293b",
    borderRadius: 6, color: "#e2e8f0", fontSize: 11, fontFamily: "inherit",
  };

  // Prepare chart data (merge by period)
  const chartData = [];
  if (data) {
    const allPeriods = new Set();
    [...(data.country1?.indicators || []), ...(data.country2?.indicators || [])].forEach(item => {
      allPeriods.add(item.period?.slice(0, 4));
    });

    [...allPeriods].sort().forEach(year => {
      const entry = { year };
      const v1 = data.country1?.indicators?.find(i => i.period?.startsWith(year));
      const v2 = data.country2?.indicators?.find(i => i.period?.startsWith(year));
      if (v1) entry[c1] = parseFloat(v1.value);
      if (v2) entry[c2] = parseFloat(v2.value);
      chartData.push(entry);
    });
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <select value={c1} onChange={e => setC1(e.target.value)} style={selectStyle}>
          {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <span style={{ color: "#475569", fontSize: 12, fontWeight: 700 }}>⚔️ vs</span>
        <select value={c2} onChange={e => setC2(e.target.value)} style={selectStyle}>
          {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <div style={{ width: 1, height: 20, background: "#1e293b" }} />
        <select value={indicator} onChange={e => setIndicator(e.target.value)} style={selectStyle}>
          {INDICATORS.map(ind => <option key={ind.value} value={ind.value}>{ind.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ height: 300, background: "#0a1628", borderRadius: 10, animation: "pulse 1.5s infinite" }} />
      ) : !data ? (
        <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>
          <div style={{ fontSize: 13 }}>لا توجد بيانات للمقارنة</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <CountryCard code={c1} label={getLabel(c1)} data={data.country1} color="#22c55e" indicator={indicator} />
            <CountryCard code={c2} label={getLabel(c2)} data={data.country2} color="#3b82f6" indicator={indicator} />
          </div>

          {/* Comparison Chart */}
          {chartData.length > 0 && (
            <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f8fafc", marginBottom: 12 }}>
                📊 مقارنة {INDICATORS.find(i => i.value === indicator)?.label || indicator}
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={10} />
                  <Tooltip
                    contentStyle={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, fontSize: 11, direction: "rtl" }}
                    labelStyle={{ color: "#f8fafc" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey={c1} fill="#22c55e" name={getLabel(c1)} radius={[4, 4, 0, 0]} />
                  <Bar dataKey={c2} fill="#3b82f6" name={getLabel(c2)} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Line Chart Overlay */}
          {chartData.length > 1 && (
            <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f8fafc", marginBottom: 12 }}>📈 الاتجاه عبر الزمن</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={10} />
                  <Tooltip
                    contentStyle={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, fontSize: 11 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey={c1} stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name={getLabel(c1)} />
                  <Line type="monotone" dataKey={c2} stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name={getLabel(c2)} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CountryCard({ code, label, data, color, indicator }) {
  const latestValue = data?.indicators?.slice(-1)[0];
  return (
    <div style={{ background: "#0a1628", border: `1px solid ${color}33`, borderRadius: 10, padding: 16, textAlign: "center" }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color, marginBottom: 4 }}>
        {latestValue ? latestValue.value : "—"}
        <span style={{ fontSize: 11, color: "#475569", marginRight: 4 }}>
          {latestValue?.unit || ""}
        </span>
      </div>
      <div style={{ fontSize: 10, color: "#475569" }}>
        {latestValue ? `آخر تحديث: ${latestValue.period?.slice(0, 4)}` : "لا توجد بيانات"}
      </div>
      <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>
        أحداث مسجلة: {data?.eventCount || 0}
      </div>
    </div>
  );
}
