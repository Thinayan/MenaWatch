# قوالب إيميل MENA.Watch — للصق في Supabase Dashboard
# المسار: Authentication → Email Templates → اضغط على كل قالب

---

## 1. Confirm sign up
**Subject:** `MENA.Watch — تأكيد حسابك الجديد`
**Body:**

```html
<div style="direction:rtl;font-family:'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif;max-width:480px;margin:0 auto;background:#060d18;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
  <div style="background:#0a1628;padding:28px 24px;text-align:center;border-bottom:1px solid #1e293b;">
    <div style="font-size:24px;font-weight:800;color:#f8fafc;margin-bottom:4px;">🌐 MENA<span style="color:#22c55e;">.Watch</span></div>
    <div style="font-size:12px;color:#64748b;">منصة الذكاء الاستراتيجي للشرق الأوسط</div>
  </div>
  <div style="padding:32px 24px;text-align:center;">
    <div style="font-size:36px;margin-bottom:16px;">🎉</div>
    <h2 style="font-size:22px;font-weight:700;color:#f8fafc;margin:0 0 12px;">مرحباً بك في MENA.Watch</h2>
    <p style="font-size:14px;color:#94a3b8;line-height:1.8;margin:0 0 28px;">شكراً لتسجيلك! اضغط الزر أدناه لتأكيد بريدك الإلكتروني والبدء في استخدام المنصة.</p>
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 40px;background:#22c55e;color:#000;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px;">تأكيد الحساب</a>
    <p style="font-size:12px;color:#475569;margin-top:24px;line-height:1.7;">إذا لم تسجّل في MENA.Watch، تجاهل هذه الرسالة.</p>
  </div>
  <div style="background:#0a1628;padding:16px 24px;text-align:center;border-top:1px solid #1e293b;">
    <div style="font-size:11px;color:#334155;">© 2025 MENA.Watch — جميع الحقوق محفوظة</div>
  </div>
</div>
```

---

## 2. Magic link
**Subject:** `MENA.Watch — رابط تسجيل الدخول`
**Body:**

```html
<div style="direction:rtl;font-family:'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif;max-width:480px;margin:0 auto;background:#060d18;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
  <div style="background:#0a1628;padding:28px 24px;text-align:center;border-bottom:1px solid #1e293b;">
    <div style="font-size:24px;font-weight:800;color:#f8fafc;margin-bottom:4px;">🌐 MENA<span style="color:#22c55e;">.Watch</span></div>
    <div style="font-size:12px;color:#64748b;">منصة الذكاء الاستراتيجي للشرق الأوسط</div>
  </div>
  <div style="padding:32px 24px;text-align:center;">
    <div style="font-size:36px;margin-bottom:16px;">🔑</div>
    <h2 style="font-size:22px;font-weight:700;color:#f8fafc;margin:0 0 12px;">رابط تسجيل الدخول</h2>
    <p style="font-size:14px;color:#94a3b8;line-height:1.8;margin:0 0 28px;">اضغط الزر أدناه لتسجيل الدخول إلى حسابك بدون كلمة مرور.</p>
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 40px;background:#22c55e;color:#000;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px;">تسجيل الدخول</a>
    <p style="font-size:12px;color:#475569;margin-top:24px;line-height:1.7;">إذا لم تطلب تسجيل الدخول، تجاهل هذه الرسالة.<br/>الرابط صالح لمدة ساعة واحدة فقط.</p>
  </div>
  <div style="background:#0a1628;padding:16px 24px;text-align:center;border-top:1px solid #1e293b;">
    <div style="font-size:11px;color:#334155;">© 2025 MENA.Watch — جميع الحقوق محفوظة</div>
  </div>
</div>
```

---

## 3. Reset password (تم تعديله مسبقاً)
**Subject:** `MENA.Watch — إعادة تعيين كلمة المرور`
**Body:**

```html
<div style="direction:rtl;font-family:'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif;max-width:480px;margin:0 auto;background:#060d18;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
  <div style="background:#0a1628;padding:28px 24px;text-align:center;border-bottom:1px solid #1e293b;">
    <div style="font-size:24px;font-weight:800;color:#f8fafc;margin-bottom:4px;">🌐 MENA<span style="color:#22c55e;">.Watch</span></div>
    <div style="font-size:12px;color:#64748b;">منصة الذكاء الاستراتيجي للشرق الأوسط</div>
  </div>
  <div style="padding:32px 24px;text-align:center;">
    <div style="font-size:36px;margin-bottom:16px;">🔐</div>
    <h2 style="font-size:22px;font-weight:700;color:#f8fafc;margin:0 0 12px;">إعادة تعيين كلمة المرور</h2>
    <p style="font-size:14px;color:#94a3b8;line-height:1.8;margin:0 0 28px;">تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك. اضغط الزر أدناه لتعيين كلمة مرور جديدة.</p>
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 40px;background:#22c55e;color:#000;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px;">تعيين كلمة مرور جديدة</a>
    <p style="font-size:12px;color:#475569;margin-top:24px;line-height:1.7;">إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذه الرسالة.<br/>الرابط صالح لمدة ساعة واحدة فقط.</p>
  </div>
  <div style="background:#0a1628;padding:16px 24px;text-align:center;border-top:1px solid #1e293b;">
    <div style="font-size:11px;color:#334155;">© 2025 MENA.Watch — جميع الحقوق محفوظة</div>
  </div>
</div>
```

---

## 4. Change email address
**Subject:** `MENA.Watch — تأكيد تغيير البريد الإلكتروني`
**Body:**

```html
<div style="direction:rtl;font-family:'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif;max-width:480px;margin:0 auto;background:#060d18;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
  <div style="background:#0a1628;padding:28px 24px;text-align:center;border-bottom:1px solid #1e293b;">
    <div style="font-size:24px;font-weight:800;color:#f8fafc;margin-bottom:4px;">🌐 MENA<span style="color:#22c55e;">.Watch</span></div>
    <div style="font-size:12px;color:#64748b;">منصة الذكاء الاستراتيجي للشرق الأوسط</div>
  </div>
  <div style="padding:32px 24px;text-align:center;">
    <div style="font-size:36px;margin-bottom:16px;">📧</div>
    <h2 style="font-size:22px;font-weight:700;color:#f8fafc;margin:0 0 12px;">تأكيد تغيير البريد الإلكتروني</h2>
    <p style="font-size:14px;color:#94a3b8;line-height:1.8;margin:0 0 28px;">تلقينا طلباً لتغيير بريدك الإلكتروني. اضغط الزر أدناه لتأكيد العنوان الجديد.</p>
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 40px;background:#22c55e;color:#000;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px;">تأكيد البريد الجديد</a>
    <p style="font-size:12px;color:#475569;margin-top:24px;line-height:1.7;">إذا لم تطلب تغيير بريدك الإلكتروني، تجاهل هذه الرسالة.</p>
  </div>
  <div style="background:#0a1628;padding:16px 24px;text-align:center;border-top:1px solid #1e293b;">
    <div style="font-size:11px;color:#334155;">© 2025 MENA.Watch — جميع الحقوق محفوظة</div>
  </div>
</div>
```

---

## 5. Invite user
**Subject:** `MENA.Watch — دعوة للانضمام`
**Body:**

```html
<div style="direction:rtl;font-family:'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif;max-width:480px;margin:0 auto;background:#060d18;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
  <div style="background:#0a1628;padding:28px 24px;text-align:center;border-bottom:1px solid #1e293b;">
    <div style="font-size:24px;font-weight:800;color:#f8fafc;margin-bottom:4px;">🌐 MENA<span style="color:#22c55e;">.Watch</span></div>
    <div style="font-size:12px;color:#64748b;">منصة الذكاء الاستراتيجي للشرق الأوسط</div>
  </div>
  <div style="padding:32px 24px;text-align:center;">
    <div style="font-size:36px;margin-bottom:16px;">✉️</div>
    <h2 style="font-size:22px;font-weight:700;color:#f8fafc;margin:0 0 12px;">دعوة للانضمام إلى MENA.Watch</h2>
    <p style="font-size:14px;color:#94a3b8;line-height:1.8;margin:0 0 28px;">تمت دعوتك للانضمام إلى منصة MENA.Watch. اضغط الزر أدناه لقبول الدعوة وإنشاء حسابك.</p>
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 40px;background:#22c55e;color:#000;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px;">قبول الدعوة</a>
    <p style="font-size:12px;color:#475569;margin-top:24px;line-height:1.7;">إذا لم تكن تتوقع هذه الدعوة، تجاهل هذه الرسالة.</p>
  </div>
  <div style="background:#0a1628;padding:16px 24px;text-align:center;border-top:1px solid #1e293b;">
    <div style="font-size:11px;color:#334155;">© 2025 MENA.Watch — جميع الحقوق محفوظة</div>
  </div>
</div>
```

---

## 6. Reauthentication
**Subject:** `MENA.Watch — تأكيد الهوية`
**Body:**

```html
<div style="direction:rtl;font-family:'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif;max-width:480px;margin:0 auto;background:#060d18;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
  <div style="background:#0a1628;padding:28px 24px;text-align:center;border-bottom:1px solid #1e293b;">
    <div style="font-size:24px;font-weight:800;color:#f8fafc;margin-bottom:4px;">🌐 MENA<span style="color:#22c55e;">.Watch</span></div>
    <div style="font-size:12px;color:#64748b;">منصة الذكاء الاستراتيجي للشرق الأوسط</div>
  </div>
  <div style="padding:32px 24px;text-align:center;">
    <div style="font-size:36px;margin-bottom:16px;">🛡️</div>
    <h2 style="font-size:22px;font-weight:700;color:#f8fafc;margin:0 0 12px;">تأكيد الهوية</h2>
    <p style="font-size:14px;color:#94a3b8;line-height:1.8;margin:0 0 28px;">لتأكيد هويتك وإتمام العملية الحساسة، اضغط الزر أدناه.</p>
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 40px;background:#22c55e;color:#000;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px;">تأكيد الهوية</a>
    <p style="font-size:12px;color:#475569;margin-top:24px;line-height:1.7;">إذا لم تطلب هذا الإجراء، تجاهل هذه الرسالة وتأكد من أمان حسابك.</p>
  </div>
  <div style="background:#0a1628;padding:16px 24px;text-align:center;border-top:1px solid #1e293b;">
    <div style="font-size:11px;color:#334155;">© 2025 MENA.Watch — جميع الحقوق محفوظة</div>
  </div>
</div>
```

---

## إعدادات الأمان الموصى بها
في نفس الصفحة → Security:
- ✅ فعّل: **Password changed**
- ✅ فعّل: **Email address changed**
- ⬜ اترك الباقي معطّل حالياً
