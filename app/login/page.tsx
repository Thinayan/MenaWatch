import dynamic from "next/dynamic";

const LoginPage = dynamic(() => import("../components/LoginPage"), { ssr: false });

export const metadata = {
  title: "تسجيل الدخول — MENA.Watch",
};

export default function Login() {
  return <LoginPage />;
}
