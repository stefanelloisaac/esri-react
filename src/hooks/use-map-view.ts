import { useRef, useLayoutEffect } from "react";
import type L from "leaflet";

export function useMapView(
  mapRef: React.RefObject<L.Map | null>,
  isInitializedRef: React.RefObject<boolean>,
  center: [number, number],
  zoom: number
) {
  const prevCenterRef = useRef<[number, number]>(center);
  const prevZoomRef = useRef<number>(zoom);

  useLayoutEffect(() => {
    const map = mapRef.current;
    if (!map || !isInitializedRef.current) return;

    const centerChanged =
      prevCenterRef.current[0] !== center[0] ||
      prevCenterRef.current[1] !== center[1];
    const zoomChanged = prevZoomRef.current !== zoom;

    if (centerChanged || zoomChanged) {
      map.setView(center, zoom, { animate: true });
      prevCenterRef.current = center;
      prevZoomRef.current = zoom;
    }
  }, [mapRef, isInitializedRef, center, zoom]);
}
