export interface PolygonPopupData {
  type: string;
  area: string;
  pointCount: number;
  pointsTable: string;
}

export interface CirclePopupData {
  radius: string;
  area: string;
  centerLat: string;
  centerLng: string;
}

export interface MarkerPopupData {
  lat: string;
  lng: string;
}

export function createPolygonPopup(data: PolygonPopupData): string {
  return `
    <div style="min-width: 220px; max-height: 300px; overflow-y: auto;">
      <strong style="font-size: 12px;">Informações da Área</strong>
      <hr style="margin: 8px 0; border: none; border-top: 1px solid #ddd;">
      <table style="width: 100%; font-size: 11px;">
        <tr>
          <td style="color: #666;">Tipo:</td>
          <td style="text-align: right; font-weight: 500;">${data.type}</td>
        </tr>
        <tr>
          <td style="color: #666;">Área:</td>
          <td style="text-align: right; font-weight: 500;">${data.area}</td>
        </tr>
        <tr>
          <td style="color: #666;">Pontos:</td>
          <td style="text-align: right; font-weight: 500;">${data.pointCount}</td>
        </tr>
      </table>
      <hr style="margin: 8px 0; border: none; border-top: 1px solid #ddd;">
      <strong style="font-size: 11px;">Coordenadas</strong>
      <table style="width: 100%; font-size: 11px; margin-top: 4px;">
        ${data.pointsTable}
      </table>
    </div>
  `;
}

export function createCirclePopup(data: CirclePopupData): string {
  return `
    <div style="min-width: 200px;">
      <strong style="font-size: 12px;">Informações do Círculo</strong>
      <hr style="margin: 8px 0; border: none; border-top: 1px solid #ddd;">
      <table style="width: 100%; font-size: 11px;">
        <tr>
          <td style="color: #666;">Tipo:</td>
          <td style="text-align: right; font-weight: 500;">Círculo</td>
        </tr>
        <tr>
          <td style="color: #666;">Raio:</td>
          <td style="text-align: right; font-weight: 500;">${data.radius}</td>
        </tr>
        <tr>
          <td style="color: #666;">Área:</td>
          <td style="text-align: right; font-weight: 500;">${data.area}</td>
        </tr>
        <tr>
          <td style="color: #666;">Centro:</td>
          <td style="text-align: right; font-weight: 500;">${data.centerLat}, ${data.centerLng}</td>
        </tr>
      </table>
    </div>
  `;
}

export function createMarkerPopup(data: MarkerPopupData): string {
  return `
    <div style="min-width: 200px;">
      <strong style="font-size: 12px;">Informações do Marcador</strong>
      <hr style="margin: 8px 0; border: none; border-top: 1px solid #ddd;">
      <table style="width: 100%; font-size: 11px;">
        <tr>
          <td style="color: #666;">Tipo:</td>
          <td style="text-align: right; font-weight: 500;">Marcador</td>
        </tr>
        <tr>
          <td style="color: #666;">Latitude:</td>
          <td style="text-align: right; font-weight: 500;">${data.lat}</td>
        </tr>
        <tr>
          <td style="color: #666;">Longitude:</td>
          <td style="text-align: right; font-weight: 500;">${data.lng}</td>
        </tr>
      </table>
    </div>
  `;
}

export function createPointRow(
  index: number,
  lat: string,
  lng: string
): string {
  return `
    <tr>
      <td style="color: #666;">Ponto ${index}:</td>
      <td style="text-align: right; font-weight: 500;">${lat}, ${lng}</td>
    </tr>
  `;
}
