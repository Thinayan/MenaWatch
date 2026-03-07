import dynamic from "next/dynamic";

const LandingPage = dynamic(() => import("./components/LandingPage"), { ssr: false });

export const metadata = {
  title: "MENA.Watch — منصة الذكاء الاستراتيجي للشرق الأوسط",
  description: "تحليلات جيوسياسية فورية، خرائط تفاعلية، ومؤشرات أمنية واقتصادية لصانعي القرار في المنطقة",
};

export default function HomePage() {
  return <LandingPage />;
}
