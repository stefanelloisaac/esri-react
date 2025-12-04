import { useRef, useEffect } from "react";
import type L from "leaflet";
import { MapDrawManager } from "./manager";
import type { DrawControlOptions } from "../../_types";

export function useMapDraw(
  mapRef: React.RefObject<L.Map | null>,
  isInitializedRef: React.RefObject<boolean>,
  callbacksRef: React.RefObject<DrawControlOptions>
) {
  const drawManagerRef = useRef<MapDrawManager | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const initDrawManager = () => {
      if (!mounted) return;

      const map = mapRef.current;
      if (!map || !isInitializedRef.current) {
        timeoutId = setTimeout(initDrawManager, 50);
        return;
      }

      try {
        const container = map.getContainer();
        if (!container) {
          timeoutId = setTimeout(initDrawManager, 50);
          return;
        }
      } catch {
        timeoutId = setTimeout(initDrawManager, 50);
        return;
      }

      if (drawManagerRef.current) return;

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
    };

    initDrawManager();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (drawManagerRef.current) {
        drawManagerRef.current.destroy();
        drawManagerRef.current = null;
      }
    };
  }, [mapRef, isInitializedRef, callbacksRef]);

  return { drawManagerRef };
}
