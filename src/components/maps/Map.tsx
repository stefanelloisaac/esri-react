"use client";

import { useRef, useMemo, useState } from "react";
import { MAP_CONFIG, BASEMAP_STYLE } from "./config";
import { getMapOptions, getBasemapOptions } from "./options";
import { useLeafletMap } from "./hooks";
import { useBoundaryManager, getBoundaryById } from "./boundaries";
import { useMapDraw } from "./draw";
import { useCallbacksRef } from "@/hooks/use-stable-callback";
import { BoundarySelector } from "./BoundarySelector";
import { SearchInput } from "./SearchInput";
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

  const initialBoundaryDef = defaultBoundary
    ? getBoundaryById(defaultBoundary)
    : undefined;

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
      initialCenter: initialBoundaryDef?.center ?? center ?? MAP_CONFIG.DEFAULT_CENTER,
      initialZoom: initialBoundaryDef?.defaultZoom ?? zoom ?? MAP_CONFIG.DEFAULT_ZOOM,
    }),
    [mapOptions, basemapOptions, initialBoundaryDef, center, zoom]
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

  useMapDraw(mapRef, isInitializedRef, callbacksRef);

  useBoundaryManager(mapRef, isInitializedRef, {
    selectedBoundary,
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
      <SearchInput
        placeholder="Buscar..."
        className="absolute top-4 left-1/2 -translate-x-1/2 z-1000"
      />
      <BoundarySelector
        value={selectedBoundary}
        onValueChange={handleBoundaryChange}
        allowedBoundaries={allowedBoundaries}
        className="absolute top-4 right-4 z-1000"
      />
    </div>
  );
}
