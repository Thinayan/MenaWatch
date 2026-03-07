import dynamic from "next/dynamic";

const MenaWatchMap = dynamic(() => import("./components/MenaWatchMap"), { ssr: false });

export const metadata = {
  title: "MENA.Watch — مراقبة الميدان المباشرة",
  description: "منصة ذكاء اصطناعي لمراقبة الأحداث الجيوسياسية والأسواق المالية في منطقة الشرق الأوسط وشمال أفريقيا",
};

export default function HomePage() {
  return <MenaWatchMap />;
}
