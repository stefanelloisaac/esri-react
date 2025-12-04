export const BRAZIL_BOUNDS: [[number, number], [number, number]] = [
  [-34.0, -74.0],
  [5.5, -32.0],
];

export const MAP_CONFIG = {
  MIN_ZOOM: 5,
  MAX_ZOOM: 16,
  DEFAULT_CENTER: [-14.235, -51.925] as [number, number],
  DEFAULT_ZOOM: 5,
  ZOOM_SNAP: 0.5,
  ZOOM_DELTA: 0.5,
  MAX_BOUNDS_VISCOSITY: 1.0,
} as const;

export const BASEMAP_STYLE = "arcgis/imagery" as const;
