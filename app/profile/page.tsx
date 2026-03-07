import dynamic from "next/dynamic";

const ProfilePage = dynamic(() => import("../components/ProfilePage"), { ssr: false });

export const metadata = {
  title: "حسابي — MENA.Watch",
  description: "إدارة الملف الشخصي والتفضيلات",
};

export default function Profile() {
  return <ProfilePage />;
}
