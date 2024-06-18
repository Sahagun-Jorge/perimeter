import { Polygon } from "@/models";
import { DBPolygonGeometry } from "./DBPolygonGeometry";

export interface DBPolygon extends Omit<Polygon, "geometry"> {
  geometry: DBPolygonGeometry;
}
