# فتح الموقع على التلفون (نفس الواي فاي)

## 1. فتح المنفذ في جدار الحماية (مرة واحدة)

جدار حماية Windows يمنع التلفون من الوصول. شغّل **PowerShell كمسؤول** (Run as Administrator) ثم نفّذ:

```powershell
New-NetFirewallRule -DisplayName "Next.js Dev 3000" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
```

أو شغّل السكربت من المشروع كمسؤول:
`scripts\allow-port-3000-firewall.ps1`

## 2. معرفة عنوان الـ IP للكمبيوتر

في PowerShell أو CMD:
```powershell
ipconfig
```
ابحث عن **IPv4 Address** تحت Wi-Fi أو Ethernet (مثال: `192.168.1.10`).

## 3. تشغيل السيرفر

```bash
npm run dev
```

## 4. فتح من التلفون

- تأكد أن التلفون على **نفس شبكة الواي فاي**.
- في متصفح التلفون اكتب: **http://192.168.1.10:3000** (استبدل بعنوان الـ IP عندك).

إذا استمرت المشكلة: تأكد أن "Client Isolation" أو "AP Isolation" معطّل في إعدادات الراوتر (حتى يتواصل التلفون مع الكمبيوتر).
