import L from "leaflet";
import "leaflet-draw";
import {
  createPolygonPopup,
  createCirclePopup,
  createPointRow,
} from "./templates";
import { DEFAULT_DRAW_COLOR, getShapeOptions, type DrawColor } from "./colors";
import { MapDrawControlOptions } from "../../_types";
import { rgbNumberToHex } from "@/utils/rgbNumberToHex";

(L as unknown as { drawLocal: typeof L.drawLocal }).drawLocal = {
  draw: {
    toolbar: {
      actions: {
        title: "Cancelar desenho",
        text: "Cancelar",
      },
      finish: {
        title: "Finalizar desenho",
        text: "Finalizar",
      },
      undo: {
        title: "Apagar último ponto desenhado",
        text: "Apagar último ponto",
      },
      buttons: {
        polygon: "Desenhar um polígono",
        polyline: "",
        rectangle: "Desenhar um retângulo",
        circle: "Desenhar um círculo",
        marker: "",
        circlemarker: "",
      },
    },
    handlers: {
      polygon: {
        tooltip: {
          start: "Clique para começar a desenhar.",
          cont: "Clique para continuar desenhando.",
          end: "Clique no primeiro ponto para fechar o polígono.",
        },
      },
      polyline: {
        error: "",
        tooltip: {
          start: "",
          cont: "",
          end: "",
        },
      },
      rectangle: {
        tooltip: {
          start: "Clique e arraste para desenhar um retângulo.",
        },
      },
      circle: {
        tooltip: {
          start: "Clique e arraste para desenhar um círculo.",
        },
        radius: "Raio",
      },
      marker: {
        tooltip: {
          start: "",
        },
      },
      circlemarker: {
        tooltip: {
          start: "",
        },
      },
      simpleshape: {
        tooltip: {
          end: "Solte o mouse para finalizar.",
        },
      },
    },
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: "Salvar alterações",
          text: "Salvar",
        },
        cancel: {
          title: "Cancelar edição, descarta todas as alterações",
          text: "Cancelar",
        },
        clearAll: {
          title: "Limpar todas as camadas",
          text: "Limpar tudo",
        },
      },
      buttons: {
        edit: "Editar camadas",
        editDisabled: "Nenhuma camada para editar",
        remove: "Excluir camadas",
        removeDisabled: "Nenhuma camada para excluir",
      },
    },
    handlers: {
      edit: {
        tooltip: {
          text: "Arraste os pontos ou marcadores para editar.",
          subtext: "Clique em cancelar para desfazer as alterações.",
        },
      },
      remove: {
        tooltip: {
          text: "Clique em um elemento para remover.",
        },
      },
    },
  },
};

export class MapDrawManager {
  private map: L.Map;
  private drawnItems: L.FeatureGroup;
  private drawControl: L.Control.Draw;
  private options: MapDrawControlOptions;
  private currentColor: DrawColor;
  private drawingCounter: number;
  private initialLayerIds: Set<number>;

  constructor(map: L.Map, options: MapDrawControlOptions = {}) {
    this.map = map;
    this.options = options;
    this.drawnItems = new L.FeatureGroup();
    this.currentColor = DEFAULT_DRAW_COLOR;
    this.drawingCounter = 1;
    this.initialLayerIds = new Set<number>();
    this.drawControl = this.createDrawControl();
    this.initialize();
  }

  private createDrawControl(): L.Control.Draw {
    const shapeOptions = getShapeOptions(this.currentColor);

    return new L.Control.Draw({
      position: "topleft",
      edit: {
        featureGroup: this.drawnItems,
      },
      draw: {
        polygon: { shapeOptions },
        polyline: false,
        rectangle: { shapeOptions },
        circle: { shapeOptions },
        marker: false,
        circlemarker: false,
      },
    });
  }

  public setDrawColor(color: DrawColor): void {
    this.currentColor = color;
    try {
      this.map.removeControl(this.drawControl);
    } catch (e) {
      console.warn("Error removing draw control:", e);
    }
    this.drawControl = this.createDrawControl();
    try {
      this.map.addControl(this.drawControl);
    } catch (e) {
      console.error("Error adding draw control:", e);
    }
  }

  private generateDrawingName(): string {
    const formattedNumber = String(this.drawingCounter).padStart(4, "0");
    this.drawingCounter++;
    return `${formattedNumber} - TALHÃO`;
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
      const geoJSONLayer = layer as L.Layer & {
        feature?: GeoJSON.Feature;
        toGeoJSON: () => GeoJSON.Feature;
      };

      if (!geoJSONLayer.feature) {
        geoJSONLayer.feature = {
          type: "Feature",
          properties: {},
          geometry: geoJSONLayer.toGeoJSON().geometry,
        };
      }
      if (!geoJSONLayer.feature.properties) {
        geoJSONLayer.feature.properties = {};
      }
      geoJSONLayer.feature.properties.drawColor = this.currentColor;
      geoJSONLayer.feature.properties.descricaotalhao =
        this.generateDrawingName();

      this.applyColorToLayer(layer, this.currentColor);

      this.drawnItems.addLayer(layer);
      this.bindPopupToLayer(layer, drawEvent.layerType);

      if (this.options.onShapeCreated) {
        const geoJSON = geoJSONLayer.toGeoJSON() as GeoJSON.Feature;
        this.options.onShapeCreated(drawEvent.layerType, layer, geoJSON);
      }
    });

    this.map.on(L.Draw.Event.EDITED, (event: L.LeafletEvent) => {
      const drawEvent = event as L.DrawEvents.Edited;
      const layers = drawEvent.layers;

      layers.eachLayer((layer: L.Layer) => {
        const layerType = this.getLayerType(layer);
        this.bindPopupToLayer(layer, layerType);
      });

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
    const layersToRemove: L.Layer[] = [];

    this.drawnItems.eachLayer((layer: L.Layer) => {
      const layerId = L.Util.stamp(layer);
      if (!this.initialLayerIds.has(layerId)) {
        layersToRemove.push(layer);
      }
    });

    layersToRemove.forEach((layer) => {
      this.drawnItems.removeLayer(layer);
    });
  }

  public destroy(): void {
    this.map.off(L.Draw.Event.CREATED);
    this.map.off(L.Draw.Event.EDITED);
    this.map.off(L.Draw.Event.DELETED);
    this.map.removeControl(this.drawControl);
    this.map.removeLayer(this.drawnItems);
  }

  public exportGeoJSON(): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = [];

    this.drawnItems.eachLayer((layer: L.Layer) => {
      const geoJSONLayer = layer as L.Layer & {
        toGeoJSON: () => GeoJSON.Feature;
        feature?: GeoJSON.Feature;
      };

      const feature = geoJSONLayer.toGeoJSON();

      if (layer instanceof L.Circle) {
        const circle = layer as L.Circle;
        feature.properties = {
          ...feature.properties,
          radius: circle.getRadius(),
          center: [circle.getLatLng().lat, circle.getLatLng().lng],
          layerType: "circle",
        };
      }

      if (geoJSONLayer.feature?.properties?.drawColor) {
        feature.properties = {
          ...feature.properties,
          drawColor: geoJSONLayer.feature.properties.drawColor,
        };
      }

      if (geoJSONLayer.feature?.properties?.descricaotalhao) {
        feature.properties = {
          ...feature.properties,
          descricaotalhao: geoJSONLayer.feature.properties.descricaotalhao,
        };
      }

      features.push(feature);
    });

    return {
      type: "FeatureCollection",
      features,
    };
  }

  public importGeoJSON(
    geoJSON: GeoJSON.FeatureCollection,
    isInitialData: boolean = false,
  ): void {
    if (isInitialData) {
      this.drawnItems.clearLayers();
      this.initialLayerIds.clear();
    } else {
      this.clearAll();
    }

    let maxCounter = 0;
    geoJSON.features.forEach((feature) => {
      if (feature.properties?.descricaotalhao) {
        const match = feature.properties.descricaotalhao.match(/^(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxCounter) {
            maxCounter = num;
          }
        }
      }
    });
    this.drawingCounter = maxCounter + 1;

    geoJSON.features.forEach((feature) => {
      const drawColor = this.getOrCreateDrawColor(feature);

      if (feature.properties?.layerType === "circle") {
        const center = feature.properties.center as [number, number];
        const radius = feature.properties.radius as number;

        const circle = L.circle([center[0], center[1]], { radius });
        const geoJSONLayer = circle as L.Layer & { feature?: GeoJSON.Feature };
        geoJSONLayer.feature = feature;

        if (drawColor) {
          geoJSONLayer.feature.properties = {
            ...geoJSONLayer.feature.properties,
            drawColor,
          };
          this.applyColorToLayer(circle, drawColor);
        }

        this.drawnItems.addLayer(circle);

        if (isInitialData) {
          const layerId = L.Util.stamp(circle);
          this.initialLayerIds.add(layerId);
        }

        this.bindPopupToLayer(circle, "circle");
      } else {
        L.geoJSON(feature, {
          onEachFeature: (_f, layer) => {
            const geoJSONLayer = layer as L.Layer & {
              feature?: GeoJSON.Feature;
            };
            geoJSONLayer.feature = feature;

            if (drawColor) {
              geoJSONLayer.feature.properties = {
                ...geoJSONLayer.feature.properties,
                drawColor,
              };
              this.applyColorToLayer(layer, drawColor);
            }

            const layerType = this.getLayerType(layer);
            this.bindPopupToLayer(layer, layerType);
            this.drawnItems.addLayer(layer);

            if (isInitialData) {
              const layerId = L.Util.stamp(layer);
              this.initialLayerIds.add(layerId);
            }
          },
        });
      }
    });
  }

  private getOrCreateDrawColor(feature: GeoJSON.Feature): DrawColor | null {
    if (feature.properties?.drawColor) {
      return feature.properties.drawColor;
    }

    if (feature.properties?.corbordatalhao !== undefined) {
      const borderHex = rgbNumberToHex(feature.properties.corbordatalhao);

      return {
        id: "talhao-color",
        name: "Cor do Talhão",
        hex: borderHex,
        fillOpacity: 0.25,
      };
    }

    return null;
  }

  private applyColorToLayer(layer: L.Layer, color: DrawColor): void {
    const shapeOptions = getShapeOptions(color);

    if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
      layer.setStyle({
        color: shapeOptions.color,
        fillColor: shapeOptions.fillColor,
        fillOpacity: shapeOptions.fillOpacity,
        weight: shapeOptions.weight,
      });
    } else if (layer instanceof L.Polyline || layer instanceof L.Polygon) {
      layer.setStyle({
        color: shapeOptions.color,
        fillColor: shapeOptions.fillColor,
        fillOpacity: shapeOptions.fillOpacity,
        weight: shapeOptions.weight,
      });
    }
  }

  private getLayerType(layer: L.Layer): string {
    if (layer instanceof L.Circle) return "circle";
    if (layer instanceof L.Rectangle) return "rectangle";
    if (layer instanceof L.Polygon) return "polygon";
    return "unknown";
  }

  private formatNumber(value: number): string {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private formatArea(areaInMeters: number): string {
    if (areaInMeters >= 10000) {
      return `${this.formatNumber(areaInMeters / 10000)} ha`;
    }
    return `${this.formatNumber(areaInMeters)} m²`;
  }

  private formatDistance(distanceInMeters: number): string {
    if (distanceInMeters >= 1000) {
      return `${this.formatNumber(distanceInMeters / 1000)} km`;
    }
    return `${this.formatNumber(distanceInMeters)} m`;
  }

  private calculatePolygonArea(layer: L.Polygon): number {
    const latlngs = layer.getLatLngs()[0] as L.LatLng[];
    return L.GeometryUtil.geodesicArea(latlngs);
  }

  private getPolygonPoints(layer: L.Polygon): L.LatLng[] {
    const latlngs = layer.getLatLngs()[0] as L.LatLng[];
    return latlngs;
  }

  private formatPointsTable(points: L.LatLng[]): string {
    return points
      .map((point, index) =>
        createPointRow(index + 1, point.lat.toFixed(6), point.lng.toFixed(6)),
      )
      .join("");
  }

  private bindPopupToLayer(layer: L.Layer, layerType: string): void {
    let popupContent = "";
    const geoJSONLayer = layer as L.Layer & { feature?: GeoJSON.Feature };
    const name = geoJSONLayer.feature?.properties?.descricaotalhao;

    if (layerType === "polygon" || layerType === "rectangle") {
      const polygonLayer = layer as L.Polygon;
      const area = this.calculatePolygonArea(polygonLayer);
      const points = this.getPolygonPoints(polygonLayer);

      popupContent = createPolygonPopup({
        name,
        type: layerType === "polygon" ? "Polígono" : "Retângulo",
        area: this.formatArea(area),
        pointCount: points.length,
        pointsTable: this.formatPointsTable(points),
      });
    } else if (layerType === "circle") {
      const circleLayer = layer as L.Circle;
      const radius = circleLayer.getRadius();
      const center = circleLayer.getLatLng();
      const area = Math.PI * radius * radius;

      popupContent = createCirclePopup({
        name,
        radius: this.formatDistance(radius),
        area: this.formatArea(area),
        centerLat: center.lat.toFixed(4),
        centerLng: center.lng.toFixed(4),
      });
    }

    if (popupContent && "bindPopup" in layer) {
      (layer as L.Polygon).bindPopup(popupContent);
    }
  }
}
