"use client";
import { useEffect, useRef, useState } from "react";

const RISK_COUNTRIES = [
  { name: "السعودية", code: "SA", risk: 5, lat: 23.885942, lng: 45.079162, events: 5, gdp: "1.06T", capital: "الرياض" },
  { name: "الإمارات", code: "AE", risk: 5, lat: 23.424076, lng: 53.847818, events: 3, gdp: "507B", capital: "أبوظبي" },
  { name: "قطر", code: "QA", risk: 5, lat: 25.354826, lng: 51.183884, events: 2, gdp: "235B", capital: "الدوحة" },
  { name: "الكويت", code: "KW", risk: 5, lat: 29.31166, lng: 47.481766, events: 4, gdp: "135B", capital: "الكويت" },
  { name: "البحرين", code: "BH", risk: 4, lat: 26.0667, lng: 50.5577, events: 6, gdp: "44B", capital: "المنامة" },
  { name: "عمان", code: "OM", risk: 5, lat: 21.512583, lng: 55.923255, events: 3, gdp: "104B", capital: "مسقط" },
  { name: "العراق", code: "IQ", risk: 4, lat: 33.223191, lng: 43.679291, events: 19, gdp: "264B", capital: "بغداد" },
  { name: "إيران", code: "IR", risk: 3, lat: 32.427908, lng: 53.688046, events: 34, gdp: "389B", capital: "طهران" },
  { name: "لبنان", code: "LB", risk: 4, lat: 33.854721, lng: 35.862285, events: 15, gdp: "21B", capital: "بيروت" },
  { name: "سوريا", code: "SY", risk: 3, lat: 34.802075, lng: 38.996815, events: 22, gdp: "60B", capital: "دمشق" },
  { name: "اليمن", code: "YE", risk: 2, lat: 15.552727, lng: 48.516388, events: 47, gdp: "25B", capital: "صنعاء" },
  { name: "مصر", code: "EG", risk: 4, lat: 26.820553, lng: 30.802498, events: 12, gdp: "476B", capital: "القاهرة" },
  { name: "الأردن", code: "JO", risk: 5, lat: 30.585164, lng: 36.238414, events: 4, gdp: "46B", capital: "عمّان" },
  { name: "فلسطين", code: "PS", risk: 1, lat: 31.9522, lng: 35.2332, events: 89, gdp: "18B", capital: "القدس" },
  { name: "السودان", code: "SD", risk: 3, lat: 12.862807, lng: 30.217636, events: 28, gdp: "48B", capital: "الخرطوم" },
  { name: "ليبيا", code: "LY", risk: 3, lat: 26.3351, lng: 17.228331, events: 18, gdp: "53B", capital: "طرابلس" },
];

const RC = r => r<=1?"#7f1d1d":r===2?"#ef4444":r===3?"#f97316":r===4?"#f59e0b":"#22c55e";
const RL = r => r<=1?"حرج":r===2?"عالي":r===3?"متوسط":r===4?"معتدل":"مستقر";

export default function InteractiveMap() {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current?._leaflet_id) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = window.L;
      const map = L.map(mapRef.current, {
        center: [24, 44],
        zoom: 4,
        minZoom: 3,
        maxZoom: 8,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '© CARTO',
        subdomains: "abcd",
      }).addTo(map);

      leafletRef.current = { L, map, markers: [] };
      addMarkers(L, map, "all");
      setMapReady(true);
    };
    document.head.appendChild(script);
  }, []);

  function addMarkers(L, map, filterVal) {
    if (leafletRef.current?.markers) {
      leafletRef.current.markers.forEach(m => m.remove());
      leafletRef.current.markers = [];
    }

    const countries = filterVal === "all" ? RISK_COUNTRIES :
      filterVal === "high" ? RISK_COUNTRIES.filter(c => c.risk <= 3) :
      RISK_COUNTRIES.filter(c => c.risk >= 5);

    countries.forEach(c => {
      const color = RC(c.risk);
      const size = Math.max(16, 8 + c.events * 0.8);
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid ${color}88;box-shadow:0 0 ${size/2}px ${color}66;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff">${c.risk}</div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
      });
      const marker = L.marker([c.lat, c.lng], { icon }).addTo(map);
      marker.on("click", () => setSelected(c));
      leafletRef.current.markers.push(marker);
    });
  }

  const handleFilter = (f) => {
    setFilter(f);
    if (leafletRef.current) {
      const { L, map } = leafletRef.current;
      addMarkers(L, map, f);
    }
  };

  const stats = [1,2,3,4,5].map(r => ({ lvl: r, count: RISK_COUNTRIES.filter(c => c.risk===r).length }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'IBM Plex Sans Arabic',sans-serif", direction: "rtl", background: "#060d18", color: "#e2e8f0" }}>
      {/* Top Bar */}
      <div style={{ padding: "12px 16px", background: "#0a1628", borderBottom: "1px solid #1e293b", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,auto)", gap: 6 }}>
          {stats.map(s => (
            <div key={s.lvl} style={{ background: RC(s.lvl)+"18", border: "1px solid "+RC(s.lvl)+"44", borderRadius: 6, padding: "4px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: RC(s.lvl) }}>{s.count}</div>
              <div style={{ fontSize: 9, color: RC(s.lvl) }}>{RL(s.lvl)}</div>
            </div>
          ))}
        </div>
        <div style={{ marginRight: "auto", display: "flex", gap: 6 }}>
          {[{id:"all",label:"الكل"},{id:"high",label:"🔴 خطر"},{id:"stable",label:"🟢 مستقر"}].map(f => (
            <button key={f.id} onClick={() => handleFilter(f.id)} style={{
              padding: "5px 10px", borderRadius: 5, cursor: "pointer", border: "1px solid",
              fontFamily: "inherit", fontSize: 11,
              background: filter===f.id?"#22c55e22":"#0a1628",
              borderColor: filter===f.id?"#22c55e":"#1e293b",
              color: filter===f.id?"#22c55e":"#64748b",
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div style={{ position: "relative", flex: 1 }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: 400 }} />

        {/* Selected Country Panel */}
        {selected && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "#0a1628ee", border: "1px solid "+RC(selected.risk)+"66", borderRadius: 10, padding: "14px 16px", width: 200, backdropFilter: "blur(8px)", zIndex: 1000 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc" }}>{selected.name}</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{selected.capital} • {selected.code}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "مستوى المخاطر", val: selected.risk+"/5", color: RC(selected.risk) },
                { label: "التصنيف", val: RL(selected.risk), color: RC(selected.risk) },
                { label: "الأحداث", val: selected.events, color: selected.events>20?"#ef4444":selected.events>10?"#f59e0b":"#22c55e" },
                { label: "GDP", val: selected.gdp, color: "#3b82f6" },
              ].map(s => (
                <div key={s.label} style={{ background: "#060d18", borderRadius: 6, padding: "6px 8px" }}>
                  <div style={{ fontSize: 9, color: "#94a3b8" }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ padding: "8px 16px", background: "#080f1c", borderTop: "1px solid #1e293b", display: "flex", gap: 16, alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>مستوى المخاطر:</span>
        {[1,2,3,4,5].map(r => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: RC(r) }} />
            <span style={{ fontSize: 9, color: "#94a3b8" }}>{r} - {RL(r)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
