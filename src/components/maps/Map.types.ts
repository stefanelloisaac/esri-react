export interface MapProps {
  height?: string;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export interface MapBounds {
  southwest: [number, number];
  northeast: [number, number];
}
