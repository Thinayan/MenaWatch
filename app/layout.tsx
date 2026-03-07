import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://mena.watch"),
  title: "MENA.Watch — مراقبة الميدان",
  description: "منصة الاستخبارات الجيوسياسية للشرق الأوسط وشمال أفريقيا",
  keywords: ["MENA", "Middle East", "geopolitics", "markets", "Saudi Arabia", "UAE"],
  openGraph: {
    title: "MENA.Watch — مراقب الشرق الأوسط",
    description: "مراقبة الأحداث الجيوسياسية والأسواق في الشرق الأوسط",
    type: "website",
    locale: "ar_SA",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MENA.Watch" }],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#060d18" }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
