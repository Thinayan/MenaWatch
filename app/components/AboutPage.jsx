"use client";
import { useState, useEffect } from "react";


// ── Fallback team (until Supabase is populated) ──
const FALLBACK_TEAM = [
  { id: "1", name_ar: "فريق التحليل السياسي", title_ar: "تحليل جيوسياسي", bio_ar: "متابعة وتحليل التطورات السياسية في منطقة الشرق الأوسط وشمال أفريقيا مع تقييم التأثير الاستراتيجي.", photo_url: null, linkedin: "", twitter: "" },
  { id: "2", name_ar: "فريق التحليل الاقتصادي", title_ar: "تحليل اقتصادي", bio_ar: "رصد المؤشرات الاقتصادية وأسواق الطاقة والاستثمارات وتوجهات القطاع الخاص في المنطقة.", photo_url: null, linkedin: "", twitter: "" },
  { id: "3", name_ar: "فريق الذكاء الاصطناعي", title_ar: "تقنية وبيانات", bio_ar: "تطوير نماذج التحليل الآلي ومعالجة البيانات من مصادر متعددة باستخدام أحدث تقنيات الذكاء الاصطناعي.", photo_url: null, linkedin: "", twitter: "" },
  { id: "4", name_ar: "فريق الأمن والدفاع", title_ar: "تحليل أمني", bio_ar: "تقييم التهديدات الأمنية ومتابعة التطورات العسكرية ومراقبة مؤشرات الاستقرار في المنطقة.", photo_url: null, linkedin: "", twitter: "" },
];

const METHODOLOGY_STEPS = [
  { icon: "📡", title: "جمع البيانات", desc: "رصد آلي لأكثر من 25 مصدراً إخبارياً عربياً ودولياً + بيانات GDELT الجيوسياسية على مدار الساعة." },
  { icon: "🤖", title: "تحليل ذكي", desc: "تصنيف تلقائي بالذكاء الاصطناعي: تحديد الفئة (سياسي/اقتصادي/أمني)، الدولة، وتحليل المشاعر لكل خبر." },
  { icon: "🔍", title: "تحقق بشري", desc: "مراجعة تحريرية من فريق محللين متخصصين لضمان الدقة والسياق الصحيح قبل النشر." },
  { icon: "📊", title: "تقييم التأثير", desc: "قياس مستوى التأثير الاستراتيجي لكل حدث على مقياس DEFCON المخصص لمنطقة MENA." },
  { icon: "📋", title: "التقرير اليومي", desc: "إعداد تقرير صباحي شامل يُرسل للمشتركين عبر البريد الإلكتروني قبل بداية يوم العمل." },
];

const STATS = [
  { val: "25+", label: "مصدر إخباري", color: "#22c55e" },
  { val: "15", label: "دولة مغطاة", color: "#3b82f6" },
  { val: "24/7", label: "رصد مستمر", color: "#f59e0b" },
  { val: "1200+", label: "مشترك", color: "#a855f7" },
];

export default function AboutPage() {
  const [team, setTeam] = useState(FALLBACK_TEAM);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then(r => r.json())
      .then(d => {
        if (d.members && d.members.length > 0) setTeam(d.members);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic','Tajawal',sans-serif", background: "#060d18", minHeight: "100vh", color: "#e2e8f0", direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .about-fade { animation: fadeIn 0.4s ease forwards; }
      `}</style>



      {/* Hero Section */}
      <div style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2847 50%, #0a1628 100%)", padding: "60px 20px 50px", textAlign: "center", borderBottom: "1px solid #1e293b" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>
          MENA <span style={{ color: "#22c55e" }}>Watch</span>
        </h1>
        <p style={{ fontSize: 14, color: "#94a3b8", maxWidth: 600, margin: "0 auto 24px", lineHeight: 1.8 }}>
          منصة الاستخبارات الاستراتيجية للشرق الأوسط وشمال أفريقيا
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>

        {/* Vision & Mission */}
        <section className="about-fade" style={{ marginBottom: 48 }}>
          <SectionTitle icon="🎯" title="رؤيتنا ومهمتنا" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <InfoCard
              title="الرؤية"
              icon="🔭"
              color="#22c55e"
              text="أن نكون المنصة العربية الأولى والأكثر موثوقية في تقديم التحليلات الاستراتيجية لمنطقة الشرق الأوسط وشمال أفريقيا، مع تمكين صناع القرار من فهم المشهد الجيوسياسي بعمق ودقة."
            />
            <InfoCard
              title="المهمة"
              icon="🚀"
              color="#3b82f6"
              text="رصد وتحليل التطورات السياسية والاقتصادية والأمنية في 15 دولة عربية باستخدام الذكاء الاصطناعي والتحليل البشري، وتقديم تقارير يومية موجزة تساعد على اتخاذ قرارات أفضل."
            />
          </div>
        </section>

        {/* Methodology */}
        <section className="about-fade" style={{ marginBottom: 48 }}>
          <SectionTitle icon="⚙️" title="منهجيتنا" />
          <div style={{ position: "relative" }}>
            {METHODOLOGY_STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#0f2847", border: "2px solid #1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {step.icon}
                </div>
                <div style={{ flex: 1, background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10, padding: "14px 18px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>
                    <span style={{ color: "#22c55e", marginLeft: 6 }}>{i + 1}.</span> {step.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage */}
        <section className="about-fade" style={{ marginBottom: 48 }}>
          <SectionTitle icon="🗺️" title="نطاق التغطية" />
          <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16, lineHeight: 1.7 }}>
              نغطي 15 دولة رئيسية في منطقة الشرق الأوسط وشمال أفريقيا مع تحليلات متخصصة لكل دولة:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                "🇸🇦 السعودية", "🇦🇪 الإمارات", "🇶🇦 قطر", "🇰🇼 الكويت", "🇧🇭 البحرين",
                "🇴🇲 عمان", "🇮🇶 العراق", "🇪🇬 مصر", "🇯🇴 الأردن", "🇱🇧 لبنان",
                "🇸🇾 سوريا", "🇾🇪 اليمن", "🇱🇾 ليبيا", "🇸🇩 السودان", "🇮🇷 إيران",
              ].map(c => (
                <span key={c} style={{ background: "#1e293b", padding: "6px 12px", borderRadius: 6, fontSize: 11, color: "#e2e8f0" }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Topics */}
        <section className="about-fade" style={{ marginBottom: 48 }}>
          <SectionTitle icon="📂" title="المحاور التحليلية" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
            {[
              { icon: "🏛️", name: "سياسي", color: "#3b82f6" },
              { icon: "💰", name: "اقتصادي", color: "#22c55e" },
              { icon: "🛡️", name: "أمني", color: "#ef4444" },
              { icon: "🏥", name: "صحي", color: "#06b6d4" },
              { icon: "⚡", name: "طاقة", color: "#f59e0b" },
              { icon: "💻", name: "تقني", color: "#8b5cf6" },
            ].map(t => (
              <div key={t.name} style={{ background: "#0a1628", border: `1px solid ${t.color}33`, borderRadius: 10, padding: "16px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{t.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="about-fade" style={{ marginBottom: 48 }}>
          <SectionTitle icon="👥" title="فريق العمل" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {team.map(m => (
              <div key={m.id} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%", margin: "0 auto 12px",
                  background: m.photo_url ? `url(${m.photo_url}) center/cover` : "linear-gradient(135deg, #1e3a5f, #0f2847)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, color: "#22c55e", border: "2px solid #1e3a5f",
                }}>
                  {!m.photo_url && "👤"}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>{m.name_ar}</div>
                <div style={{ fontSize: 11, color: "#22c55e", marginBottom: 8, fontWeight: 600 }}>{m.title_ar}</div>
                {m.bio_ar && (
                  <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6, marginBottom: 10 }}>{m.bio_ar}</div>
                )}
                <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5e9", fontSize: 11, textDecoration: "none" }}>LinkedIn</a>
                  )}
                  {m.twitter && (
                    <a href={m.twitter} target="_blank" rel="noopener noreferrer" style={{ color: "#94a3b8", fontSize: 11, textDecoration: "none" }}>𝕏</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="about-fade" style={{ marginBottom: 48 }}>
          <SectionTitle icon="📬" title="تواصل معنا" />
          <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 24, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, lineHeight: 1.7 }}>
              نرحب باقتراحاتكم وملاحظاتكم. يمكنكم التواصل معنا عبر:
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
              <ContactItem icon="✉️" label="البريد الإلكتروني" value="info@mena.watch" href="mailto:info@mena.watch" />
              <ContactItem icon="🌐" label="الموقع" value="mena.watch" href="https://mena.watch" />
              <ContactItem icon="𝕏" label="تويتر" value="@TheMenaWatch" href="https://x.com/TheMenaWatch" />
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1e293b", padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#475569" }}>
          © 2026 MENA Watch — جميع الحقوق محفوظة
        </div>
      </div>
    </div>
  );
}

// ── Helper Components ──
function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc" }}>{title}</h2>
    </div>
  );
}

function InfoCard({ title, icon, color, text }) {
  return (
    <div style={{ background: "#0a1628", border: `1px solid ${color}33`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h3 style={{ fontSize: 14, fontWeight: 700, color }}>{title}</h3>
      </div>
      <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>{text}</p>
    </div>
  );
}

function ContactItem({ icon, label, value, href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", textAlign: "center" }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 10, color: "#475569" }}>{label}</div>
      <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>{value}</div>
    </a>
  );
}
