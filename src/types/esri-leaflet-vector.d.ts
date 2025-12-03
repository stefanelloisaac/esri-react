import * as L from "leaflet";

declare module "leaflet" {
  namespace esri {
    namespace Vector {
      function vectorBasemapLayer(
        style: string,
        options?: {
          apikey?: string;
          token?: string;
          version?: number;
          language?: string;
        }
      ): L.Layer;
    }
  }
}

declare module "esri-leaflet";
declare module "esri-leaflet-vector";
