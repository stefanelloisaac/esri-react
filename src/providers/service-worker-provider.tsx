"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  useServiceWorker,
  type ServiceWorkerControls,
} from "@/hooks/use-service-worker";

const ServiceWorkerContext = createContext<ServiceWorkerControls | null>(null);

export function ServiceWorkerProvider({ children }: { children: ReactNode }) {
  const controls = useServiceWorker({ path: "/sw.js", scope: "/" });

  return (
    <ServiceWorkerContext.Provider value={controls}>
      {children}
    </ServiceWorkerContext.Provider>
  );
}

export function useServiceWorkerControls(): ServiceWorkerControls {
  const context = useContext(ServiceWorkerContext);
  if (!context) {
    throw new Error(
      "useServiceWorkerControls must be used within ServiceWorkerProvider"
    );
  }
  return context;
}
