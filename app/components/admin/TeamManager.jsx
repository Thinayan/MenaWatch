"use client";
import { useState, useEffect } from "react";

const EMPTY_MEMBER = {
  name_ar: "", name_en: "", title_ar: "", title_en: "",
  bio_ar: "", bio_en: "", photo_url: "", linkedin: "", twitter: "", display_order: 0,
};

export default function TeamManager() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_MEMBER);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/team");
      const d = await r.json();
      setMembers(d.members || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleSave = async () => {
    if (!form.name_ar || !form.title_ar) { setMsg("⚠️ الاسم والمسمى الوظيفي مطلوبان"); return; }
    setSaving(true);
    setMsg(null);
    try {
      const method = editId ? "PUT" : "POST";
      const body = editId ? { id: editId, ...form } : form;
      const r = await fetch("/api/admin/team", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (r.ok) {
        setMsg(editId ? "✅ تم التعديل" : "✅ تمت الإضافة");
        setForm(EMPTY_MEMBER);
        setEditId(null);
        fetchMembers();
      } else {
        const d = await r.json();
        setMsg("❌ " + (d.error || "خطأ"));
      }
    } catch (e) { setMsg("❌ خطأ في الاتصال"); }
    setSaving(false);
  };

  const handleEdit = (m) => {
    setEditId(m.id);
    setForm({
      name_ar: m.name_ar || "", name_en: m.name_en || "",
      title_ar: m.title_ar || "", title_en: m.title_en || "",
      bio_ar: m.bio_ar || "", bio_en: m.bio_en || "",
      photo_url: m.photo_url || "", linkedin: m.linkedin || "",
      twitter: m.twitter || "", display_order: m.display_order || 0,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("هل تريد حذف هذا العضو؟")) return;
    try {
      const r = await fetch("/api/admin/team", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (r.ok) fetchMembers();
    } catch {}
  };

  const handleToggleActive = async (m) => {
    try {
      await fetch("/api/admin/team", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id, is_active: !m.is_active }),
      });
      fetchMembers();
    } catch {}
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY_MEMBER); setMsg(null); };

  const inputStyle = {
    width: "100%", padding: "8px 10px", background: "#0a1628", border: "1px solid #1e293b",
    borderRadius: 6, color: "#e2e8f0", fontSize: 12, fontFamily: "inherit",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Form */}
      <div style={{ background: "#080f1c", border: "1px solid #1e293b", borderRadius: 10, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc", marginBottom: 14 }}>
          {editId ? "✏️ تعديل عضو" : "➕ إضافة عضو جديد"}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>الاسم (عربي) *</label>
            <input style={inputStyle} value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} placeholder="الاسم بالعربي" />
          </div>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>الاسم (إنجليزي)</label>
            <input style={inputStyle} value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} placeholder="Name in English" />
          </div>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>المسمى الوظيفي (عربي) *</label>
            <input style={inputStyle} value={form.title_ar} onChange={e => setForm({ ...form, title_ar: e.target.value })} placeholder="المسمى بالعربي" />
          </div>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>المسمى الوظيفي (إنجليزي)</label>
            <input style={inputStyle} value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} placeholder="Title in English" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>النبذة (عربي)</label>
            <textarea style={{ ...inputStyle, height: 60, resize: "vertical" }} value={form.bio_ar} onChange={e => setForm({ ...form, bio_ar: e.target.value })} placeholder="نبذة مختصرة..." />
          </div>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>النبذة (إنجليزي)</label>
            <textarea style={{ ...inputStyle, height: 60, resize: "vertical" }} value={form.bio_en} onChange={e => setForm({ ...form, bio_en: e.target.value })} placeholder="Short bio..." />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px", gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>رابط الصورة</label>
            <input style={inputStyle} value={form.photo_url} onChange={e => setForm({ ...form, photo_url: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>LinkedIn</label>
            <input style={inputStyle} value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>X (تويتر)</label>
            <input style={inputStyle} value={form.twitter} onChange={e => setForm({ ...form, twitter: e.target.value })} placeholder="https://x.com/..." />
          </div>
          <div>
            <label style={{ fontSize: 10, color: "#64748b" }}>الترتيب</label>
            <input type="number" style={inputStyle} value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: "8px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "inherit",
            background: editId ? "#f59e0b" : "#22c55e", color: "#000", fontSize: 12, fontWeight: 700,
            opacity: saving ? 0.6 : 1,
          }}>
            {saving ? "⏳ جاري الحفظ..." : editId ? "💾 حفظ التعديل" : "➕ إضافة"}
          </button>
          {editId && (
            <button onClick={cancelEdit} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #1e293b", background: "transparent", color: "#94a3b8", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              إلغاء
            </button>
          )}
          {msg && <span style={{ fontSize: 11, color: msg.startsWith("✅") ? "#22c55e" : "#ef4444" }}>{msg}</span>}
        </div>
      </div>

      {/* Members List */}
      <div style={{ background: "#080f1c", border: "1px solid #1e293b", borderRadius: 10, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc", marginBottom: 14 }}>
          👥 أعضاء الفريق ({members.length})
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 30, color: "#475569", fontSize: 12 }}>⏳ جاري التحميل...</div>
        ) : members.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30, color: "#475569", fontSize: 12 }}>
            لا يوجد أعضاء بعد. أضف أعضاء الفريق من النموذج أعلاه.
            <div style={{ fontSize: 10, color: "#334155", marginTop: 8 }}>
              ملاحظة: تأكد من تشغيل migrations المرحلة 2 في Supabase أولاً.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {members.map(m => (
              <div key={m.id} style={{
                background: "#0a1628", border: `1px solid ${m.is_active ? "#1e293b" : "#ef444433"}`,
                borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
                opacity: m.is_active ? 1 : 0.5,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: m.photo_url ? `url(${m.photo_url}) center/cover` : "#1e293b",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>
                  {!m.photo_url && "👤"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>
                    {m.name_ar} {m.name_en ? `(${m.name_en})` : ""}
                  </div>
                  <div style={{ fontSize: 10, color: "#22c55e" }}>{m.title_ar}</div>
                  {m.bio_ar && <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{m.bio_ar.slice(0, 80)}...</div>}
                </div>
                <div style={{ fontSize: 10, color: "#475569", flexShrink: 0 }}>#{m.display_order}</div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => handleToggleActive(m)} style={{
                    padding: "4px 8px", borderRadius: 4, border: "1px solid #1e293b", background: "transparent",
                    color: m.is_active ? "#22c55e" : "#ef4444", fontSize: 10, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {m.is_active ? "✅ نشط" : "⛔ معطل"}
                  </button>
                  <button onClick={() => handleEdit(m)} style={{
                    padding: "4px 8px", borderRadius: 4, border: "1px solid #1e293b", background: "transparent",
                    color: "#f59e0b", fontSize: 10, cursor: "pointer", fontFamily: "inherit",
                  }}>✏️</button>
                  <button onClick={() => handleDelete(m.id)} style={{
                    padding: "4px 8px", borderRadius: 4, border: "1px solid #1e293b", background: "transparent",
                    color: "#ef4444", fontSize: 10, cursor: "pointer", fontFamily: "inherit",
                  }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
