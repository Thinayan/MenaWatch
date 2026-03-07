"use client";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";

const MENA_COUNTRIES = [
  "السعودية", "الإمارات", "قطر", "الكويت", "البحرين", "عمان",
  "العراق", "إيران", "لبنان", "سوريا", "اليمن", "مصر", "الأردن", "السودان", "ليبيا"
];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [regions, setRegions] = useState([]);
  const [notifications, setNotifications] = useState({ daily_email: true, defcon_alerts: true });

  useEffect(() => {
    import("../../lib/supabase").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
        if (data.user) {
          supabase.from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single()
            .then(({ data: p }) => {
              setProfile(p);
              setRegions(p?.alert_regions || []);
              setNotifications({
                daily_email: p?.daily_email !== false,
                defcon_alerts: p?.defcon_alerts !== false,
              });
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      });
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { supabase } = await import("../../lib/supabase");
      await supabase.from("profiles").update({
        alert_regions: regions,
        daily_email: notifications.daily_email,
        defcon_alerts: notifications.defcon_alerts,
      }).eq("id", user.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const toggleRegion = (r) => {
    setRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  };

  if (loading) return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", background: "#060d18", minHeight: "100vh", color: "#e2e8f0", direction: "rtl", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#22c55e", fontSize: 14 }}>جارٍ التحميل...</div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", background: "#060d18", minHeight: "100vh", color: "#e2e8f0", direction: "rtl" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <NavBar activePath="/profile" />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", marginBottom: 20 }}>👤 الملف الشخصي</div>

        {/* Info Card */}
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", marginBottom: 14 }}>معلومات الحساب</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>البريد الإلكتروني</div>
              <div style={{ fontSize: 12, color: "#e2e8f0" }}>{user?.email || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>الاسم</div>
              <div style={{ fontSize: 12, color: "#e2e8f0" }}>{profile?.full_name || user?.email?.split("@")[0] || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>الدور</div>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 700, background: profile?.role === "admin" ? "#f59e0b22" : profile?.role === "pro" ? "#22c55e22" : "#3b82f622", color: profile?.role === "admin" ? "#f59e0b" : profile?.role === "pro" ? "#22c55e" : "#3b82f6" }}>
                {profile?.role === "admin" ? "أدمن" : profile?.role === "pro" ? "خبير" : "مجاني"}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>تاريخ التسجيل</div>
              <div style={{ fontSize: 12, color: "#e2e8f0" }}>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString("ar-SA") : "—"}</div>
            </div>
          </div>
        </div>

        {/* Region Preferences */}
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", marginBottom: 14 }}>🌍 تفضيلات المناطق</div>
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 12 }}>اختر المناطق التي تهمك لتلقي تنبيهات مخصصة</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {MENA_COUNTRIES.map(c => {
              const active = regions.includes(c);
              return (
                <button key={c} onClick={() => toggleRegion(c)} style={{
                  padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: active ? "#22c55e22" : "#0f1829",
                  border: `1px solid ${active ? "#22c55e" : "#1e293b"}`,
                  color: active ? "#22c55e" : "#64748b",
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}>{c}</button>
              );
            })}
          </div>
        </div>

        {/* Notification Settings */}
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", marginBottom: 14 }}>🔔 إعدادات الإشعارات</div>
          {[
            { key: "daily_email", label: "تقرير يومي بالبريد", desc: "استلام التقرير الصباحي يومياً" },
            { key: "defcon_alerts", label: "تنبيهات DEFCON", desc: "تنبيه فوري عند تغيّر مستوى الخطر" },
          ].map(n => (
            <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #0f1829" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{n.label}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{n.desc}</div>
              </div>
              <button onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))} style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                background: notifications[n.key] ? "#22c55e" : "#1e293b",
                position: "relative", transition: "background 0.2s",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", background: "#fff",
                  position: "absolute", top: 3,
                  right: notifications[n.key] ? 3 : "auto",
                  left: notifications[n.key] ? "auto" : 3,
                  transition: "all 0.2s",
                }} />
              </button>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button onClick={handleSave} disabled={saving} style={{
          width: "100%", padding: "12px 0", borderRadius: 8, border: "none",
          background: saved ? "#14532d" : "linear-gradient(135deg, #22c55e, #16a34a)",
          color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "inherit", opacity: saving ? 0.6 : 1,
        }}>
          {saving ? "جارٍ الحفظ..." : saved ? "✅ تم الحفظ" : "💾 حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}
