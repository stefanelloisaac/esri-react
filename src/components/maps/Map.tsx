"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import L from "leaflet";
import "esri-leaflet";
import * as ELV from "esri-leaflet-vector";
import { BRAZIL_BOUNDS, MAP_CONFIG, BASEMAP_STYLE } from "./Map.config";
import { getMapOptions, getBasemapOptions } from "./Map.options";
import type { MapProps } from "./Map.types";

export default function Map({
  height = "500px",
  center = MAP_CONFIG.DEFAULT_CENTER,
  zoom = MAP_CONFIG.DEFAULT_ZOOM,
  className = "",
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const isInitializedRef = useRef(false);

  const mapOptions = useMemo(() => getMapOptions(), []);

  const basemapOptions = useMemo(
    () => getBasemapOptions(process.env.NEXT_PUBLIC_ARCGIS_API_KEY),
    []
  );

  const handleDrag = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panInsideBounds(BRAZIL_BOUNDS, { animate: false });
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!isInitializedRef.current) {
      const map = L.map(mapContainerRef.current, mapOptions).setView(
        center,
        zoom
      );
      mapInstanceRef.current = map;
      isInitializedRef.current = true;

      ELV.vectorBasemapLayer(BASEMAP_STYLE, basemapOptions).addTo(map);
      map.on("drag", handleDrag);

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.off("drag", handleDrag);
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          isInitializedRef.current = false;
        }
      };
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, mapOptions, basemapOptions, handleDrag]);

  const containerStyle = useMemo(() => ({ height, width: "100%" }), [height]);

  return (
    <div ref={mapContainerRef} style={containerStyle} className={className} />
  );
}
