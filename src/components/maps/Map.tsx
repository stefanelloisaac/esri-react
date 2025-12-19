'use client'

import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import L from 'leaflet'
import { MAP_CONFIG, BASEMAP_STYLE } from './_configs/config'
import { getMapOptions, getBasemapOptions } from './_configs/options'
import { useLeafletMap, useLeafletCallback } from './_hooks'
import {
  useBoundaryManager,
  getBoundaryById,
  detectBoundariesFromGeoJSON,
  detectBoundaryFromCoordinates,
} from './_lib/_boundaries'
import { useMapDraw } from './_lib/_draw'
import { MapBoundarySelector } from './_components/MapBoundarySelector'
import { MapSearchInput } from './_components/MapSearchInput'
import { MapLoader } from './_components/MapLoader'
import { MapDrawingControls } from './_components/MapDrawingControls'
import { DEFAULT_DRAW_COLOR, getShapeOptions, type DrawColor } from './_lib/_draw/colors'
import type { MapProps } from './_types'
import 'leaflet-draw/dist/leaflet.draw.css'
import './map-styles.css'
import { cn } from '@/lib/utils'

export default function Map({
  data,
  searchField = 'descricaotalhao',
  height,
  className = '',
  onShapeCreated,
  onShapeEdited,
  onShapeDeleted,
  onSave,
  allowedStates = [],
}: MapProps) {
  // MARK: - Refs
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const hasLoadedInitialData = useRef(false)
  const matchingLayersRef = useRef<L.Layer[]>([])
  const currentMatchIndexRef = useRef(0)

  // MARK: - Estados
  const [isLoading, setIsLoading] = useState(true)
  const [isMapReady, setIsMapReady] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [selectedColor, setSelectedColor] = useState<DrawColor>(DEFAULT_DRAW_COLOR)
  const [currentSearchQuery, setCurrentSearchQuery] = useState('')

  // MARK: - Detecção de Limites
  const detectedBoundariesFromData = useMemo(() => detectBoundariesFromGeoJSON(data), [data])

  // Combina boundaries detectados do GeoJSON com estados permitidos manualmente
  const detectedBoundaries = useMemo(() => {
    const combined = new Set<string>()
    detectedBoundariesFromData.forEach((id) => combined.add(id))
    allowedStates.forEach((id) => combined.add(id.toLowerCase()))
    return Array.from(combined)
  }, [detectedBoundariesFromData, allowedStates])

  const defaultBoundary = detectedBoundaries?.[0]
  const [selectedBoundary, setSelectedBoundary] = useState<string | undefined>(defaultBoundary)

  const initialBoundaryDef = defaultBoundary ? getBoundaryById(defaultBoundary) : undefined

  const currentBoundaryDef = selectedBoundary ? getBoundaryById(selectedBoundary) : undefined

  // MARK: - Configurações do Mapa
  const mapOptions = useMemo(
    () => getMapOptions(currentBoundaryDef?.bounds, currentBoundaryDef?.minZoom),
    [currentBoundaryDef],
  )

  const basemapOptions = getBasemapOptions(process.env.NEXT_PUBLIC_ARCGIS_API_KEY)

  const leafletMapOptions = useMemo(
    () => ({
      mapOptions,
      basemapStyle: BASEMAP_STYLE,
      basemapOptions,
      initialCenter: initialBoundaryDef?.center ?? MAP_CONFIG.DEFAULT_CENTER,
      initialZoom: initialBoundaryDef?.defaultZoom ?? MAP_CONFIG.DEFAULT_ZOOM,
    }),
    [mapOptions, basemapOptions, initialBoundaryDef],
  )

  // MARK: - Inicialização do Mapa
  const callbacksRef = useLeafletCallback({
    onShapeCreated,
    onShapeEdited,
    onShapeDeleted,
  })

  const { mapRef, isInitializedRef } = useLeafletMap(mapContainerRef, leafletMapOptions)

  const { drawManagerRef } = useMapDraw(mapRef, isInitializedRef, callbacksRef)

  useBoundaryManager(mapRef, isInitializedRef, {
    selectedBoundary,
    onLoadingStart: () => {
      setIsLoading(true)
    },
    onTilesLoaded: () => {
      setIsLoading(false)
    },
  })

  // MARK: - Estados Derivados
  const isCombinedLoading = isLoading

  // MARK: - Handlers
  const handleBoundaryChange = (boundaryId: string) => {
    setSelectedBoundary(boundaryId)
    setCurrentSearchQuery('')
    handleSearch('')
  }

  const handleColorChange = useCallback(
    (color: DrawColor) => {
      setSelectedColor(color)
      if (drawManagerRef.current) {
        drawManagerRef.current.setDrawColor(color)
      }
    },
    [drawManagerRef],
  )

  const handleSave = useCallback(() => {
    if (!drawManagerRef.current) return

    const geoJSON = drawManagerRef.current.exportGeoJSON()
    onSave?.(geoJSON)
    setHasUnsavedChanges(false)

    toast.success('Sucesso!', {
      description: 'Desenhos salvos com sucesso!',
    })
  }, [drawManagerRef, onSave])

  const handleClear = useCallback(() => {
    if (!drawManagerRef.current) return

    drawManagerRef.current.clearAll()
    setHasUnsavedChanges(false)
  }, [drawManagerRef])

  const handleSearch = useCallback(
    (query: string) => {
      if (!drawManagerRef.current || !mapRef.current) return

      setCurrentSearchQuery(query)

      const drawnItems = drawManagerRef.current.getDrawnItems()
      const normalizedQuery = query.toLowerCase().trim()
      const matchingLayers: L.Layer[] = []

      drawnItems.eachLayer((layer: L.Layer) => {
        const geoJSONLayer = layer as L.Layer & { feature?: GeoJSON.Feature }
        const fieldValue = geoJSONLayer.feature?.properties?.[searchField] || ''

        const matches = String(fieldValue).toLowerCase().includes(normalizedQuery)

        let isInSelectedBoundary = true
        if (selectedBoundary && geoJSONLayer.feature?.geometry) {
          const coords: Array<[number, number]> = []
          const geometry = geoJSONLayer.feature.geometry

          if (geometry.type === 'Polygon' && Array.isArray(geometry.coordinates[0])) {
            geometry.coordinates[0].forEach((coord: number[]) => {
              if (Array.isArray(coord) && coord.length === 2) {
                coords.push([coord[1], coord[0]])
              }
            })
          }

          const layerBoundary = detectBoundaryFromCoordinates(coords)
          isInSelectedBoundary = layerBoundary === selectedBoundary
        }

        if (matches && normalizedQuery !== '' && isInSelectedBoundary) {
          matchingLayers.push(layer)
        }

        if ('setStyle' in layer && typeof layer.setStyle === 'function') {
          const currentColor = geoJSONLayer.feature?.properties?.drawColor || DEFAULT_DRAW_COLOR
          const shapeOptions = getShapeOptions(currentColor)

          if (normalizedQuery === '') {
            ;(layer as L.Path).setStyle({
              opacity: shapeOptions.weight ? shapeOptions.weight / 3 : 0.65,
              fillOpacity: shapeOptions.fillOpacity || 0.2,
            })
          } else if (matches && isInSelectedBoundary) {
            ;(layer as L.Path).setStyle({
              opacity: 1,
              fillOpacity: 0.5,
            })
          } else {
            ;(layer as L.Path).setStyle({
              opacity: 0.2,
              fillOpacity: 0.05,
            })
          }
        }
      })

      matchingLayersRef.current = matchingLayers
      currentMatchIndexRef.current = 0

      if (matchingLayers.length > 0) {
        const layer = matchingLayers[0]
        if ('getBounds' in layer && typeof layer.getBounds === 'function') {
          mapRef.current?.fitBounds((layer as L.Polygon).getBounds(), {
            padding: [50, 50],
          })
        } else if ('getLatLng' in layer && typeof layer.getLatLng === 'function') {
          mapRef.current?.setView((layer as L.Circle).getLatLng(), mapRef.current.getZoom())
        }
      }
    },
    [drawManagerRef, mapRef, selectedBoundary, searchField],
  )

  const handleCycle = useCallback(() => {
    if (!mapRef.current || matchingLayersRef.current.length === 0) return

    currentMatchIndexRef.current =
      (currentMatchIndexRef.current + 1) % matchingLayersRef.current.length

    const layer = matchingLayersRef.current[currentMatchIndexRef.current]

    if ('getBounds' in layer && typeof layer.getBounds === 'function') {
      mapRef.current.fitBounds((layer as L.Polygon).getBounds(), {
        padding: [50, 50],
      })
    } else if ('getLatLng' in layer && typeof layer.getLatLng === 'function') {
      mapRef.current.setView((layer as L.Circle).getLatLng(), mapRef.current.getZoom())
    }
  }, [mapRef])

  // MARK: - Effects
  useEffect(() => {
    if (hasLoadedInitialData.current) return

    const checkInterval = setInterval(() => {
      if (drawManagerRef.current && isInitializedRef.current) {
        setIsMapReady(true)

        if (data) {
          drawManagerRef.current.importGeoJSON(data, true)
          hasLoadedInitialData.current = true
        }

        clearInterval(checkInterval)
      }
    }, 100)

    return () => clearInterval(checkInterval)
  }, [drawManagerRef, isInitializedRef, data])

  useEffect(() => {
    if (!drawManagerRef.current) return

    const changeHandler = () => {
      setHasUnsavedChanges(true)
    }

    const map = mapRef.current
    if (!map) return

    map.on('draw:created', changeHandler)
    map.on('draw:edited', changeHandler)
    map.on('draw:deleted', changeHandler)

    return () => {
      map.off('draw:created', changeHandler)
      map.off('draw:edited', changeHandler)
      map.off('draw:deleted', changeHandler)
    }
  }, [drawManagerRef, mapRef])

  useEffect(() => {
    if (currentSearchQuery && drawManagerRef.current && mapRef.current) {
      handleSearch(currentSearchQuery)
    }
  }, [selectedBoundary, currentSearchQuery, handleSearch, drawManagerRef, mapRef])

  // MARK: - Render
  const containerStyle = useMemo(
    () => ({
      height: height || '100%',
      width: '100%',
    }),
    [height],
  )

  return (
    <div className='relative isolate overflow-hidden rounded-lg border' style={containerStyle}>
      <div className='relative h-full w-full'>
        <div ref={mapContainerRef} className={cn(className, 'h-full w-full')} />
        <MapLoader isLoading={isCombinedLoading} />
      </div>
      <div className='absolute top-4 left-1/2 z-5 flex -translate-x-1/2 items-center gap-1.5'>
        <MapSearchInput
          placeholder='Localizar'
          onSearch={handleSearch}
          onCycle={handleCycle}
          value={currentSearchQuery}
        />
        <MapDrawingControls
          onSave={handleSave}
          onClear={handleClear}
          selectedColor={selectedColor}
          onColorChange={handleColorChange}
          disabled={!isMapReady}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>
      <MapBoundarySelector
        value={selectedBoundary}
        onValueChange={handleBoundaryChange}
        allowedBoundaries={detectedBoundaries}
        className='absolute top-4 right-4 z-5'
      />
    </div>
  )
}
