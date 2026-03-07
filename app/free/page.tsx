"use client";
import dynamic from "next/dynamic";
const FreeTabs = dynamic(() => import("../components/FreeTabs"), { ssr: false });
export default function FreePage() { return <FreeTabs />; }
