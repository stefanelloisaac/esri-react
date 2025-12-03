"use client";

import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/maps/Map"), { ssr: false });

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <Map height="100%" />
    </main>
  );
}
