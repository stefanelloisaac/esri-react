import { useRef, useLayoutEffect } from "react";
import L from "leaflet";
import "esri-leaflet";
import * as ELV from "esri-leaflet-vector";
import type { UseLeafletMapOptions } from "../types";

export function useLeafletMap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: UseLeafletMapOptions
) {
  const mapRef = useRef<L.Map | null>(null);
  const basemapLayerRef = useRef<L.Layer | null>(null);
  const isInitializedRef = useRef(false);

  const optionsRef = useRef(options);
  useLayoutEffect(() => {
    optionsRef.current = options;
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || isInitializedRef.current) return;

    const opts = optionsRef.current;

    const map = L.map(container, opts.mapOptions).setView(
      opts.initialCenter,
      opts.initialZoom
    );
    mapRef.current = map;
    isInitializedRef.current = true;

    const basemap = ELV.vectorBasemapLayer(
      opts.basemapStyle,
      opts.basemapOptions
    );
    basemap.addTo(map);
    basemapLayerRef.current = basemap;

    let handleDrag: (() => void) | undefined;
    if (opts.bounds) {
      handleDrag = () => {
        map.panInsideBounds(opts.bounds!, { animate: false });
      };
      map.on("drag", handleDrag);
    }

    return () => {
      if (handleDrag) {
        map.off("drag", handleDrag);
      }
      map.remove();
      mapRef.current = null;
      basemapLayerRef.current = null;
      isInitializedRef.current = false;
    };
  }, [containerRef]);

  return {
    mapRef,
    basemapLayerRef,
    isInitializedRef,
  };
}
