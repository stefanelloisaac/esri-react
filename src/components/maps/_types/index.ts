import type L from "leaflet";

export type LatLng = [number, number];

export type LatLngBounds = [LatLng, LatLng];

export interface BoundaryDefinition {
  id: string;
  name: string;
  bounds: LatLngBounds;
  center: LatLng;
  defaultZoom: number;
  geoJsonPath?: string;
}

export interface BoundaryManagerOptions {
  onBoundaryChanged?: (boundaryId: string) => void;
  onLoadingStart?: () => void;
  onTilesLoaded?: () => void;
}

export interface UseBoundaryManagerOptions extends BoundaryManagerOptions {
  selectedBoundary?: string;
}

export interface DrawControlOptions {
  onShapeCreated?: (
    layerType: string,
    layer: L.Layer,
    geoJSON: GeoJSON.Feature
  ) => void;
  onShapeEdited?: (layers: L.LayerGroup) => void;
  onShapeDeleted?: (layers: L.LayerGroup) => void;
}

export interface MapProps extends DrawControlOptions {
  height?: string;
  center?: LatLng;
  zoom?: number;
  className?: string;
  allowedBoundaries?: string[];
  onDrawingsExport?: (geoJSON: GeoJSON.FeatureCollection) => void;
}

export interface BoundarySelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  allowedBoundaries?: string[];
  className?: string;
}

export interface MapLoaderProps {
  isLoading: boolean;
  hideDelay?: number;
  className?: string;
}

export interface UseLeafletMapOptions {
  mapOptions: L.MapOptions;
  basemapStyle: string;
  basemapOptions: {
    apikey: string | undefined;
    version: number;
    language: string;
    preserveDrawingBuffer: boolean;
  };
  initialCenter: LatLng;
  initialZoom: number;
  bounds?: L.LatLngBoundsExpression;
}
