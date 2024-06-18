import { DBCoordinateArrays, Polygon } from "@/models";

export interface DBPolygonGeometry
  extends Omit<Polygon["geometry"], "coordinates"> {
  coordinates: DBCoordinateArrays;
}
