# Service Worker Tile Caching

This application uses a service worker to aggressively cache map tiles from Esri/ArcGIS services. **The service worker is the ONLY caching layer** - it intercepts all requests including those from Web Workers used by Mapbox GL (which powers esri-leaflet-vector).

## How It Works

The service worker intercepts all network requests to Esri/ArcGIS tile servers and:

1. **Checks cache first** - If a tile exists in cache and hasn't expired (30 days), serves it immediately
2. **Fetches if needed** - If not in cache or expired, fetches from network
3. **Caches response** - Stores the fetched tile for future use with timestamp
4. **Handles offline** - Returns cached tiles even when offline (stale-while-revalidate)

## Key Implementation Details

### Why Service Worker (Not IndexedDB)?

The esri-leaflet-vector library uses **Mapbox GL** internally, which fetches tiles in **Web Workers**. Web Workers have their own `fetch` function that **cannot be intercepted** from the main thread. Only service workers can intercept requests from web workers.

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Main Thread   │     │   Web Worker    │     │ Service Worker  │
│  (React/Next)   │     │   (Mapbox GL)   │     │    (sw.js)      │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │  fetch(tile.pbf)      │  fetch(tile.pbf)      │
         └───────────────────────┼───────────────────────►
                                 └───────────────────────►
                                                         │
                                          ┌──────────────┴──────────────┐
                                          │  1. Check Cache API         │
                                          │  2. Return cached if valid  │
                                          │  3. Else fetch & cache      │
                                          └─────────────────────────────┘
```

## Features

### Cache Configuration
- **Cache Duration**: 30 days
- **Cache Name**: `esri-tiles-v3`
- **Max Entries**: 500 tiles (auto-trimmed)

### Hosts Cached
- `basemaps-api.arcgis.com`
- `ibasemaps-api.arcgis.com`
- `basemapstyles-api.arcgis.com`
- `tiles.arcgis.com`
- `services.arcgisonline.com`
- `static.arcgis.com`
- `cdn.arcgis.com`

### Resources Cached
- Vector tiles (`.pbf`)
- Raster tiles (`.png`, `.jpg`, `.webp`)
- Style definitions (`.json`)
- Sprites and fonts

## API Usage

### Clear Cache Programmatically

```typescript
import { clearServiceWorkerCache } from "@/components/service-worker-provider";

// Clear all cached tiles
await clearServiceWorkerCache();
```

### Get Cache Statistics

```typescript
import { getServiceWorkerCacheStats } from "@/components/service-worker-provider";

const stats = await getServiceWorkerCacheStats();
console.log(`Tiles: ${stats.count}, Size: ${stats.size} bytes`);
```

### React Hook

```typescript
import { useTileCache } from "@/hooks/use-tile-cache";

function CacheStats() {
  const { stats, clear, isLoading } = useTileCache();
  
  return (
    <div>
      <p>{stats.count} tiles ({stats.sizeInMB} MB)</p>
      <button onClick={clear} disabled={isLoading}>
        Clear Cache
      </button>
    </div>
  );
}
```

## Browser DevTools

### Check Cache Status

1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Cache Storage** → `esri-tiles-v3`
4. View cached tiles

### Monitor Service Worker

1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers**
4. View status (should show "activated and running")

### Network Tab

Cached requests show:
- `(ServiceWorker)` in Size column
- `transferSize: 0` in timing
- Green check marks in TileMonitor component

## Troubleshooting

### Service Worker Not Registering
- Check browser console for `[SW]` prefixed logs
- Ensure HTTPS or localhost (service workers require secure context)
- Check service worker status in TileMonitor component

### Tiles Still Loading from Network
- First load after clearing cache will always be network
- Check if service worker shows "active" status
- Verify console shows `[SW] Installing...` and `[SW] Activating...`

### Clear Everything and Start Fresh
1. DevTools → Application → Service Workers → Unregister
2. DevTools → Application → Cache Storage → Delete `esri-tiles-v3`
3. Hard refresh (Ctrl+Shift+R)
