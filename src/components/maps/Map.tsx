"use client";

import { useRef, useMemo } from "react";
import { BRAZIL_BOUNDS, MAP_CONFIG, BASEMAP_STYLE } from "./Map.config";
import { getMapOptions, getBasemapOptions } from "./Map.options";
import type { MapProps } from "./Map.types";
import { useLeafletMap } from "@/hooks/use-leaflet-map";
import { useMapView } from "@/hooks/use-map-view";
import { useMapDraw } from "@/hooks/use-map-draw";
import { useCallbacksRef } from "@/hooks/use-stable-callback";
import "leaflet-draw/dist/leaflet.draw.css";

export default function Map({
  height = "500px",
  center = MAP_CONFIG.DEFAULT_CENTER,
  zoom = MAP_CONFIG.DEFAULT_ZOOM,
  className = "",
  onShapeCreated,
  onShapeEdited,
  onShapeDeleted,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const mapOptions = useMemo(() => getMapOptions(), []);
  const basemapOptions = useMemo(
    () => getBasemapOptions(process.env.NEXT_PUBLIC_ARCGIS_API_KEY),
    []
  );
  const leafletMapOptions = useMemo(
    () => ({
      mapOptions,
      basemapStyle: BASEMAP_STYLE,
      basemapOptions,
      initialCenter: center,
      initialZoom: zoom,
      bounds: BRAZIL_BOUNDS,
    }),
    [mapOptions, basemapOptions, center, zoom]
  );

  const callbacksRef = useCallbacksRef({
    onShapeCreated,
    onShapeEdited,
    onShapeDeleted,
  });

  const { mapRef, isInitializedRef } = useLeafletMap(
    mapContainerRef,
    leafletMapOptions
  );

  useMapView(mapRef, isInitializedRef, center, zoom);

  useMapDraw(mapRef, isInitializedRef, callbacksRef);

  const containerStyle = useMemo(() => ({ height, width: "100%" }), [height]);

  return (
    <div ref={mapContainerRef} style={containerStyle} className={className} />
  );
}
