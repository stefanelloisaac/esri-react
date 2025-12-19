interface TalhaoPosition {
  ordemposicaotalhao: number
  codigotalhao: number
  latitudetalhao: string
  longitudetalhao: string
}

interface TalhaoData {
  talhao: {
    codigotalhao: number
    descricaotalhao?: string
    hectarestalhao?: number
  }
  posicoestalhao: TalhaoPosition[]
}

export function geoJSONToTalhao(
  geoJSON: GeoJSON.FeatureCollection,
  baseCodigoTalhao: number = 1,
): TalhaoData[] {
  const talhoes: TalhaoData[] = []

  geoJSON.features.forEach((feature, featureIndex) => {
    if (feature.geometry.type !== 'Polygon') {
      console.warn(`Skipping non-polygon geometry: ${feature.geometry.type}`)
      return
    }

    const coordinates = feature.geometry.coordinates[0]
    const codigotalhao = baseCodigoTalhao + featureIndex

    const positions = coordinates.slice(
      0,
      coordinates[0][0] === coordinates[coordinates.length - 1][0] &&
        coordinates[0][1] === coordinates[coordinates.length - 1][1]
        ? -1
        : coordinates.length,
    )

    const posicoestalhao: TalhaoPosition[] = positions.map((coord, index) => ({
      ordemposicaotalhao: index + 1,
      codigotalhao,
      longitudetalhao: coord[0].toFixed(8),
      latitudetalhao: coord[1].toFixed(8),
    }))

    const talhao = {
      codigotalhao,
      descricaotalhao:
        feature.properties?.descricaotalhao || `TALHÃO ${String(codigotalhao).padStart(4, '0')}`,
      hectarestalhao: feature.properties?.hectarestalhao,
    }

    talhoes.push({
      talhao,
      posicoestalhao,
    })
  })

  return talhoes
}

export function featureToTalhao(feature: GeoJSON.Feature, codigotalhao: number): TalhaoData | null {
  if (feature.geometry.type !== 'Polygon') {
    console.warn(`Feature is not a polygon: ${feature.geometry.type}`)
    return null
  }

  const coordinates = feature.geometry.coordinates[0]

  const positions = coordinates.slice(
    0,
    coordinates[0][0] === coordinates[coordinates.length - 1][0] &&
      coordinates[0][1] === coordinates[coordinates.length - 1][1]
      ? -1
      : coordinates.length,
  )

  const posicoestalhao: TalhaoPosition[] = positions.map((coord, index) => ({
    ordemposicaotalhao: index + 1,
    codigotalhao,
    longitudetalhao: coord[0].toFixed(8),
    latitudetalhao: coord[1].toFixed(8),
  }))

  const talhao = {
    codigotalhao,
    descricaotalhao:
      feature.properties?.descricaotalhao || `TALHÃO ${String(codigotalhao).padStart(4, '0')}`,
    hectarestalhao: feature.properties?.hectarestalhao,
  }

  return {
    talhao,
    posicoestalhao,
  }
}
