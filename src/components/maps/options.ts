import L, { type MapOptions } from "leaflet";
import { BRAZIL_BOUNDS, MAP_CONFIG } from "./config";

export const getMapOptions = (
  bounds?: L.LatLngBoundsExpression
): MapOptions => ({
  minZoom: MAP_CONFIG.MIN_ZOOM,
  maxZoom: MAP_CONFIG.MAX_ZOOM,
  maxBounds: bounds || BRAZIL_BOUNDS,
  maxBoundsViscosity: MAP_CONFIG.MAX_BOUNDS_VISCOSITY,
  worldCopyJump: false,
  preferCanvas: true,
  zoomSnap: MAP_CONFIG.ZOOM_SNAP,
  zoomDelta: MAP_CONFIG.ZOOM_DELTA,
});

export const getBasemapOptions = (apiKey: string | undefined) => ({
  apikey: apiKey,
  version: 2,
  language: "pt-BR",
  preserveDrawingBuffer: true,
});
