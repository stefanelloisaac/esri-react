"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { MAP_CONFIG, BASEMAP_STYLE } from "./_configs/config";
import { getMapOptions, getBasemapOptions } from "./_configs/options";
import {
  useLeafletMap,
  useCallbacksRef,
  useDrawingsPersistence,
} from "./_hooks";
import { useBoundaryManager, getBoundaryById } from "./_lib/_boundaries";
import { useMapDraw } from "./_lib/_draw";
import { BoundarySelector } from "./_components/BoundarySelector";
import { SearchInput } from "./_components/SearchInput";
import { MapLoader } from "./_components/MapLoader";
import { DrawingControls } from "./_components/DrawingControls";
import { DEFAULT_DRAW_COLOR, type DrawColor } from "./_lib/_draw/colors";
import type { MapProps } from "./_types";
import "leaflet-draw/dist/leaflet.draw.css";

export default function Map({
  height = "500px",
  center,
  zoom,
  className = "",
  onShapeCreated,
  onShapeEdited,
  onShapeDeleted,
  onDrawingsExport,
  allowedBoundaries,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const defaultBoundary = allowedBoundaries?.[0];
  const [selectedBoundary, setSelectedBoundary] = useState<string | undefined>(
    defaultBoundary
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedColor, setSelectedColor] =
    useState<DrawColor>(DEFAULT_DRAW_COLOR);

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
      initialCenter:
        initialBoundaryDef?.center ?? center ?? MAP_CONFIG.DEFAULT_CENTER,
      initialZoom:
        initialBoundaryDef?.defaultZoom ?? zoom ?? MAP_CONFIG.DEFAULT_ZOOM,
    }),
    [mapOptions, basemapOptions, initialBoundaryDef, center, zoom]
  );

  const { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } =
    useDrawingsPersistence();

  const handleAutoSave = useCallback(
    (drawManager: ReturnType<typeof useMapDraw>["drawManagerRef"]) => {
      if (drawManager.current) {
        const geoJSON = drawManager.current.exportGeoJSON();
        saveToLocalStorage(geoJSON);
      }
    },
    [saveToLocalStorage]
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

  const { drawManagerRef } = useMapDraw(mapRef, isInitializedRef, callbacksRef);

  // Auto-load drawings on mount and track when map is ready
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (drawManagerRef.current && isInitializedRef.current) {
        setIsMapReady(true);

        const savedGeoJSON = loadFromLocalStorage();
        if (savedGeoJSON) {
          drawManagerRef.current.importGeoJSON(savedGeoJSON);
        }

        clearInterval(checkInterval);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [loadFromLocalStorage, drawManagerRef, isInitializedRef]);

  // Auto-save on shape changes
  useEffect(() => {
    if (!drawManagerRef.current) return;

    const autoSaveHandler = () => {
      handleAutoSave(drawManagerRef);
    };

    // Save after any drawing operation
    const originalOnShapeCreated = callbacksRef.current?.onShapeCreated;
    const originalOnShapeEdited = callbacksRef.current?.onShapeEdited;
    const originalOnShapeDeleted = callbacksRef.current?.onShapeDeleted;

    callbacksRef.current = {
      onShapeCreated: (layerType, layer, geoJSON) => {
        originalOnShapeCreated?.(layerType, layer, geoJSON);
        autoSaveHandler();
      },
      onShapeEdited: (layers) => {
        originalOnShapeEdited?.(layers);
        autoSaveHandler();
      },
      onShapeDeleted: (layers) => {
        originalOnShapeDeleted?.(layers);
        autoSaveHandler();
      },
    };
  }, [drawManagerRef, callbacksRef, handleAutoSave]);

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

  const handleColorChange = useCallback(
    (color: DrawColor) => {
      setSelectedColor(color);
      if (drawManagerRef.current) {
        drawManagerRef.current.setDrawColor(color);
      }
    },
    [drawManagerRef]
  );

  const handleSave = useCallback(() => {
    if (!drawManagerRef.current) return;

    const geoJSON = drawManagerRef.current.exportGeoJSON();
    const success = saveToLocalStorage(geoJSON);

    if (success) {
      console.log("Drawings saved to localStorage");
    }
  }, [drawManagerRef, saveToLocalStorage]);

  const handleLoad = useCallback(() => {
    if (!drawManagerRef.current) return;

    const savedGeoJSON = loadFromLocalStorage();
    if (savedGeoJSON) {
      drawManagerRef.current.importGeoJSON(savedGeoJSON);
      console.log("Drawings loaded from localStorage");
    }
  }, [drawManagerRef, loadFromLocalStorage]);

  const handleClear = useCallback(() => {
    if (!drawManagerRef.current) return;

    drawManagerRef.current.clearAll();
    clearLocalStorage();
    console.log("All drawings cleared");
  }, [drawManagerRef, clearLocalStorage]);

  const handleExportToDatabase = useCallback(() => {
    if (!drawManagerRef.current) return;

    const geoJSON = drawManagerRef.current.exportGeoJSON();
    onDrawingsExport?.(geoJSON);
  }, [drawManagerRef, onDrawingsExport]);

  // Expose export method via effect
  useEffect(() => {
    if (onDrawingsExport && drawManagerRef.current) {
      // This allows parent components to trigger export
      handleExportToDatabase();
    }
  }, [onDrawingsExport, drawManagerRef, handleExportToDatabase]);

  const containerStyle = useMemo(() => ({ height, width: "100%" }), [height]);

  return (
    <div className="relative" style={containerStyle}>
      <div ref={mapContainerRef} style={containerStyle} className={className} />
      <MapLoader isLoading={isLoading} />
      <SearchInput
        placeholder="Buscar..."
        className="absolute top-4 left-1/2 -translate-x-1/2 z-1000"
      />
      <DrawingControls
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={handleClear}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        className="absolute top-4 right-1/6 -translate-x-1/2 z-1000"
        disabled={!isMapReady}
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
