/// <reference lib="webworker" />

const CACHE_NAME = "esri-tiles-v1";
const TILE_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const MAX_CACHE_SIZE = 1000;
const DEBUG = true;

const TILE_URL_PATTERNS = [
  /basemaps.*\.arcgis\.com/,
  /tiles\.arcgis\.com/,
  /services\.arcgisonline\.com/,
  /server\.arcgisonline\.com/,
  /\.pbf$/,
  /\.mvt$/,
  /VectorTileServer/,
];

function log(type, message, url) {
  if (!DEBUG) return;
  const styles = {
    HIT: "background: #22c55e; color: white; padding: 2px 6px; border-radius: 3px;",
    MISS: "background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px;",
    CACHE:
      "background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px;",
    INFO: "background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 3px;",
  };
  const shortUrl = url ? new URL(url).pathname.slice(-50) : "";
  console.log(
    `%c[SW ${type}]%c ${message} ${shortUrl}`,
    styles[type] || "",
    ""
  );
}

function shouldCacheRequest(url) {
  return TILE_URL_PATTERNS.some((pattern) => pattern.test(url));
}

async function trimCache(cache) {
  const keys = await cache.keys();
  if (keys.length > MAX_CACHE_SIZE) {
    const deleteCount = keys.length - MAX_CACHE_SIZE;
    const keysToDelete = keys.slice(0, deleteCount);
    await Promise.all(keysToDelete.map((key) => cache.delete(key)));
  }
}

self.addEventListener("install", () => {
  log("INFO", "Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  log("INFO", "Service Worker activated - now controlling page");
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(
            (name) => name.startsWith("esri-tiles-") && name !== CACHE_NAME
          )
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
      log("INFO", "Claimed all clients");
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (DEBUG && request.url.includes("arcgis")) {
    console.log("[SW DEBUG] Intercepted:", request.url);
    console.log("[SW DEBUG] Should cache?", shouldCacheRequest(request.url));
  }

  if (request.method !== "GET" || !shouldCacheRequest(request.url)) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        const cachedDate = cachedResponse.headers.get("sw-cached-date");
        if (cachedDate) {
          const age = Date.now() - new Date(cachedDate).getTime();
          if (age < TILE_CACHE_MAX_AGE) {
            log("HIT", "From cache:", request.url);
            return cachedResponse;
          }
        } else {
          log("HIT", "From cache (legacy):", request.url);
          return cachedResponse;
        }
      }

      try {
        log("MISS", "Fetching from network:", request.url);
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
          const responseToCache = new Response(networkResponse.clone().body, {
            status: networkResponse.status,
            statusText: networkResponse.statusText,
            headers: new Headers(networkResponse.headers),
          });
          responseToCache.headers.set(
            "sw-cached-date",
            new Date().toISOString()
          );

          cache.put(request, responseToCache).then(() => {
            log("CACHE", "Stored in cache:", request.url);
            trimCache(cache);
          });
        }

        return networkResponse;
      } catch (error) {
        if (cachedResponse) {
          log("HIT", "Stale cache (network failed):", request.url);
          return cachedResponse;
        }
        throw error;
      }
    })()
  );
});

self.addEventListener("message", (event) => {
  const { type } = event.data || {};

  if (type === "CLEAR_TILE_CACHE") {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
    );
  }

  if (type === "GET_CACHE_STATS") {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        event.ports[0]?.postMessage({
          count: keys.length,
          maxSize: MAX_CACHE_SIZE,
        });
      })()
    );
  }
});
