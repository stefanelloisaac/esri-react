interface TalhaoPosition {
  ordemposicaotalhao: number;
  codigotalhao: number;
  latitudetalhao: string;
  longitudetalhao: string;
}

interface Talhao {
  codigotalhao: number;
  codigopropriedade: number;
  descricaotalhao: string;
  hectarestalhao: number;
  codigocliente: number;
  codigoempresa: number;
  codigostatus: string;
  codigosafra: number;
  corfundotalhao: number;
  corbordatalhao: number;
}

interface TalhaoData {
  talhao: Talhao;
  posicoestalhao: TalhaoPosition[];
}

export function talhaoToGeoJSON(
  talhoes: TalhaoData[],
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = talhoes.map((item) => {
    const { talhao, posicoestalhao } = item;

    const sortedPositions = [...posicoestalhao].sort(
      (a, b) => a.ordemposicaotalhao - b.ordemposicaotalhao,
    );

    const coordinates = sortedPositions.map((pos) => [
      parseFloat(pos.longitudetalhao),
      parseFloat(pos.latitudetalhao),
    ]);

    if (
      coordinates.length > 0 &&
      (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
        coordinates[0][1] !== coordinates[coordinates.length - 1][1])
    ) {
      coordinates.push([...coordinates[0]]);
    }

    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coordinates],
      },
      properties: {
        codigotalhao: talhao.codigotalhao,
        descricaotalhao: talhao.descricaotalhao,
        hectarestalhao: talhao.hectarestalhao,
        codigocliente: talhao.codigocliente,
        codigoempresa: talhao.codigoempresa,
        codigostatus: talhao.codigostatus,
        codigosafra: talhao.codigosafra,
        corfundotalhao: talhao.corfundotalhao,
        corbordatalhao: talhao.corbordatalhao,
      },
    } as GeoJSON.Feature;
  });

  return {
    type: "FeatureCollection",
    features,
  };
}

