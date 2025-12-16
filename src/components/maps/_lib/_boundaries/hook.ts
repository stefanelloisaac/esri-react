import { useRef, useEffect } from "react";
import L from "leaflet";
import { BoundaryManager } from "./manager";
import { getBoundaryById } from "./data";
import { UseMapBoundaryManagerOptions } from "../../_types";

export function useBoundaryManager(
  mapRef: React.RefObject<L.Map | null>,
  isInitializedRef: React.RefObject<boolean>,
  options: UseMapBoundaryManagerOptions,
) {
  const boundaryManagerRef = useRef<BoundaryManager | null>(null);
  const optionsRef = useRef(options);
  const initialBoundaryAppliedRef = useRef(false);

  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const initManager = () => {
      if (!mounted) return;

      const map = mapRef.current;
      if (!map || !isInitializedRef.current) {
        timeoutId = setTimeout(initManager, 50);
        return;
      }

      try {
        const container = map.getContainer();
        if (!container) {
          timeoutId = setTimeout(initManager, 50);
          return;
        }
      } catch {
        timeoutId = setTimeout(initManager, 50);
        return;
      }

      if (boundaryManagerRef.current) return;

      const manager = new BoundaryManager(map, {
        onLoadingStart: () => {
          optionsRef.current.onLoadingStart?.();
        },
        onTilesLoaded: () => {
          optionsRef.current.onTilesLoaded?.();
        },
      });

      boundaryManagerRef.current = manager;

      if (
        optionsRef.current.selectedBoundary &&
        !initialBoundaryAppliedRef.current
      ) {
        const boundary = getBoundaryById(optionsRef.current.selectedBoundary);
        if (boundary) {
          manager.changeBoundary(boundary, false);
          initialBoundaryAppliedRef.current = true;
        }
      }
    };

    initManager();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (boundaryManagerRef.current) {
        boundaryManagerRef.current.destroy();
        boundaryManagerRef.current = null;
      }
    };
  }, [mapRef, isInitializedRef]);

  useEffect(() => {
    const manager = boundaryManagerRef.current;
    const map = mapRef.current;
    if (!manager || !map || !isInitializedRef.current) return;

    try {
      const container = map.getContainer();
      if (!container) return;
    } catch {
      return;
    }

    const { selectedBoundary } = optionsRef.current;
    if (selectedBoundary) {
      const currentBoundary = manager.getCurrentBoundary();
      if (currentBoundary?.id !== selectedBoundary) {
        const boundary = getBoundaryById(selectedBoundary);
        if (boundary) {
          const shouldAnimate = currentBoundary !== null;
          manager.changeBoundary(boundary, shouldAnimate);
        }
      }
    }
  }, [options.selectedBoundary, mapRef, isInitializedRef]);

  return boundaryManagerRef;
}
