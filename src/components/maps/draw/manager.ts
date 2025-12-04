import L from "leaflet";
import "leaflet-draw";
import type { DrawControlOptions } from "../types";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
        polyline: "Desenhar uma polilinha",
        polygon: "Desenhar um polígono",
        rectangle: "Desenhar um retângulo",
        circle: "Desenhar um círculo",
        marker: "Adicionar um marcador",
        circlemarker: "Desenhar um marcador circular",
      },
    },
    handlers: {
      circle: {
        tooltip: {
          start: "Clique e arraste para desenhar um círculo.",
        },
        radius: "Raio",
      },
      circlemarker: {
        tooltip: {
          start: "Clique no mapa para posicionar o marcador circular.",
        },
      },
      marker: {
        tooltip: {
          start: "Clique no mapa para posicionar o marcador.",
        },
      },
      polygon: {
        tooltip: {
          start: "Clique para começar a desenhar.",
          cont: "Clique para continuar desenhando.",
          end: "Clique no primeiro ponto para fechar o polígono.",
        },
      },
      polyline: {
        error: "<strong>Erro:</strong> as bordas não podem se cruzar!",
        tooltip: {
          start: "Clique para começar a desenhar.",
          cont: "Clique para continuar desenhando.",
          end: "Clique no último ponto para finalizar.",
        },
      },
      rectangle: {
        tooltip: {
          start: "Clique e arraste para desenhar um retângulo.",
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
        polyline: false,
        rectangle: {},
        circle: {},
        marker: {},
        circlemarker: false,
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
