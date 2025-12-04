import type { BoundaryDefinition } from "../types";

export const BOUNDARIES: Record<string, BoundaryDefinition> = {
  rs: {
    id: "rs",
    name: "Rio Grande do Sul",
    bounds: [
      [-33.75, -57.65],
      [-27.08, -49.69],
    ],
    center: [-30.03, -51.23],
    defaultZoom: 7,
  },
  mt: {
    id: "mt",
    name: "Mato Grosso",
    bounds: [
      [-18.04, -61.63],
      [-7.35, -50.22],
    ],
    center: [-12.64, -55.42],
    defaultZoom: 6,
  },
  sp: {
    id: "sp",
    name: "São Paulo",
    bounds: [
      [-25.3, -53.1],
      [-19.8, -44.2],
    ],
    center: [-23.5, -46.6],
    defaultZoom: 7,
  },
  rj: {
    id: "rj",
    name: "Rio de Janeiro",
    bounds: [
      [-23.4, -44.9],
      [-20.7, -40.9],
    ],
    center: [-22.9, -43.2],
    defaultZoom: 8,
  },
  mg: {
    id: "mg",
    name: "Minas Gerais",
    bounds: [
      [-22.9, -51.1],
      [-14.2, -39.9],
    ],
    center: [-18.5, -44.4],
    defaultZoom: 6,
  },
  ba: {
    id: "ba",
    name: "Bahia",
    bounds: [
      [-18.3, -46.6],
      [-8.5, -37.3],
    ],
    center: [-12.9, -41.7],
    defaultZoom: 6,
  },
};

export const getBoundaryById = (id: string): BoundaryDefinition | undefined => {
  return BOUNDARIES[id];
};

export const getAllBoundaryIds = (): string[] => {
  return Object.keys(BOUNDARIES);
};

export const getBoundaryNames = (): Array<{ id: string; name: string }> => {
  return Object.entries(BOUNDARIES).map(([id, def]) => ({
    id,
    name: def.name,
  }));
};
