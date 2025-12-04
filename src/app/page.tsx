"use client";

import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/maps/Map"), { ssr: false });

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <Map
        height="100%"
        allowedBoundaries={[
          "ac",
          "al",
          "ap",
          "am",
          "ba",
          "ce",
          "df",
          "es",
          "go",
          "ma",
          "mt",
          "ms",
          "mg",
          "pa",
          "pb",
          "pr",
          "pe",
          "pi",
          "rj",
          "rn",
          "rs",
          "ro",
          "rr",
          "sc",
          "sp",
          "se",
          "to",
        ]}
      />
    </main>
  );
}
