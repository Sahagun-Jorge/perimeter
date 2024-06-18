import { useSaveDoc } from "@/firestore";
import { Polygon, Position, Feature, GeoJsonProperties } from "geojson";
import { useCallback } from "react";

interface DBCoordinateArrays {
  [key: number]: DBCoordinates;
}

interface DBCoordinates {
  [key: number]: Position;
}

export const useSavePolygon = () => {
  const { save, isSaving } = useSaveDoc("polygons");

  const savePolygon = useCallback(
    async (title: string, polygon: Feature<Polygon, GeoJsonProperties>) => {
      const mappedCoordinateArrays = polygon.geometry.coordinates.reduce(
        (coordinateArraysMap, coordinatesArray, idx) => {
          const mappedCoordinates = coordinatesArray.reduce(
            (coordinatesMap, coordinate, idx) => {
              coordinatesMap[idx] = coordinate;
              return coordinatesMap;
            },
            {} as DBCoordinates
          );
          coordinateArraysMap[idx] = mappedCoordinates;
          return coordinateArraysMap;
        },
        {} as DBCoordinateArrays
      );

      const polygonData = {
        title,
        polygon: {
          ...polygon,
          geometry: {
            ...polygon.geometry,
            coordinates: mappedCoordinateArrays,
          },
        },
      };

      await save(polygonData, polygon.id?.toString());
    },
    [save]
  );

  return { savePolygon, isSaving };
};
