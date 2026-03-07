"use client";
import { Suspense } from "react";
import SearchPage from "../components/SearchPage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ background: "#060d18", minHeight: "100vh", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center" }}>⏳ جاري التحميل...</div>}>
      <SearchPage />
    </Suspense>
  );
}
