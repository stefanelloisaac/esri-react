import L from "leaflet";
import type { BoundaryDefinition, BoundaryManagerOptions } from "../types";

export class BoundaryManager {
  private map: L.Map;
  private options: BoundaryManagerOptions;
  private currentBoundary: BoundaryDefinition | null = null;
  private dragHandler: (() => void) | null = null;
  private tileLoadHandler: (() => void) | null = null;
  private transitionTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isDestroyed: boolean = false;

  constructor(map: L.Map, options: BoundaryManagerOptions = {}) {
    this.map = map;
    this.options = options;
  }

  private isMapValid(): boolean {
    if (this.isDestroyed) return false;
    try {
      const container = this.map.getContainer();
      return container !== null && container !== undefined;
    } catch {
      return false;
    }
  }

  public changeBoundary(boundary: BoundaryDefinition): void {
    if (!this.isMapValid()) return;

    if (this.transitionTimeoutId) {
      clearTimeout(this.transitionTimeoutId);
      this.transitionTimeoutId = null;
    }

    this.options.onLoadingStart?.();

    this.removeBoundaryEnforcement();

    this.currentBoundary = boundary;

    this.options.onBoundaryChanged?.(boundary.id);

    this.transitionTimeoutId = setTimeout(() => {
      if (!this.isMapValid()) return;

      this.attachBoundaryEnforcement(boundary.bounds);

      this.setupTileLoadListener();

      this.map.fitBounds(boundary.bounds, {
        padding: [20, 20],
        animate: false,
      });
    }, 1000);
  }

  private setupTileLoadListener(): void {
    if (!this.isMapValid()) return;

    if (this.tileLoadHandler) {
      this.map.off("moveend", this.tileLoadHandler);
    }

    this.tileLoadHandler = () => {
      if (!this.isMapValid()) return;

      setTimeout(() => {
        if (this.isMapValid()) {
          this.options.onTilesLoaded?.();
        }
      }, 300);

      if (this.tileLoadHandler && this.isMapValid()) {
        this.map.off("moveend", this.tileLoadHandler);
        this.tileLoadHandler = null;
      }
    };

    this.map.once("moveend", this.tileLoadHandler);
  }

  private attachBoundaryEnforcement(bounds: L.LatLngBoundsExpression): void {
    if (!this.isMapValid()) return;

    this.map.setMaxBounds(bounds);

    this.dragHandler = () => {
      if (this.isMapValid()) {
        this.map.panInsideBounds(bounds, { animate: false });
      }
    };

    this.map.on("drag", this.dragHandler);
  }

  private removeBoundaryEnforcement(): void {
    if (this.dragHandler && this.isMapValid()) {
      this.map.off("drag", this.dragHandler);
      this.dragHandler = null;
    }
  }

  public getCurrentBoundary(): BoundaryDefinition | null {
    return this.currentBoundary;
  }

  public destroy(): void {
    this.isDestroyed = true;

    if (this.transitionTimeoutId) {
      clearTimeout(this.transitionTimeoutId);
      this.transitionTimeoutId = null;
    }

    try {
      if (this.dragHandler) {
        this.map.off("drag", this.dragHandler);
        this.dragHandler = null;
      }
      if (this.tileLoadHandler) {
        this.map.off("moveend", this.tileLoadHandler);
        this.tileLoadHandler = null;
      }
    } catch {}

    this.currentBoundary = null;
  }
}
