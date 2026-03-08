"use client";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import LiveBroadcastPanel from "./LiveBroadcastPanel";

const NewsTicker = lazy(() => import("./NewsTicker"));
const SentimentWidget = lazy(() => import("./SentimentWidget"));

// ── Data ─────────────────────────────────────────────────
const LAYERS = [
  { id: "security", ar: "الأمن والاستقرار", icon: "🛡️", color: "#ef4444", desc: "نقاط التوتر الإقليمية والنزاعات المسلحة" },
  { id: "economy",  ar: "الاقتصاد والطاقة",  icon: "⚡", color: "#f59e0b", desc: "الممرات التجارية وخطوط الأنابيب والاستثمارات" },
  { id: "digital",  ar: "البنية الرقمية",    icon: "🌐", color: "#3b82f6", desc: "كابلات البحر ومراكز البيانات وشبكات الاتصالات" },
  { id: "opportunities", ar: "الفرص والمشاريع", icon: "🚀", color: "#10b981", desc: "مناطق النمو ومشاريع رؤية 2030 والصفقات الكبرى" },
];

const HOTSPOTS = {
  security: [
    { id:1, name:"اليمن",       lat:15.5, lng:48.5, risk:88, trend:"↑", detail:"النزاع مستمر — مفاوضات الهدنة متعثرة" },
    { id:2, name:"السودان",     lat:15.5, lng:32.5, risk:80, trend:"↑", detail:"اشتباكات في الخرطوم والفاشر" },
    { id:3, name:"إيران",       lat:32.4, lng:53.7, risk:72, trend:"→", detail:"توترات نووية — مفاوضات دبلوماسية" },
    { id:4, name:"لبنان",       lat:33.9, lng:35.5, risk:65, trend:"↓", detail:"استقرار نسبي بعد وقف إطلاق النار" },
    { id:5, name:"العراق",      lat:33.2, lng:43.7, risk:55, trend:"→", detail:"استقرار سياسي هش — تحديات اقتصادية" },
    { id:6, name:"ليبيا",       lat:26.3, lng:17.2, risk:60, trend:"→", detail:"انقسام سياسي بين الشرق والغرب" },
  ],
  economy: [
    { id:7,  name:"قناة السويس",  lat:30.5, lng:32.3, risk:45, trend:"↓", detail:"تراجع حركة الملاحة 40% بسبب توترات البحر الأحمر" },
    { id:8,  name:"مضيق هرمز",   lat:26.6, lng:56.2, risk:50, trend:"→", detail:"21 مليون برميل يومياً — نقطة الخنق العالمية" },
    { id:9,  name:"نيوم",         lat:27.5, lng:35.5, risk:10, trend:"↑", detail:"The Line — تقدم البناء 12% | ميزانية $500B" },
    { id:10, name:"أرامكو",       lat:26.3, lng:50.1, risk:15, trend:"↑", detail:"إنتاج 9.2 مليون برميل/يوم | برنت $82.4" },
    { id:11, name:"دبي",          lat:25.2, lng:55.3, risk:5,  trend:"↑", detail:"نمو GDP 4.3% | مركز مالي عالمي" },
  ],
  digital: [
    { id:13, name:"كابل AAE-1",            lat:23.6, lng:58.6, risk:30, trend:"→", detail:"25,000 كم — يربط آسيا بأوروبا عبر الخليج" },
    { id:15, name:"مركز بيانات الرياض",    lat:24.7, lng:46.7, risk:5,  trend:"↑", detail:"HUMAIN — مشروع الذكاء الاصطناعي $100B" },
    { id:16, name:"5G الخليج",             lat:25.3, lng:51.5, risk:8,  trend:"↑", detail:"انتشار 5G 78% في دول الخليج — الأعلى عالمياً" },
  ],
  opportunities: [
    { id:18, name:"نيوم",          lat:27.5, lng:35.5, risk:5,  trend:"↑", detail:"فرص استثمار مفتوحة | قطاع السياحة والتقنية" },
    { id:19, name:"القدية",        lat:24.5, lng:46.3, risk:5,  trend:"↑", detail:"مشروع الترفيه $8B — افتتاح 2026" },
    { id:20, name:"البحر الأحمر", lat:23.8, lng:38.5, risk:8,  trend:"↑", detail:"50 فندق فاخر | 50 جزيرة | $10B استثمار" },
    { id:21, name:"العُلا",        lat:26.6, lng:37.9, risk:3,  trend:"↑", detail:"السياحة الثقافية | 2M زيارة هدف 2030" },
    { id:22, name:"مصر",          lat:26.8, lng:30.8, risk:20, trend:"↑", detail:"فرص FDI في قطاعات الطاقة والزراعة" },
    { id:23, name:"المغرب",       lat:31.8, lng:-7.1, risk:15, trend:"↑", detail:"مركز طاقة متجددة — هدف 52% بحلول 2030" },
  ],
};

const NEWS_FEED = [
  { time:"منذ 12د", text:"أسعار برنت تتراجع 0.8% إلى $82.1 وسط مخاوف الطلب الصيني", tag:"economy" },
  { time:"منذ 28د", text:"مجلس الأمن يعقد جلسة طارئة حول الأوضاع في البحر الأحمر", tag:"security" },
  { time:"منذ 45د", text:"HUMAIN تعلن شراكة مع NVIDIA لبناء أكبر مجمع للذكاء الاصطناعي في المنطقة", tag:"digital" },
  { time:"منذ 1س",  text:"تداول يسجل أعلى مستوى في 6 أشهر بدعم من أرامكو وسابك", tag:"economy" },
  { time:"منذ 2س",  text:"الإمارات تطلق مبادرة للطاقة النووية السلمية في شراكة مع كوريا الجنوبية", tag:"digital" },
  { time:"منذ 3س",  text:"مفاوضات السلام اليمنية تستأنف في مسقط برعاية عُمانية", tag:"security" },
];

const TAG_COLORS = { security:"#ef4444", economy:"#f59e0b", digital:"#3b82f6", opportunities:"#10b981" };

function riskColor(r) {
  if (r >= 70) return "#ef4444";
  if (r >= 45) return "#f59e0b";
  if (r >= 20) return "#3b82f6";
  return "#10b981";
}

function riskLabel(r) {
  if (r >= 70) return "مرتفع";
  if (r >= 45) return "متوسط";
  if (r >= 20) return "منخفض";
  return "مستقر";
}

// ── Clock ─────────────────────────────────────────────────
function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return <span style={{fontFamily:"monospace", fontSize:13, color:"#94a3b8"}}>{t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}</span>;
}

// ── Main Component ────────────────────────────────────────
export default function MenaWatchMap() {
  const [activeLayer, setActiveLayer] = useState("security");
  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showNews, setShowNews] = useState(true);
  const [ctaDismissed, setCtaDismissed] = useState(false);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersLayer = useRef(null);

  const layer = LAYERS.find(l => l.id === activeLayer);
  const spots = HOTSPOTS[activeLayer] || [];
  const topThreats = [...(HOTSPOTS.security || [])].sort((a,b) => b.risk - a.risk).slice(0,3);

  // CTA popup: show after 3s, auto-hide after 20s, remember dismissal
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("mena_cta_dismissed")) {
      setCtaDismissed(true);
      return;
    }
    const t = setTimeout(() => setShowCta(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showCta || ctaDismissed) return;
    const t = setTimeout(() => setShowCta(false), 20000);
    return () => clearTimeout(t);
  }, [showCta, ctaDismissed]);

  function dismissCta() {
    setShowCta(false);
    setCtaDismissed(true);
    if (typeof window !== "undefined") localStorage.setItem("mena_cta_dismissed", "1");
  }

  // ── Load Leaflet dynamically ──────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (leafletMap.current) return;

    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  function initMap() {
    if (!mapRef.current || leafletMap.current) return;
    const L = window.L;

    leafletMap.current = L.map(mapRef.current, {
      center: [25, 42],
      zoom: 4,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "©OpenStreetMap ©CartoDB",
      subdomains: "abcd",
      maxZoom: 10,
    }).addTo(leafletMap.current);

    markersLayer.current = L.layerGroup().addTo(leafletMap.current);
    renderMarkers(activeLayer);
  }

  function renderMarkers(layerId) {
    if (!leafletMap.current || !markersLayer.current) return;
    const L = window.L;
    markersLayer.current.clearLayers();

    const spots = HOTSPOTS[layerId] || [];
    spots.forEach(spot => {
      const color = riskColor(spot.risk);
      const size = Math.max(24, Math.min(50, spot.risk * 0.5 + 20));

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            width:${size}px; height:${size}px;
            background:${color}22;
            border:2px solid ${color};
            border-radius:50%;
            display:flex; align-items:center; justify-content:center;
            font-weight:bold; font-size:${size > 35 ? 13 : 11}px;
            color:${color}; cursor:pointer;
            box-shadow:0 0 12px ${color}66;
            position:relative;
            animation: pulse-ring 2s infinite;
          ">
            ${spot.risk}
            <div style="
              position:absolute; top:-8px; right:-8px;
              background:${color}; color:#fff;
              border-radius:4px; font-size:10px;
              padding:1px 4px; font-weight:bold;
              white-space:nowrap;
            ">${spot.trend}</div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
      });

      const marker = L.marker([spot.lat, spot.lng], { icon })
        .addTo(markersLayer.current)
        .bindTooltip(`<b>${spot.name}</b><br/>${spot.detail}`, {
          direction: "top",
          className: "mena-tooltip",
          offset: [0, -size/2],
        })
        .on("click", () => {
          setSelected(spot);
          setAnalysis("");
        });
    });
  }

  // Re-render markers when layer changes
  useEffect(() => {
    if (leafletMap.current && markersLayer.current) {
      renderMarkers(activeLayer);
    }
  }, [activeLayer]);

  // ── AI Analysis (via server-side API route) ──────────
  async function getAIAnalysis(spot) {
    setLoadingAI(true);
    setAnalysis("");
    try {
      const res = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: spot.name,
          risk: spot.risk,
          trend: spot.trend,
          detail: spot.detail,
        }),
      });
      const data = await res.json();
      setAnalysis(data.analysis || "لم يتوفر تحليل.");
    } catch (e) {
      setAnalysis("تعذّر الاتصال بمحرك التحليل. يرجى المحاولة مجدداً.");
    }
    setLoadingAI(false);
  }

  return (
    <div style={{ direction:"rtl", background:"#060d18", height:"100vh", color:"#e2e8f0", fontFamily:"'Segoe UI', Tahoma, Arial, sans-serif", display:"flex", flexDirection:"column", overflow:"hidden" }}>

      {/* ── Leaflet pulse CSS ── */}
      <style>{`
        @keyframes pulse-ring { 0%,100%{box-shadow:0 0 8px currentColor} 50%{box-shadow:0 0 20px currentColor} }
        .mena-tooltip { background:#0f172a!important; border:1px solid #334155!important; color:#e2e8f0!important; font-family:Tahoma,Arial,sans-serif!important; font-size:12px!important; direction:rtl; border-radius:6px!important; padding:6px 10px!important; }
        .mena-tooltip::before { border-top-color:#334155!important; }
        .leaflet-control-zoom { border:1px solid #334155!important; }
        .leaflet-control-zoom a { background:#0f172a!important; color:#94a3b8!important; border-color:#334155!important; }
        .leaflet-control-zoom a:hover { background:#1e293b!important; color:#e2e8f0!important; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ background:"#0a1628", borderBottom:"1px solid #1e293b", padding:"8px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        {/* Logo */}
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <img src="/logo-sm.png" alt="MENA.Watch" style={{ height:36, width:"auto" }} />
        </a>

        {/* Breaking news ticker */}
        <div style={{ flex:1, minWidth:0, maxWidth:600, background:"#0f172a", borderRadius:6, padding:"4px 12px", border:"1px solid #1e293b", overflow:"hidden", whiteSpace:"nowrap" }}>
          <span style={{ color:"#ef4444", fontWeight:700, marginLeft:8 }}>عاجل</span>
          <span style={{ color:"#94a3b8", fontSize:12 }}>مجلس الأمن يعقد جلسة طارئة حول الأوضاع في البحر الأحمر</span>
        </div>

        {/* Metrics */}
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          {[{l:"الرياض",v:"7:43"},{l:"USD/SAR",v:"3.751"},{l:"برنت",v:"$82.1"},{l:"تاسي",v:"12,847"}].map(m=>(
            <div key={m.l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:10, color:"#94a3b8" }}>{m.l}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{m.v}</div>
            </div>
          ))}
          <Clock />
        </div>
      </div>

      {/* ── LAYER TABS ── */}
      <div style={{ background:"#0a1628", borderBottom:"1px solid #1e293b", padding:"0 16px", display:"flex", alignItems:"center", gap:4, overflowX:"auto" }}>
        <span style={{ fontSize:11, color:"#94a3b8", marginLeft:8 }}>الطبقة:</span>
        {LAYERS.map(l => (
          <button key={l.id} onClick={() => { setActiveLayer(l.id); setSelected(null); }} style={{
            padding:"8px 14px", borderRadius:"6px 6px 0 0", border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
            background: activeLayer===l.id ? l.color+"22" : "transparent",
            color: activeLayer===l.id ? l.color : "#64748b",
            borderBottom: activeLayer===l.id ? `2px solid ${l.color}` : "2px solid transparent",
            transition:"all 0.2s", whiteSpace:"nowrap",
          }}>
            {l.icon} {l.ar}
          </button>
        ))}
        <div style={{ marginRight:"auto", padding:"8px 0" }}>
          <button onClick={() => window.location.href='/ops'} style={{ background:"#1e293b", border:"1px solid #334155", color:"#94a3b8", padding:"4px 12px", borderRadius:6, fontSize:11, cursor:"pointer" }}>
            ▶ وضع غرفة العمليات
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ display:"flex", flex:1, minHeight:0, overflow:"hidden" }}>

        {/* LEFT SIDEBAR */}
        <div style={{ width:280, background:"#0a1628", borderLeft:"1px solid #1e293b", display:"flex", flexDirection:"column", overflowY:"auto", flexShrink:0 }}>

          {/* Layer info */}
          <div style={{ padding:"12px 14px", borderBottom:"1px solid #1e293b" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:20 }}>{layer.icon}</span>
              <span style={{ fontWeight:700, color:layer.color }}>{layer.ar}</span>
            </div>
            <div style={{ fontSize:11, color:"#94a3b8" }}>{layer.desc}</div>
          </div>

          {/* Top threats (security) */}
          {activeLayer === "security" && (
            <div style={{ padding:"10px 14px", borderBottom:"1px solid #1e293b" }}>
              <div style={{ fontSize:11, color:"#ef4444", fontWeight:700, marginBottom:8 }}>🔴 أعلى المناطق خطورة:</div>
              {topThreats.map(t => (
                <div key={t.id} onClick={() => setSelected(t)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 0", cursor:"pointer", borderBottom:"1px solid #0f172a" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{t.name}</div>
                    <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>{t.detail.substring(0,40)}...</div>
                  </div>
                  <div style={{ width:34, height:34, borderRadius:"50%", border:`2px solid ${riskColor(t.risk)}`, display:"flex", alignItems:"center", justifyContent:"center", color:riskColor(t.risk), fontWeight:700, fontSize:13 }}>
                    {t.risk}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Spots list — fills remaining sidebar space */}
          <div style={{ padding:"10px 14px", flex:1, minHeight:0, overflowY:"auto" }}>
            <div style={{ fontSize:11, color:"#94a3b8", marginBottom:8 }}>● {spots.length} نقطة رصد نشطة</div>
            {spots.map(s => (
              <div key={s.id} onClick={() => setSelected(s)} style={{
                padding:"8px 10px", marginBottom:6, borderRadius:8, cursor:"pointer",
                background: selected?.id===s.id ? layer.color+"22" : "#0f172a",
                border: `1px solid ${selected?.id===s.id ? layer.color+"66" : "#1e293b"}`,
                transition:"all 0.2s",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{s.name}</span>
                  <span style={{ fontSize:12, color:riskColor(s.risk), fontWeight:700 }}>{s.risk} {s.trend}</span>
                </div>
                <div style={{ fontSize:11, color:"#94a3b8", marginTop:3 }}>{s.detail.substring(0,45)}...</div>
              </div>
            ))}
          </div>
        </div>

        {/* MAP + BROADCAST PANEL (70/30 split) */}
        <div style={{ flex:1, display:"flex", minHeight:0 }}>
          {/* MAP 70% */}
          <div style={{ flex:7, position:"relative", minWidth:0 }}>
            <div ref={mapRef} style={{ width:"100%", height:"100%" }} />

            {/* Risk legend — bottom-left of map (original position) */}
            <div style={{ position:"absolute", bottom:20, left:20, background:"#0a162899", backdropFilter:"blur(10px)", border:"1px solid #1e293b", borderRadius:10, padding:"10px 14px", zIndex:1000 }}>
              <div style={{ fontSize:10, color:"#94a3b8", marginBottom:6 }}>مستوى المخاطر</div>
              {[{c:"#ef4444",l:"مرتفع +70"},{c:"#f59e0b",l:"متوسط 45-69"},{c:"#3b82f6",l:"منخفض 20-44"},{c:"#10b981",l:"مستقر 0-19"}].map(r=>(
                <div key={r.l} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:r.c }} />
                  <span style={{ fontSize:10, color:"#94a3b8" }}>{r.l}</span>
                </div>
              ))}
            </div>

            {/* NEWS BOX — bottom-right of map */}
            {showNews ? (
              <div style={{
                position:"absolute", bottom:20, right:20,
                width:300, height:240,
                background:"#0a1628ee", backdropFilter:"blur(12px)",
                border:"1px solid #1e293b", borderRadius:10,
                zIndex:1000, overflow:"hidden",
                display:"flex", flexDirection:"column",
                direction:"rtl",
              }}>
                {/* Close button overlaid on top-left */}
                <button onClick={() => setShowNews(false)} style={{
                  position:"absolute", top:6, left:8, zIndex:10,
                  background:"#1e293b", border:"1px solid #334155", color:"#94a3b8", fontSize:12,
                  cursor:"pointer", padding:"2px 6px", lineHeight:1, borderRadius:4,
                }}>✕</button>
                {/* News content with visible scrollbar */}
                <div style={{ flex:1, overflow:"auto" }}>
                  <Suspense fallback={<div style={{ padding:14, color:"#94a3b8", fontSize:11 }}>جارٍ تحميل الأخبار...</div>}>
                    <NewsTicker />
                  </Suspense>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowNews(true)} style={{
                position:"absolute", bottom:20, right:20, zIndex:1000,
                background:"#0a1628ee", backdropFilter:"blur(12px)",
                border:"1px solid #1e293b", borderRadius:8,
                padding:"8px 14px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:6,
                direction:"rtl",
              }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", animation:"pulse-dot 2s infinite" }} />
                <span style={{ fontSize:11, fontWeight:600, color:"#e2e8f0" }}>آخر الأخبار</span>
              </button>
            )}
          </div>

          {/* LIVE BROADCAST PANEL + SENTIMENT 30% */}
          <div style={{ flex:3, minWidth:280, maxWidth:420, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ flex:1, minHeight:0, overflowY:"auto" }}>
              <LiveBroadcastPanel />
              <div style={{ borderTop:"1px solid #1e293b" }}>
                <Suspense fallback={<div style={{ padding:12, color:"#94a3b8", fontSize:11 }}>جارٍ التحليل...</div>}>
                  <SentimentWidget />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — selected spot */}
        {selected && (
          <div style={{ width:320, background:"#0a1628", borderRight:"1px solid #1e293b", overflowY:"auto", flexShrink:0 }}>
            <div style={{ padding:"14px 16px", borderBottom:"1px solid #1e293b", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>{selected.name}</div>
                <div style={{ fontSize:12, color:riskColor(selected.risk) }}>{riskLabel(selected.risk)} — {selected.risk}/100 {selected.trend}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer" }}>✕</button>
            </div>

            <div style={{ padding:"14px 16px" }}>
              <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:8, padding:"10px 12px", marginBottom:14, fontSize:13, color:"#94a3b8", lineHeight:1.7 }}>
                {selected.detail}
              </div>

              {/* Risk meter */}
              <div style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:11, color:"#94a3b8" }}>مؤشر الخطر</span>
                  <span style={{ fontSize:11, color:riskColor(selected.risk) }}>{selected.risk}%</span>
                </div>
                <div style={{ height:6, background:"#1e293b", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${selected.risk}%`, background:riskColor(selected.risk), borderRadius:3, transition:"width 0.5s" }} />
                </div>
              </div>

              <button onClick={() => getAIAnalysis(selected)} disabled={loadingAI} style={{
                width:"100%", padding:"10px 0", borderRadius:8, border:"none", cursor:"pointer",
                background: loadingAI ? "#1e293b" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color:"#fff", fontWeight:700, fontSize:13, marginBottom:14,
                opacity: loadingAI ? 0.7 : 1,
              }}>
                {loadingAI ? "⏳ جارٍ التحليل..." : "🔍 تحليل Claude AI"}
              </button>

              {analysis && (
                <div style={{ background:"#0f172a", border:"1px solid #6366f133", borderRadius:8, padding:"12px 14px" }}>
                  <div style={{ fontSize:11, color:"#6366f1", fontWeight:700, marginBottom:8 }}>● التحليل المُركَّب — Claude AI</div>
                  <div style={{ fontSize:12, color:"#cbd5e1", lineHeight:1.9, whiteSpace:"pre-wrap" }}>{analysis}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── FLOATING CTA POPUP — auto-dismiss 20s ── */}
      <style>{`
        @keyframes cta-slide-in { 0%{transform:translateY(100px);opacity:0} 100%{transform:translateY(0);opacity:1} }
        @keyframes cta-progress { 0%{width:100%} 100%{width:0%} }
      `}</style>
      {showCta && !ctaDismissed && !showRegister && (
        <div style={{
          position:"fixed", bottom:20, right:20, zIndex:2000,
          background:"linear-gradient(135deg,#1a1a2e,#16213e)",
          border:"1px solid #f59e0b55", borderRadius:14,
          padding:"14px 18px", width:260,
          boxShadow:"0 8px 32px #f59e0b22, 0 4px 16px #0006",
          animation:"cta-slide-in 0.4s ease-out", direction:"rtl",
        }}>
          <button onClick={dismissCta} style={{ position:"absolute", top:8, left:8, background:"none", border:"none", color:"#64748b", fontSize:14, cursor:"pointer", padding:4, lineHeight:1 }}>✕</button>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#f59e0b,#ef4444)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>📩</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>التقرير الصباحي</div>
              <div style={{ fontSize:10, color:"#94a3b8" }}>تحليلات يومية + تنبيهات فورية</div>
            </div>
          </div>
          <button onClick={() => { setShowCta(false); setShowRegister(true); }} style={{ width:"100%", padding:"8px 0", borderRadius:8, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#f59e0b,#ef4444)", color:"#fff", fontWeight:700, fontSize:12 }}>
            سجّل مجاناً الآن
          </button>
          <div style={{ marginTop:8, height:2, background:"#1e293b", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", background:"#f59e0b", animation:"cta-progress 20s linear forwards", borderRadius:2 }} />
          </div>
        </div>
      )}

      {/* Register modal */}
      {showRegister && (
        <div style={{ position:"fixed", inset:0, background:"#000a", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
          <div style={{ background:"#0f172a", border:"1px solid #334155", borderRadius:14, padding:32, width:360, textAlign:"center" }}>
            <img src="/logo-md.png" alt="MENA.Watch" style={{ height:60, width:"auto", marginBottom:8 }} />
            <div style={{ fontSize:18, fontWeight:700, color:"#fff", marginBottom:8 }}>سجل في MENA Watch</div>
            <div style={{ fontSize:12, color:"#94a3b8", marginBottom:20 }}>تقارير يومية + تنبيهات فورية + تحليلات Claude AI</div>
            <input placeholder="بريدك الإلكتروني" style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #334155", background:"#1e293b", color:"#e2e8f0", marginBottom:12, boxSizing:"border-box", textAlign:"right", fontSize:13 }} />
            <button style={{ width:"100%", padding:"10px 0", borderRadius:8, border:"none", background:"linear-gradient(135deg,#ef4444,#f59e0b)", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", marginBottom:8 }}>
              ابدأ مجاناً
            </button>
            <button onClick={() => setShowRegister(false)} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:12 }}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}
