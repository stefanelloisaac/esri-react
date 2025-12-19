export interface DrawColor {
  id: string
  name: string
  hex: string
  fillOpacity: number
}

export const DEFAULT_DRAW_COLOR: DrawColor = {
  id: 'default',
  name: 'Padrão',
  hex: '#3b82f6',
  fillOpacity: 0.25,
}

export interface ShapeOptions {
  color: string
  fillColor: string
  fillOpacity: number
  weight: number
}

export function getShapeOptions(color: DrawColor): ShapeOptions {
  return {
    color: color.hex,
    fillColor: color.hex,
    fillOpacity: color.fillOpacity,
    weight: 3,
  }
}
