"use client";
import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
//  MENA Watch — MediaSourcesAdmin
//  Manages all media sources: TV channels, RSS feeds, news agencies
//  Persists to localStorage (no Supabase dependency)
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = "menawatch_media_sources";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap";

// ── Default sources ───────────────────────────────────────────
const DEFAULT_SOURCES = [
  // TV Channels
  { id: "alarabiya", name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", nameEn: "Al Arabiya", type: "tv", channelId: "UCahpxixMCwoANAftn6IxkTg", url: "", category: "main", enabled: true, priority: "primary" },
  { id: "alhadath", name: "\u0627\u0644\u062d\u062f\u062b", nameEn: "Al Hadath", type: "tv", channelId: "UCrj5BGAhtWxDfqbza9T9hqA", url: "", category: "main", enabled: true, priority: "primary" },
  { id: "ekhbariya", name: "\u0627\u0644\u0625\u062e\u0628\u0627\u0631\u064a\u0629", nameEn: "Saudi Ekhbariya", type: "tv", channelId: "UCV01ajGl6nt09h40iDoHDNg", url: "", category: "main", enabled: true, priority: "primary" },
  { id: "aljazeera", name: "\u0627\u0644\u062c\u0632\u064a\u0631\u0629", nameEn: "Al Jazeera", type: "tv", channelId: "UCfiwzLy-8yKzIbsmZTzxDgw", url: "", category: "political", enabled: true, priority: "primary" },
  { id: "aje", name: "\u0627\u0644\u062c\u0632\u064a\u0631\u0629 English", nameEn: "Al Jazeera English", type: "tv", channelId: "UCNye-wNBqNL5ZzHSJj3l8Bg", url: "", category: "political", enabled: true, priority: "secondary" },
  { id: "france24", name: "\u0641\u0631\u0627\u0646\u0633 24", nameEn: "France 24 Arabic", type: "tv", channelId: "UCdTyuXgmJkG_O8_75eqej-w", url: "", category: "political", enabled: true, priority: "secondary" },
  { id: "dw", name: "DW \u0639\u0631\u0628\u064a\u0629", nameEn: "DW Arabic", type: "tv", channelId: "UC30ditU5JI16o5NbFsHde_Q", url: "", category: "political", enabled: true, priority: "secondary" },
  // RSS Feeds
  { id: "spa", name: "\u0648\u0643\u0627\u0644\u0629 \u0627\u0644\u0623\u0646\u0628\u0627\u0621 \u0627\u0644\u0633\u0639\u0648\u062f\u064a\u0629", nameEn: "SPA", type: "rss", channelId: "", url: "https://www.spa.gov.sa/rss", category: "saudi", enabled: true, priority: "primary" },
  { id: "ummalqura", name: "\u062c\u0631\u064a\u062f\u0629 \u0623\u0645 \u0627\u0644\u0642\u0631\u0649", nameEn: "Um Al-Qura", type: "rss", channelId: "", url: "https://www.uqn.gov.sa/rss", category: "saudi", enabled: true, priority: "primary" },
  { id: "aleqt", name: "\u0627\u0644\u0627\u0642\u062a\u0635\u0627\u062f\u064a\u0629", nameEn: "Al Eqtisadiah", type: "rss", channelId: "", url: "https://www.aleqt.com/rss", category: "economy", enabled: true, priority: "secondary" },
  { id: "argaam", name: "\u0623\u0631\u0642\u0627\u0645", nameEn: "Argaam", type: "rss", channelId: "", url: "https://www.argaam.com/rss", category: "economy", enabled: true, priority: "secondary" },
  { id: "ain", name: "\u0639\u064a\u0646 \u0627\u0644\u0625\u062e\u0628\u0627\u0631\u064a\u0629", nameEn: "Ain News", type: "rss", channelId: "", url: "https://www.ain.sa/rss", category: "saudi", enabled: true, priority: "secondary" },
  { id: "okaz", name: "\u0639\u0643\u0627\u0638", nameEn: "Okaz", type: "rss", channelId: "", url: "https://www.okaz.com.sa/rss", category: "saudi", enabled: true, priority: "secondary" },
  { id: "alriyadh", name: "\u0627\u0644\u0631\u064a\u0627\u0636", nameEn: "Al Riyadh", type: "rss", channelId: "", url: "https://www.alriyadh.com/rss", category: "saudi", enabled: true, priority: "secondary" },
  { id: "arabnews", name: "\u0639\u0631\u0628 \u0646\u064a\u0648\u0632", nameEn: "Arab News", type: "rss", channelId: "", url: "https://www.arabnews.com/rss", category: "saudi", enabled: true, priority: "secondary" },
  { id: "techcrunch", name: "\u062a\u0643 \u0643\u0631\u0646\u0634", nameEn: "TechCrunch", type: "rss", channelId: "", url: "https://techcrunch.com/feed/", category: "tech", enabled: true, priority: "secondary" },
  { id: "aitnews", name: "\u0627\u0644\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0644\u0644\u0623\u062e\u0628\u0627\u0631 \u0627\u0644\u062a\u0642\u0646\u064a\u0629", nameEn: "AIT News", type: "rss", channelId: "", url: "https://www.aitnews.com/feed/", category: "tech", enabled: true, priority: "secondary" },
];

// ── Category config ───────────────────────────────────────────
const CATEGORIES = {
  main:      { label: "\u0631\u0626\u064a\u0633\u064a", color: "#3b82f6" },
  political: { label: "\u0633\u064a\u0627\u0633\u064a", color: "#a855f7" },
  saudi:     { label: "\u0633\u0639\u0648\u062f\u064a", color: "#22c55e" },
  economy:   { label: "\u0627\u0642\u062a\u0635\u0627\u062f\u064a", color: "#f59e0b" },
  energy:    { label: "\u0637\u0627\u0642\u0629", color: "#ef4444" },
  tech:      { label: "\u062a\u0642\u0646\u064a", color: "#06b6d4" },
};

const TYPE_LABELS = { tv: "\u0642\u0646\u0627\u0629 \u062a\u0644\u0641\u0632\u064a\u0648\u0646\u064a\u0629", rss: "\u0645\u0635\u062f\u0631 RSS" };

// ── Colour tokens (MENA.Watch dark theme) ─────────────────────
const C = {
  bgDeep:    "#060d18",
  bgPanel:   "#0a1628",
  border:    "#1e293b",
  borderLight: "#334155",
  surface:   "#0f1d32",
  surfaceHover: "#162544",
  accent:    "#3b82f6",
  green:     "#22c55e",
  red:       "#ef4444",
  gold:      "#f59e0b",
  silver:    "#94a3b8",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  white:     "#ffffff",
};

// ═══════════════════════════════════════════════════════════════
//  Utility Components
// ═══════════════════════════════════════════════════════════════

function Toggle({ value, onChange, size = "default" }) {
  const w = size === "small" ? 34 : 40;
  const h = size === "small" ? 18 : 22;
  const dot = size === "small" ? 12 : 16;
  const pad = size === "small" ? 3 : 3;
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: w, height: h, borderRadius: h / 2, cursor: "pointer",
        transition: "all 0.3s ease",
        background: value ? C.green : "#1e293b",
        border: `1px solid ${value ? C.green : C.borderLight}`,
        position: "relative", flexShrink: 0,
      }}
    >
      <div style={{
        width: dot, height: dot, borderRadius: "50%", background: C.white,
        position: "absolute", top: pad,
        transition: "all 0.3s ease",
        left: value ? w - dot - pad - 2 : pad,
      }} />
    </div>
  );
}

function Badge({ label, color, small }) {
  return (
    <span style={{
      display: "inline-block",
      padding: small ? "1px 6px" : "2px 10px",
      borderRadius: 4,
      fontSize: small ? 9 : 10,
      fontWeight: 600,
      letterSpacing: 0.5,
      background: `${color}20`,
      color: color,
      border: `1px solid ${color}40`,
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const isPrimary = priority === "primary";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
      background: isPrimary ? "rgba(245,158,11,0.15)" : "rgba(148,163,184,0.1)",
      color: isPrimary ? C.gold : C.silver,
      border: `1px solid ${isPrimary ? "rgba(245,158,11,0.3)" : "rgba(148,163,184,0.2)"}`,
    }}>
      {isPrimary ? "\u2605" : "\u2606"} {isPrimary ? "\u0623\u0633\u0627\u0633\u064a" : "\u062b\u0627\u0646\u0648\u064a"}
    </span>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 100, background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 8, padding: "12px 16px", textAlign: "center",
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || C.textPrimary }}>{value}</div>
      <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", mono = false, style: extraStyle = {} }) {
  return (
    <div style={{ flex: 1, ...extraStyle }}>
      {label && (
        <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4, letterSpacing: 0.5 }}>
          {label}
        </label>
      )}
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", background: C.bgDeep, border: `1px solid ${C.border}`,
          borderRadius: 5, padding: "8px 12px", color: C.textPrimary, fontSize: 12,
          fontFamily: mono ? "'Courier New', monospace" : "inherit",
          outline: "none", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, style: extraStyle = {} }) {
  return (
    <div style={{ flex: 1, ...extraStyle }}>
      {label && (
        <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4, letterSpacing: 0.5 }}>
          {label}
        </label>
      )}
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", background: C.bgDeep, border: `1px solid ${C.border}`,
          borderRadius: 5, padding: "8px 12px", color: C.textPrimary, fontSize: 12,
          outline: "none", cursor: "pointer", boxSizing: "border-box",
          appearance: "none", WebkitAppearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left 10px center",
          paddingLeft: 28,
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled = false, style: extraStyle = {} }) {
  const styles = {
    primary: { background: C.accent, color: C.white, border: "none" },
    success: { background: C.green, color: C.white, border: "none" },
    danger:  { background: "transparent", color: C.red, border: `1px solid ${C.red}40` },
    ghost:   { background: "transparent", color: C.textSecondary, border: `1px solid ${C.border}` },
  };
  const s = styles[variant] || styles.primary;
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        ...s,
        padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
//  Add / Edit Source Form
// ═══════════════════════════════════════════════════════════════

const EMPTY_FORM = {
  id: "", name: "", nameEn: "", type: "tv", channelId: "", url: "",
  category: "main", priority: "primary", enabled: true,
};

function SourceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { ...EMPTY_FORM });
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const isValid = form.name.trim() && form.nameEn.trim() &&
    (form.type === "tv" ? form.channelId.trim() : form.url.trim());

  const handleSave = () => {
    const finalId = form.id || form.nameEn.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20) + "_" + Date.now();
    onSave({ ...form, id: finalId });
  };

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.accent}40`, borderRadius: 8,
      padding: 20, marginBottom: 16,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 16 }}>
        {initial ? "\u062a\u0639\u062f\u064a\u0644 \u0627\u0644\u0645\u0635\u062f\u0631" : "\u0625\u0636\u0627\u0641\u0629 \u0645\u0635\u062f\u0631 \u062c\u062f\u064a\u062f"}
      </div>

      {/* Row 1: Type + Names */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <Select
          label={"\u0627\u0644\u0646\u0648\u0639"}
          value={form.type}
          onChange={(v) => set("type", v)}
          options={[
            { value: "tv", label: "\ud83d\udcfa \u0642\u0646\u0627\u0629 \u062a\u0644\u0641\u0632\u064a\u0648\u0646\u064a\u0629" },
            { value: "rss", label: "\ud83d\udcf0 \u0645\u0635\u062f\u0631 RSS" },
          ]}
          style={{ maxWidth: 180 }}
        />
        <Input label={"\u0627\u0644\u0627\u0633\u0645 (\u0639\u0631\u0628\u064a)"} value={form.name} onChange={(v) => set("name", v)} placeholder={"\u0627\u0644\u0639\u0631\u0628\u064a\u0629"} />
        <Input label={"Name (EN)"} value={form.nameEn} onChange={(v) => set("nameEn", v)} placeholder={"Al Arabiya"} />
      </div>

      {/* Row 2: Channel ID / URL */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        {form.type === "tv" ? (
          <Input label={"Channel ID (YouTube)"} value={form.channelId} onChange={(v) => set("channelId", v)} placeholder={"UCxxxxxxxxxxxx"} mono />
        ) : (
          <Input label={"RSS URL"} value={form.url} onChange={(v) => set("url", v)} placeholder={"https://example.com/rss"} mono />
        )}
        <Select
          label={"\u0627\u0644\u062a\u0635\u0646\u064a\u0641"}
          value={form.category}
          onChange={(v) => set("category", v)}
          options={Object.entries(CATEGORIES).map(([k, v]) => ({ value: k, label: v.label }))}
          style={{ maxWidth: 160 }}
        />
        <Select
          label={"\u0627\u0644\u0623\u0648\u0644\u0648\u064a\u0629"}
          value={form.priority}
          onChange={(v) => set("priority", v)}
          options={[
            { value: "primary", label: "\u2605 \u0623\u0633\u0627\u0633\u064a" },
            { value: "secondary", label: "\u2606 \u062b\u0627\u0646\u0648\u064a" },
          ]}
          style={{ maxWidth: 140 }}
        />
      </div>

      {/* Row 3: Actions */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onCancel}>{"\u0625\u0644\u063a\u0627\u0621"}</Btn>
        <Btn variant="success" onClick={handleSave} disabled={!isValid}>
          {initial ? "\u062a\u062d\u062f\u064a\u062b" : "\u0625\u0636\u0627\u0641\u0629"}
        </Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  Delete Confirmation Dialog
// ═══════════════════════════════════════════════════════════════

function DeleteConfirm({ source, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: "rtl",
    }}>
      <div style={{
        background: C.bgPanel, border: `1px solid ${C.red}40`, borderRadius: 12,
        padding: 24, maxWidth: 400, width: "90%",
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.red, marginBottom: 12 }}>
          {"\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u062d\u0630\u0641"}
        </div>
        <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 20, lineHeight: 1.6 }}>
          {"\u0647\u0644 \u0623\u0646\u062a \u0645\u062a\u0623\u0643\u062f \u0645\u0646 \u062d\u0630\u0641 \u0627\u0644\u0645\u0635\u062f\u0631"}{" "}
          <strong style={{ color: C.textPrimary }}>{source.name}</strong>
          {" "}({source.nameEn}){"\u061f"}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-start" }}>
          <Btn variant="danger" onClick={onConfirm}>{"\u062d\u0630\u0641 \u0646\u0647\u0627\u0626\u064a\u0627\u064b"}</Btn>
          <Btn variant="ghost" onClick={onCancel}>{"\u0625\u0644\u063a\u0627\u0621"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════════════════════════════

export default function MediaSourcesAdmin() {
  // ── State ──
  const [sources, setSources] = useState([]);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  // ── Load from localStorage on mount ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSources(parsed);
          return;
        }
      }
    } catch (e) {
      // ignore parse errors
    }
    setSources(DEFAULT_SOURCES.map((s) => ({ ...s })));
  }, []);

  // ── Toast helper ──
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── CRUD operations ──
  const handleToggle = (id) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
    setHasUnsaved(true);
  };

  const handleAddSource = (newSource) => {
    setSources((prev) => [...prev, newSource]);
    setShowForm(false);
    setHasUnsaved(true);
    showToast(`\u062a\u0645\u062a \u0625\u0636\u0627\u0641\u0629 ${newSource.name}`);
  };

  const handleEditSource = (updated) => {
    setSources((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditingSource(null);
    setHasUnsaved(true);
    showToast(`\u062a\u0645 \u062a\u062d\u062f\u064a\u062b ${updated.name}`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setSources((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
    setHasUnsaved(true);
    showToast(`\u062a\u0645 \u062d\u0630\u0641 ${deleteTarget.name}`, "error");
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
      setHasUnsaved(false);
      showToast("\u062a\u0645 \u062d\u0641\u0638 \u0627\u0644\u062a\u063a\u064a\u064a\u0631\u0627\u062a \u0628\u0646\u062c\u0627\u062d");
    } catch (e) {
      showToast("\u062e\u0637\u0623 \u0641\u064a \u0627\u0644\u062d\u0641\u0638", "error");
    }
  };

  const handleReset = () => {
    setSources(DEFAULT_SOURCES.map((s) => ({ ...s })));
    setHasUnsaved(true);
    showToast("\u062a\u0645 \u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0636\u0628\u0637 \u0644\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a\u0629");
  };

  // ── Export / Import ──
  const handleExport = () => {
    const json = JSON.stringify(sources, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `menawatch-sources-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("\u062a\u0645 \u062a\u0635\u062f\u064a\u0631 \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a");
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data) && data.length > 0 && data[0].id && data[0].type) {
          setSources(data);
          setHasUnsaved(true);
          showToast(`\u062a\u0645 \u0627\u0633\u062a\u064a\u0631\u0627\u062f ${data.length} \u0645\u0635\u062f\u0631`);
        } else {
          showToast("\u0645\u0644\u0641 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d", "error");
        }
      } catch {
        showToast("\u062e\u0637\u0623 \u0641\u064a \u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0645\u0644\u0641", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ── Filtering ──
  const filtered = sources.filter((s) => {
    if (filterType !== "all" && s.type !== filterType) return false;
    if (filterCategory !== "all" && s.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.nameEn.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // ── Stats ──
  const stats = {
    total: sources.length,
    enabled: sources.filter((s) => s.enabled).length,
    disabled: sources.filter((s) => !s.enabled).length,
    tv: sources.filter((s) => s.type === "tv").length,
    rss: sources.filter((s) => s.type === "rss").length,
  };

  // ── Render ──
  return (
    <>
      {/* Font + global style */}
      <link rel="stylesheet" href={FONT_URL} />
      <style>{`
        .msa-root * { box-sizing: border-box; }
        .msa-root ::-webkit-scrollbar { width: 6px; height: 6px; }
        .msa-root ::-webkit-scrollbar-track { background: ${C.bgDeep}; }
        .msa-root ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        .msa-row:hover { background: ${C.surfaceHover} !important; }
        @keyframes msaToastIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div className="msa-root" style={{
        direction: "rtl",
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        color: C.textPrimary,
        background: C.bgPanel,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 24,
        position: "relative",
      }}>
        {/* ── Toast Notification ── */}
        {toast && (
          <div style={{
            position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10000,
            background: toast.type === "error" ? C.red : C.green,
            color: C.white, padding: "10px 24px", borderRadius: 8,
            fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            animation: "msaToastIn 0.3s ease",
            fontFamily: "'IBM Plex Sans Arabic', sans-serif",
          }}>
            {toast.msg}
          </div>
        )}

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.textPrimary, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>{"\ud83d\udce1"}</span>
              {"\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0635\u0627\u062f\u0631 \u0627\u0644\u0625\u0639\u0644\u0627\u0645\u064a\u0629"}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: C.textMuted }}>
              {"\u0625\u062f\u0627\u0631\u0629 \u0642\u0646\u0648\u0627\u062a \u0627\u0644\u062a\u0644\u0641\u0632\u064a\u0648\u0646 \u0648\u0645\u0635\u0627\u062f\u0631 RSS \u0648\u0648\u0643\u0627\u0644\u0627\u062a \u0627\u0644\u0623\u0646\u0628\u0627\u0621"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn variant="ghost" onClick={handleExport}>{"\u2b07 \u062a\u0635\u062f\u064a\u0631 JSON"}</Btn>
            <Btn variant="ghost" onClick={() => fileInputRef.current?.click()}>{"\u2b06 \u0627\u0633\u062a\u064a\u0631\u0627\u062f"}</Btn>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
            <Btn variant="ghost" onClick={handleReset}>{"\u21ba \u0625\u0639\u0627\u062f\u0629 \u0636\u0628\u0637"}</Btn>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <StatCard label={"\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u0635\u0627\u062f\u0631"} value={stats.total} color={C.accent} />
          <StatCard label={"\u0645\u0641\u0639\u0651\u0644"} value={stats.enabled} color={C.green} />
          <StatCard label={"\u0645\u0639\u0637\u0651\u0644"} value={stats.disabled} color={C.red} />
          <StatCard label={"\u0642\u0646\u0648\u0627\u062a \u062a\u0644\u0641\u0632\u064a\u0648\u0646"} value={stats.tv} color="#a855f7" />
          <StatCard label={"\u0645\u0635\u0627\u062f\u0631 RSS"} value={stats.rss} color="#f59e0b" />
        </div>

        {/* ── Filter Tabs ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {/* Type filters */}
          {[
            { key: "all", label: "\u0627\u0644\u0643\u0644" },
            { key: "tv", label: "\ud83d\udcfa \u0642\u0646\u0648\u0627\u062a" },
            { key: "rss", label: "\ud83d\udcf0 \u0645\u0635\u0627\u062f\u0631 RSS" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              style={{
                padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: filterType === tab.key ? C.accent : "transparent",
                color: filterType === tab.key ? C.white : C.textSecondary,
                border: `1px solid ${filterType === tab.key ? C.accent : C.border}`,
                transition: "all 0.2s",
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              }}
            >
              {tab.label}
            </button>
          ))}

          {/* Separator */}
          <div style={{ width: 1, height: 24, background: C.border, margin: "0 4px" }} />

          {/* Category filters */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 5,
              padding: "6px 12px", color: C.textSecondary, fontSize: 11,
              outline: "none", cursor: "pointer",
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
            }}
          >
            <option value="all">{"\u0643\u0644 \u0627\u0644\u062a\u0635\u0646\u064a\u0641\u0627\u062a"}</option>
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          {/* Search */}
          <div style={{ flex: 1, minWidth: 160, position: "relative" }}>
            <input
              type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={"\ud83d\udd0d \u0628\u062d\u062b \u0628\u0627\u0644\u0627\u0633\u0645..."}
              style={{
                width: "100%", background: C.bgDeep, border: `1px solid ${C.border}`,
                borderRadius: 5, padding: "6px 12px", color: C.textPrimary, fontSize: 12,
                outline: "none", fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              }}
            />
          </div>

          {/* Add button */}
          <Btn onClick={() => { setShowForm(true); setEditingSource(null); }}>
            {"+ \u0625\u0636\u0627\u0641\u0629 \u0645\u0635\u062f\u0631"}
          </Btn>
        </div>

        {/* ── Add / Edit Form ── */}
        {showForm && !editingSource && (
          <SourceForm onSave={handleAddSource} onCancel={() => setShowForm(false)} />
        )}
        {editingSource && (
          <SourceForm initial={editingSource} onSave={handleEditSource} onCancel={() => setEditingSource(null)} />
        )}

        {/* ── Table ── */}
        <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${C.border}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ background: C.bgDeep }}>
                {[
                  { label: "\u0627\u0644\u062d\u0627\u0644\u0629", w: 70 },
                  { label: "\u0627\u0644\u0627\u0633\u0645 (\u0639\u0631\u0628\u064a)", w: null },
                  { label: "Name (EN)", w: null },
                  { label: "\u0627\u0644\u0646\u0648\u0639", w: 110 },
                  { label: "\u0627\u0644\u062a\u0635\u0646\u064a\u0641", w: 90 },
                  { label: "\u0627\u0644\u0623\u0648\u0644\u0648\u064a\u0629", w: 90 },
                  { label: "\u0625\u062c\u0631\u0627\u0621\u0627\u062a", w: 100 },
                ].map((col, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "10px 12px", fontSize: 10, fontWeight: 600, color: C.textMuted,
                      textAlign: "right", borderBottom: `1px solid ${C.border}`,
                      letterSpacing: 0.5, whiteSpace: "nowrap",
                      width: col.w || "auto",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{
                    padding: 40, textAlign: "center", color: C.textMuted, fontSize: 13,
                  }}>
                    {"\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0635\u0627\u062f\u0631 \u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0644\u0641\u0644\u0627\u062a\u0631"}
                  </td>
                </tr>
              )}
              {filtered.map((source) => {
                const catCfg = CATEGORIES[source.category] || { label: source.category, color: C.textMuted };
                return (
                  <tr key={source.id} className="msa-row" style={{ transition: "background 0.15s" }}>
                    {/* Toggle */}
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}08`, textAlign: "center" }}>
                      <Toggle value={source.enabled} onChange={() => handleToggle(source.id)} size="small" />
                    </td>
                    {/* Name AR */}
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}08` }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: source.enabled ? C.textPrimary : C.textMuted }}>
                        {source.name}
                      </div>
                    </td>
                    {/* Name EN */}
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}08` }}>
                      <div style={{ fontSize: 12, color: source.enabled ? C.textSecondary : C.textMuted, fontFamily: "sans-serif" }}>
                        {source.nameEn}
                      </div>
                    </td>
                    {/* Type */}
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}08` }}>
                      <Badge
                        label={source.type === "tv" ? "\ud83d\udcfa \u062a\u0644\u0641\u0632\u064a\u0648\u0646" : "\ud83d\udcf0 RSS"}
                        color={source.type === "tv" ? "#a855f7" : "#f59e0b"}
                      />
                    </td>
                    {/* Category */}
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}08` }}>
                      <Badge label={catCfg.label} color={catCfg.color} small />
                    </td>
                    {/* Priority */}
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}08` }}>
                      <PriorityBadge priority={source.priority} />
                    </td>
                    {/* Actions */}
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}08` }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => { setEditingSource(source); setShowForm(false); }}
                          title={"\u062a\u0639\u062f\u064a\u0644"}
                          style={{
                            width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`,
                            background: "transparent", color: C.textSecondary, cursor: "pointer",
                            fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                        >
                          {"\u270e"}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(source)}
                          title={"\u062d\u0630\u0641"}
                          style={{
                            width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.red}30`,
                            background: "transparent", color: C.red, cursor: "pointer",
                            fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                        >
                          {"\u2715"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Footer: Save Bar ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 16, padding: "12px 16px",
          background: hasUnsaved ? `${C.accent}10` : "transparent",
          border: `1px solid ${hasUnsaved ? C.accent + "40" : C.border}`,
          borderRadius: 8, transition: "all 0.3s",
        }}>
          <div style={{ fontSize: 11, color: C.textMuted }}>
            {hasUnsaved
              ? "\u26a0 \u064a\u0648\u062c\u062f \u062a\u063a\u064a\u064a\u0631\u0627\u062a \u063a\u064a\u0631 \u0645\u062d\u0641\u0648\u0638\u0629"
              : `\u2713 ${sources.length} \u0645\u0635\u062f\u0631 \u2014 \u0622\u062e\u0631 \u062d\u0641\u0638: \u0627\u0644\u0630\u0627\u0643\u0631\u0629 \u0627\u0644\u0645\u062d\u0644\u064a\u0629`}
          </div>
          <Btn variant="success" onClick={handleSave} disabled={!hasUnsaved}>
            {"\u062d\u0641\u0638 \u0627\u0644\u062a\u063a\u064a\u064a\u0631\u0627\u062a"}
          </Btn>
        </div>

        {/* ── Delete Confirmation ── */}
        {deleteTarget && (
          <DeleteConfirm source={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        )}
      </div>
    </>
  );
}
