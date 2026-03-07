"use client";
import { useState, useEffect } from "react";

import TimelineView from "./archive/TimelineView";
import EventsGrid from "./archive/EventsGrid";
import IndicatorCharts from "./archive/IndicatorCharts";
import ComparisonDashboard from "./archive/ComparisonDashboard";

const TABS = [
  { id: "timeline", label: "📅 الخط الزمني", desc: "عرض الأحداث بترتيب زمني" },
  { id: "events", label: "📋 الأحداث", desc: "شبكة أحداث مع فلاتر" },
  { id: "charts", label: "📊 المؤشرات", desc: "رسوم بيانية تفاعلية" },
  { id: "compare", label: "⚖️ مقارنة", desc: "مقارنة بين دولتين" },
];

const EVENT_TYPES = [
  { value: "", label: "الكل" },
  { value: "political", label: "🏛️ سياسي" }, { value: "economic", label: "💰 اقتصادي" },
  { value: "security", label: "🛡️ أمني" }, { value: "diplomatic", label: "🤝 دبلوماسي" },
  { value: "energy", label: "⚡ طاقة" }, { value: "social", label: "🎭 اجتماعي" },
  { value: "health", label: "🏥 صحي" }, { value: "tech", label: "💻 تقني" },
];

const COUNTRIES = [
  { value: "", label: "جميع الدول" },
  { value: "SA", label: "🇸🇦 السعودية" }, { value: "AE", label: "🇦🇪 الإمارات" },
  { value: "QA", label: "🇶🇦 قطر" }, { value: "EG", label: "🇪🇬 مصر" },
  { value: "KW", label: "🇰🇼 الكويت" }, { value: "OM", label: "🇴🇲 عمان" },
  { value: "IQ", label: "🇮🇶 العراق" }, { value: "JO", label: "🇯🇴 الأردن" },
  { value: "LB", label: "🇱🇧 لبنان" }, { value: "YE", label: "🇾🇪 اليمن" },
  { value: "SY", label: "🇸🇾 سوريا" }, { value: "SD", label: "🇸🇩 السودان" },
  { value: "LY", label: "🇱🇾 ليبيا" }, { value: "IR", label: "🇮🇷 إيران" },
];

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState("timeline");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  // Filters
  const [filterCountry, setFilterCountry] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [searchQ, setSearchQ] = useState("");

  const LIMIT = 20;

  const fetchEvents = async (newOffset = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(LIMIT), offset: String(newOffset) });
      if (filterCountry) params.set("country", filterCountry);
      if (filterType) params.set("type", filterType);
      if (filterFrom) params.set("from", filterFrom);
      if (filterTo) params.set("to", filterTo);
      if (searchQ.length >= 2) params.set("q", searchQ);

      const r = await fetch(`/api/archive/events?${params}`);
      const d = await r.json();

      if (newOffset === 0) {
        setEvents(d.events || []);
      } else {
        setEvents(prev => [...prev, ...(d.events || [])]);
      }
      setTotal(d.total || 0);
      setHasMore(d.hasMore || false);
      setOffset(newOffset);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "timeline" || activeTab === "events") {
      setOffset(0);
      fetchEvents(0);
    }
  }, [activeTab, filterCountry, filterType, filterFrom, filterTo]);

  const handleSearch = (e) => {
    e.preventDefault();
    setOffset(0);
    fetchEvents(0);
  };

  const selectStyle = {
    padding: "6px 10px", background: "#0a1628", border: "1px solid #1e293b",
    borderRadius: 6, color: "#e2e8f0", fontSize: 11, fontFamily: "inherit",
  };

  return (
    <div className="archive-root" style={{ fontFamily: "'IBM Plex Sans Arabic','Tajawal',sans-serif", background: "#060d18", minHeight: "100vh", color: "#e2e8f0", direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        .archive-root, .archive-root * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input:focus, select:focus { outline: 1px solid #22c55e55; }
      `}</style>



      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc", marginBottom: 6 }}>
            🏛️ الأرشيف التاريخي
          </h1>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>
            أحداث ومؤشرات تاريخية لمنطقة الشرق الأوسط مع تحليل "لماذا حدث" و"ماذا يعني لك"
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 16px", borderRadius: 8, border: "1px solid",
                borderColor: activeTab === tab.id ? "#22c55e" : "#1e293b",
                background: activeTab === tab.id ? "#22c55e11" : "transparent",
                color: activeTab === tab.id ? "#22c55e" : "#94a3b8",
                fontSize: 12, fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters (for timeline and events tabs) */}
        {(activeTab === "timeline" || activeTab === "events") && (
          <div style={{ background: "#080f1c", border: "1px solid #1e293b", borderRadius: 10, padding: 14, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} style={selectStyle}>
                {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
                {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} style={{ ...selectStyle, width: 130 }} />
              <span style={{ color: "#94a3b8", fontSize: 10 }}>→</span>
              <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} style={{ ...selectStyle, width: 130 }} />
              <form onSubmit={handleSearch} style={{ display: "flex", gap: 4 }}>
                <input
                  type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder="🔍 بحث..." style={{ ...selectStyle, width: 140 }}
                />
              </form>
              {total > 0 && <span style={{ fontSize: 10, color: "#22c55e", marginRight: "auto" }}>{total} حدث</span>}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "timeline" && (
          <TimelineView events={events} loading={loading} />
        )}

        {activeTab === "events" && (
          <EventsGrid
            events={events} loading={loading}
            hasMore={hasMore}
            onLoadMore={() => fetchEvents(offset + LIMIT)}
          />
        )}

        {activeTab === "charts" && <IndicatorCharts />}

        {activeTab === "compare" && <ComparisonDashboard />}
      </div>
    </div>
  );
}
