import { useRef, useLayoutEffect } from "react";
import type L from "leaflet";
import {
  MapDrawManager,
  type DrawControlOptions,
} from "@/components/maps/Map.draw";

export function useMapDraw(
  mapRef: React.RefObject<L.Map | null>,
  isInitializedRef: React.RefObject<boolean>,
  callbacksRef: React.RefObject<DrawControlOptions>
) {
  const drawManagerRef = useRef<MapDrawManager | null>(null);

  useLayoutEffect(() => {
    const map = mapRef.current;
    if (!map || !isInitializedRef.current) return;

    const drawManager = new MapDrawManager(map, {
      onShapeCreated: (layerType, layer, geoJSON) => {
        callbacksRef.current?.onShapeCreated?.(layerType, layer, geoJSON);
      },
      onShapeEdited: (layers) => {
        callbacksRef.current?.onShapeEdited?.(layers);
      },
      onShapeDeleted: (layers) => {
        callbacksRef.current?.onShapeDeleted?.(layers);
      },
    });
    drawManagerRef.current = drawManager;

    return () => {
      drawManager.destroy();
      drawManagerRef.current = null;
    };
  }, [mapRef, isInitializedRef, callbacksRef]);

  return drawManagerRef;
}
