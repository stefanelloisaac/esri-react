import { useLayoutEffect, useRef } from "react";

export interface ServiceWorkerOptions {
  path?: string;
  scope?: string;
}

export interface ServiceWorkerControls {
  clearCache: () => Promise<void>;
  getCacheStats: () => Promise<{ count: number; maxSize: number }>;
}

export function useServiceWorker(
  options: ServiceWorkerOptions = {}
): ServiceWorkerControls {
  const { path = "/sw.js", scope = "/" } = options;
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register(path, { scope })
      .then((registration) => {
        registrationRef.current = registration;
        console.log("[SW] Registered successfully");

        registration.update();
      })
      .catch((error) => {
        console.error("[SW] Registration failed:", error);
      });

    return () => {};
  }, [path, scope]);

  const clearCache = async (): Promise<void> => {
    const sw = registrationRef.current?.active;
    if (!sw) {
      throw new Error("Service Worker not active");
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data?.success) {
          resolve();
        } else {
          reject(new Error("Failed to clear cache"));
        }
      };

      sw.postMessage({ type: "CLEAR_TILE_CACHE" }, [messageChannel.port2]);
    });
  };

  const getCacheStats = async (): Promise<{
    count: number;
    maxSize: number;
  }> => {
    const sw = registrationRef.current?.active;
    if (!sw) {
      return { count: 0, maxSize: 0 };
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data || { count: 0, maxSize: 0 });
      };

      sw.postMessage({ type: "GET_CACHE_STATS" }, [messageChannel.port2]);
    });
  };

  return {
    clearCache,
    getCacheStats,
  };
}
