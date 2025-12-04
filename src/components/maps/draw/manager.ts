import L from "leaflet";
import "leaflet-draw";
import type { DrawControlOptions } from "../types";

export class MapDrawManager {
  private map: L.Map;
  private drawnItems: L.FeatureGroup;
  private drawControl: L.Control.Draw;
  private options: DrawControlOptions;

  constructor(map: L.Map, options: DrawControlOptions = {}) {
    this.map = map;
    this.options = options;
    this.drawnItems = new L.FeatureGroup();
    this.drawControl = this.createDrawControl();
    this.initialize();
  }

  private createDrawControl(): L.Control.Draw {
    return new L.Control.Draw({
      edit: {
        featureGroup: this.drawnItems,
      },
      draw: {
        polygon: {},
        polyline: {},
        rectangle: {},
        circle: {},
        marker: {},
        circlemarker: {},
      },
    });
  }

  private initialize(): void {
    this.map.addLayer(this.drawnItems);
    this.map.addControl(this.drawControl);
    this.attachEventHandlers();
  }

  private attachEventHandlers(): void {
    this.map.on(L.Draw.Event.CREATED, (event: L.LeafletEvent) => {
      const drawEvent = event as L.DrawEvents.Created;
      const layer = drawEvent.layer;
      this.drawnItems.addLayer(layer);

      if (this.options.onShapeCreated) {
        this.options.onShapeCreated(
          drawEvent.layerType,
          layer,
          layer.toGeoJSON() as GeoJSON.Feature
        );
      }
    });

    this.map.on(L.Draw.Event.EDITED, (event: L.LeafletEvent) => {
      const drawEvent = event as L.DrawEvents.Edited;
      const layers = drawEvent.layers;

      if (this.options.onShapeEdited) {
        this.options.onShapeEdited(layers);
      }
    });

    this.map.on(L.Draw.Event.DELETED, (event: L.LeafletEvent) => {
      const drawEvent = event as L.DrawEvents.Deleted;
      const layers = drawEvent.layers;

      if (this.options.onShapeDeleted) {
        this.options.onShapeDeleted(layers);
      }
    });
  }

  public getDrawnItems(): L.FeatureGroup {
    return this.drawnItems;
  }

  public clearAll(): void {
    this.drawnItems.clearLayers();
  }

  public destroy(): void {
    this.map.off(L.Draw.Event.CREATED);
    this.map.off(L.Draw.Event.EDITED);
    this.map.off(L.Draw.Event.DELETED);
    this.map.removeControl(this.drawControl);
    this.map.removeLayer(this.drawnItems);
  }

  public exportGeoJSON(): GeoJSON.FeatureCollection {
    return this.drawnItems.toGeoJSON() as GeoJSON.FeatureCollection;
  }

  public importGeoJSON(geoJSON: GeoJSON.FeatureCollection): void {
    this.clearAll();
    L.geoJSON(geoJSON, {
      onEachFeature: (feature, layer) => {
        this.drawnItems.addLayer(layer);
      },
    });
  }
}
