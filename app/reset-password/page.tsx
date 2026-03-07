"use client";
import dynamic from "next/dynamic";

const ResetPasswordPage = dynamic(() => import("../components/ResetPasswordPage"), { ssr: false });

export default function ResetPassword() {
  return <ResetPasswordPage />;
}
