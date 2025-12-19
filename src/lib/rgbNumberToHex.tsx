export function rgbNumberToHex(colorNumber: number): string {
  const r = (colorNumber >> 16) & 0xff
  const g = (colorNumber >> 8) & 0xff
  const b = colorNumber & 0xff
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
