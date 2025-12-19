import { BOUNDARIES } from './data'

function isPointInBounds(
  lat: number,
  lng: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLat, minLng], [maxLat, maxLng]] = bounds
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng
}

function extractCoordinates(geoJSON: GeoJSON.FeatureCollection): Array<[number, number]> {
  const coords: Array<[number, number]> = []

  geoJSON.features.forEach((feature) => {
    if (!feature.geometry) return

    const processCoordinates = (coordinates: unknown): void => {
      if (Array.isArray(coordinates)) {
        if (
          coordinates.length >= 2 &&
          typeof coordinates[0] === 'number' &&
          typeof coordinates[1] === 'number'
        ) {
          coords.push([coordinates[1] as number, coordinates[0] as number])
        } else {
          coordinates.forEach(processCoordinates)
        }
      }
    }

    if (feature.geometry.type === 'GeometryCollection') {
      feature.geometry.geometries.forEach((geom) => {
        if ('coordinates' in geom) {
          processCoordinates(geom.coordinates)
        }
      })
    } else if ('coordinates' in feature.geometry) {
      processCoordinates(feature.geometry.coordinates)
    }
  })

  return coords
}

export function detectBoundariesFromGeoJSON(
  geoJSON: GeoJSON.FeatureCollection | null | undefined,
): string[] {
  if (!geoJSON || !geoJSON.features || geoJSON.features.length === 0) {
    return []
  }

  const coordinates = extractCoordinates(geoJSON)
  if (coordinates.length === 0) {
    return []
  }

  const detectedBoundaries = new Set<string>()

  coordinates.forEach(([lat, lng]) => {
    Object.entries(BOUNDARIES).forEach(([id, boundary]) => {
      if (isPointInBounds(lat, lng, boundary.bounds)) {
        detectedBoundaries.add(id)
      }
    })
  })

  return Array.from(detectedBoundaries)
}

export function detectBoundaryFromCoordinates(coordinates: Array<[number, number]>): string | null {
  for (const [lat, lng] of coordinates) {
    for (const [id, boundary] of Object.entries(BOUNDARIES)) {
      if (isPointInBounds(lat, lng, boundary.bounds)) {
        return id
      }
    }
  }
  return null
}
