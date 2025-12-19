import L from 'leaflet'
import { MapBoundaryDefinition, MapBoundaryManagerOptions } from '../../_types'

export class BoundaryManager {
  private map: L.Map
  private options: MapBoundaryManagerOptions
  private currentBoundary: MapBoundaryDefinition | null = null
  private dragHandler: (() => void) | null = null
  private tileLoadHandler: (() => void) | null = null
  private transitionTimeoutId: ReturnType<typeof setTimeout> | null = null
  private isDestroyed: boolean = false

  constructor(map: L.Map, options: MapBoundaryManagerOptions = {}) {
    this.map = map
    this.options = options
  }

  private isMapValid(): boolean {
    if (this.isDestroyed) return false
    try {
      const container = this.map.getContainer()
      return container !== null && container !== undefined
    } catch {
      return false
    }
  }

  public changeBoundary(boundary: MapBoundaryDefinition, animate = true): void {
    if (!this.isMapValid()) return

    if (this.transitionTimeoutId) {
      clearTimeout(this.transitionTimeoutId)
      this.transitionTimeoutId = null
    }

    this.options.onLoadingStart?.()

    this.removeBoundaryEnforcement()

    this.currentBoundary = boundary

    this.map.setMinZoom(boundary.minZoom)

    if (animate) {
      this.map.flyTo(boundary.center, boundary.defaultZoom, {
        duration: 1,
        easeLinearity: 0.5,
      })

      this.transitionTimeoutId = setTimeout(() => {
        if (!this.isMapValid()) return

        this.attachBoundaryEnforcement(boundary.bounds)
        this.setupTileLoadListener()
      }, 1100)
    } else {
      this.map.setView(boundary.center, boundary.defaultZoom, {
        animate: false,
      })

      this.attachBoundaryEnforcement(boundary.bounds)

      setTimeout(() => {
        if (this.isMapValid()) {
          this.setupTileLoadListener()
        }
      }, 100)
    }
  }

  private setupTileLoadListener(): void {
    if (!this.isMapValid()) return

    if (this.tileLoadHandler) {
      this.map.off('moveend', this.tileLoadHandler)
      this.tileLoadHandler = null
    }

    setTimeout(() => {
      if (this.isMapValid()) {
        this.options.onTilesLoaded?.()
      }
    }, 100)
  }

  private attachBoundaryEnforcement(bounds: L.LatLngBoundsExpression): void {
    if (!this.isMapValid()) return

    this.map.setMaxBounds(bounds)

    this.dragHandler = () => {
      if (this.isMapValid()) {
        this.map.panInsideBounds(bounds, { animate: false })
      }
    }

    this.map.on('drag', this.dragHandler)
  }

  private removeBoundaryEnforcement(): void {
    if (!this.isMapValid()) return

    if (this.dragHandler) {
      this.map.off('drag', this.dragHandler)
      this.dragHandler = null
    }

    this.map.setMaxBounds(null as unknown as L.LatLngBoundsExpression)
  }

  public getCurrentBoundary(): MapBoundaryDefinition | null {
    return this.currentBoundary
  }

  public destroy(): void {
    this.isDestroyed = true

    if (this.transitionTimeoutId) {
      clearTimeout(this.transitionTimeoutId)
      this.transitionTimeoutId = null
    }

    try {
      if (this.dragHandler) {
        this.map.off('drag', this.dragHandler)
        this.dragHandler = null
      }
      if (this.tileLoadHandler) {
        this.map.off('moveend', this.tileLoadHandler)
        this.tileLoadHandler = null
      }
    } catch {}

    this.currentBoundary = null
  }
}
