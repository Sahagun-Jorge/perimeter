import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  PolygonDocument,
  DBCoordinates,
  DBCoordinateArrays,
  DBPolygonDocument,
  Polygon,
} from "@/models";

export const polygonConverter: FirestoreDataConverter<
  PolygonDocument,
  DBPolygonDocument
> = {
  toFirestore(post: PolygonDocument): DBPolygonDocument {
    const mappedCoordinateArrays = post.polygon.geometry.coordinates.reduce(
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

    const polygonData: DBPolygonDocument = {
      ...post,
      polygon: {
        ...post.polygon,
        geometry: {
          ...post.polygon.geometry,
          coordinates: mappedCoordinateArrays,
        },
      },
    };
    return polygonData;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): PolygonDocument => {
    const data = snapshot.data() as DBPolygonDocument;

    const coordinatesList = Object.values(
      data.polygon.geometry.coordinates
    ).map((coordinatesMap) =>
      Object.values(coordinatesMap)
    ) as Polygon["geometry"]["coordinates"];

    return {
      ...data,
      polygon: {
        ...data.polygon,
        geometry: {
          ...data.polygon.geometry,
          coordinates: coordinatesList,
        },
      },
    };
  },
};
