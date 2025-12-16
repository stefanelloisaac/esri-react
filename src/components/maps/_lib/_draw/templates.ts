export interface PolygonPopupData {
  name?: string;
  type: string;
  area: string;
  pointCount: number;
  pointsTable: string;
}

export interface CirclePopupData {
  name?: string;
  radius: string;
  area: string;
  centerLat: string;
  centerLng: string;
}

const styles = {
  container:
    "min-width: 220px; max-height: 300px; overflow-y: auto; scrollbar-width: thin;",
  containerSmall: "min-width: 200px;",
  title: "font-size: 12px;",
  hr: "margin: 8px 0; border: none; border-top: 1px solid currentColor; opacity: 0.2;",
  table: "width: 100%; font-size: 11px;",
  tableMargin: "width: 100%; font-size: 11px; margin-top: 4px;",
  label: "opacity: 0.7;",
  value: "text-align: right; font-weight: 500;",
  subtitle: "font-size: 11px;",
};

export function createPolygonPopup(data: PolygonPopupData): string {
  const displayName = data.name || "Informações da Área";

  return `
    <div style="${styles.container}">
      <strong style="${styles.title}">${displayName}</strong>
      <hr style="${styles.hr}">
      <table style="${styles.table}">
        <tr>
          <td style="${styles.label}">Tipo:</td>
          <td style="${styles.value}">${data.type}</td>
        </tr>
        <tr>
          <td style="${styles.label}">Área:</td>
          <td style="${styles.value}">${data.area}</td>
        </tr>
        <tr>
          <td style="${styles.label}">Pontos:</td>
          <td style="${styles.value}">${data.pointCount}</td>
        </tr>
      </table>
      <hr style="${styles.hr}">
      <strong style="${styles.subtitle}">Coordenadas</strong>
      <table style="${styles.tableMargin}">
        ${data.pointsTable}
      </table>
    </div>
  `;
}

export function createCirclePopup(data: CirclePopupData): string {
  return `
    <div style="${styles.containerSmall}">
      <strong style="${styles.title}">${data.name || "Informações do Círculo"}</strong>
      <hr style="${styles.hr}">
      <table style="${styles.table}">
        <tr>
          <td style="${styles.label}">Tipo:</td>
          <td style="${styles.value}">Círculo</td>
        </tr>
        <tr>
          <td style="${styles.label}">Raio:</td>
          <td style="${styles.value}">${data.radius}</td>
        </tr>
        <tr>
          <td style="${styles.label}">Área:</td>
          <td style="${styles.value}">${data.area}</td>
        </tr>
        <tr>
          <td style="${styles.label}">Centro:</td>
          <td style="${styles.value}">${data.centerLat}, ${data.centerLng}</td>
        </tr>
      </table>
    </div>
  `;
}

export function createPointRow(
  index: number,
  lat: string,
  lng: string,
): string {
  return `
    <tr>
      <td style="${styles.label}">Ponto ${index}:</td>
      <td style="${styles.value}">${lat}, ${lng}</td>
    </tr>
  `;
}
