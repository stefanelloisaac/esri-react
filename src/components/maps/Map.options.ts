import type { MapOptions } from "leaflet";
import { BRAZIL_BOUNDS, MAP_CONFIG } from "./Map.config";

export const getMapOptions = (): MapOptions => ({
  minZoom: MAP_CONFIG.MIN_ZOOM,
  maxZoom: MAP_CONFIG.MAX_ZOOM,
  maxBounds: BRAZIL_BOUNDS,
  maxBoundsViscosity: MAP_CONFIG.MAX_BOUNDS_VISCOSITY,
  worldCopyJump: false,
  preferCanvas: true,
  zoomSnap: MAP_CONFIG.ZOOM_SNAP,
  zoomDelta: MAP_CONFIG.ZOOM_DELTA,
});

// Options for L.esri.Vector.vectorBasemapLayer
// Inherits from vectorTileLayer: apikey, token, portalUrl, style, preserveDrawingBuffer
// Additional options: version, language, worldview, places
export const getBasemapOptions = (apiKey: string | undefined) => ({
  apikey: apiKey,
  version: 2, // Use Basemap styles service v2
  language: "pt", // Portuguese labels (v2 only)
  preserveDrawingBuffer: true, // Fixes WebGL printing issues in Firefox
});
