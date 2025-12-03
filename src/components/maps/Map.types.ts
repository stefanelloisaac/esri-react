import type L from "leaflet";

export interface MapProps {
  height?: string;
  center?: [number, number];
  zoom?: number;
  className?: string;
  onShapeCreated?: (
    layerType: string,
    layer: L.Layer,
    geoJSON: GeoJSON.Feature
  ) => void;
  onShapeEdited?: (layers: L.LayerGroup) => void;
  onShapeDeleted?: (layers: L.LayerGroup) => void;
}

export interface MapBounds {
  southwest: [number, number];
  northeast: [number, number];
}
