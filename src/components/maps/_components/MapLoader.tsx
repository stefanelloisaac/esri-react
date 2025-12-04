"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { MapLoaderProps } from "../_types";

export function MapLoader({
  isLoading,
  hideDelay = 2000,
  className,
}: MapLoaderProps) {
  const [showDelayed, setShowDelayed] = useState(true);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    if (isLoading) {
      showTimeoutRef.current = setTimeout(() => {
        setShowDelayed(true);
      }, 0);
    } else {
      hideTimeoutRef.current = setTimeout(() => {
        setShowDelayed(false);
      }, hideDelay);
    }

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    };
  }, [isLoading, hideDelay]);

  const isActive = isLoading || showDelayed;

  return (
    <div
      className={cn(
        "absolute inset-0 z-999 flex items-center justify-center",
        "bg-neutral-900/80",
        "transition-opacity duration-300 ease-out",
        isActive ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      aria-hidden={!isActive}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-3 px-8 py-5 rounded-2xl",
          "bg-card/95 shadow-xl border border-border/40",
          "transition-all duration-700 ease-out",
          isActive
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-2"
        )}
      >
        <span className="text-sm text-muted-foreground">
          Carregando mapa...
        </span>
      </div>
    </div>
  );
}
