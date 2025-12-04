"use client";

import { useRef, useMemo, useState } from "react";
import { MAP_CONFIG, BASEMAP_STYLE } from "./config";
import { getMapOptions, getBasemapOptions } from "./options";
import { useLeafletMap, useMapView } from "./hooks";
import { useBoundaryManager, getBoundaryById } from "./boundaries";
import { useMapDraw } from "./draw";
import { useCallbacksRef } from "@/hooks/use-stable-callback";
import { BoundarySelector } from "./BoundarySelector";
import { MapLoader } from "./MapLoader";
import type { MapProps } from "./types";
import "leaflet-draw/dist/leaflet.draw.css";

export default function Map({
  height = "500px",
  center,
  zoom,
  className = "",
  onShapeCreated,
  onShapeEdited,
  onShapeDeleted,
  allowedBoundaries,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const defaultBoundary = allowedBoundaries?.[0];
  const [selectedBoundary, setSelectedBoundary] = useState<string | undefined>(
    defaultBoundary
  );

  const [isLoading, setIsLoading] = useState(true);

  const boundaryDef = selectedBoundary
    ? getBoundaryById(selectedBoundary)
    : undefined;

  const mapCenter = center ?? boundaryDef?.center ?? MAP_CONFIG.DEFAULT_CENTER;
  const mapZoom = zoom ?? boundaryDef?.defaultZoom ?? MAP_CONFIG.DEFAULT_ZOOM;

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
      initialCenter: mapCenter,
      initialZoom: mapZoom,
    }),
    [mapOptions, basemapOptions, mapCenter, mapZoom]
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

  useMapView(mapRef, isInitializedRef, mapCenter, mapZoom);
  useMapDraw(mapRef, isInitializedRef, callbacksRef);

  useBoundaryManager(mapRef, isInitializedRef, {
    selectedBoundary,
    onBoundaryChanged: (boundaryId) => {
      setSelectedBoundary(boundaryId);
    },
    onLoadingStart: () => {
      setIsLoading(true);
    },
    onTilesLoaded: () => {
      setIsLoading(false);
    },
  });

  const handleBoundaryChange = (boundaryId: string) => {
    setSelectedBoundary(boundaryId);
  };

  const containerStyle = useMemo(() => ({ height, width: "100%" }), [height]);

  return (
    <div className="relative" style={containerStyle}>
      <div ref={mapContainerRef} style={containerStyle} className={className} />
      <MapLoader isLoading={isLoading} />
      <BoundarySelector
        value={selectedBoundary}
        onValueChange={handleBoundaryChange}
        allowedBoundaries={allowedBoundaries}
      />
    </div>
  );
}
