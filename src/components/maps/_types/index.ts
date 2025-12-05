import type L from "leaflet";
import { DrawColor } from "../_lib/_draw/colors";

export type MapLatLng = [number, number];

export type MapLatLngBounds = [MapLatLng, MapLatLng];

export interface MapBoundaryDefinition {
  id: string;
  name: string;
  bounds: MapLatLngBounds;
  center: MapLatLng;
  defaultZoom: number;
  geoJsonPath?: string;
}

export interface MapBoundaryManagerOptions {
  onBoundaryChanged?: (boundaryId: string) => void;
  onLoadingStart?: () => void;
  onTilesLoaded?: () => void;
}

export interface UseMapBoundaryManagerOptions
  extends MapBoundaryManagerOptions {
  selectedBoundary?: string;
}

export interface MapDrawControlOptions {
  onShapeCreated?: (
    layerType: string,
    layer: L.Layer,
    geoJSON: GeoJSON.Feature
  ) => void;
  onShapeEdited?: (layers: L.LayerGroup) => void;
  onShapeDeleted?: (layers: L.LayerGroup) => void;
}

export interface MapProps extends MapDrawControlOptions {
  height?: string;
  center?: MapLatLng;
  zoom?: number;
  className?: string;
  allowedBoundaries?: string[];
  onDrawingsExport?: (geoJSON: GeoJSON.FeatureCollection) => void;
}

export interface MapBoundarySelectorProps {
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
  initialCenter: MapLatLng;
  initialZoom: number;
  bounds?: L.LatLngBoundsExpression;
}

export interface MapColorPickerProps {
  selectedColor: DrawColor;
  onColorChange: (color: DrawColor) => void;
  disabled?: boolean;
  className?: string;
}

export interface MapDrawingControlsProps {
  onSave?: () => void;
  onLoad?: () => void;
  onClear?: () => void;
  selectedColor?: DrawColor;
  onColorChange?: (color: DrawColor) => void;
  className?: string;
  disabled?: boolean;
}

export interface MapSearchInputProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}
