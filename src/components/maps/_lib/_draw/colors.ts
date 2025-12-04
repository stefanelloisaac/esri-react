export interface DrawColor {
  id: string;
  name: string;
  hex: string;
  fillOpacity: number;
}

export const DRAW_COLORS: DrawColor[] = [
  {
    id: "blue",
    name: "Azul",
    hex: "#3388ff",
    fillOpacity: 0.2,
  },
  {
    id: "red",
    name: "Vermelho",
    hex: "#ff3333",
    fillOpacity: 0.2,
  },
  {
    id: "green",
    name: "Verde",
    hex: "#22c55e",
    fillOpacity: 0.2,
  },
  {
    id: "yellow",
    name: "Amarelo",
    hex: "#fbbf24",
    fillOpacity: 0.3,
  },
  {
    id: "purple",
    name: "Roxo",
    hex: "#a855f7",
    fillOpacity: 0.2,
  },
  {
    id: "orange",
    name: "Laranja",
    hex: "#f97316",
    fillOpacity: 0.2,
  },
  {
    id: "pink",
    name: "Rosa",
    hex: "#ec4899",
    fillOpacity: 0.2,
  },
  {
    id: "teal",
    name: "Azul-verde",
    hex: "#14b8a6",
    fillOpacity: 0.2,
  },
];

export const DEFAULT_DRAW_COLOR = DRAW_COLORS[0];

export interface ShapeOptions {
  color: string;
  fillColor: string;
  fillOpacity: number;
  weight: number;
}

export function getShapeOptions(color: DrawColor): ShapeOptions {
  return {
    color: color.hex,
    fillColor: color.hex,
    fillOpacity: color.fillOpacity,
    weight: 3,
  };
}
