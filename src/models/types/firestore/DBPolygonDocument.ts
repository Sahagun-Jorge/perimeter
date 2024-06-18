import { DBPolygon, PolygonDocument } from "@/models";

export interface DBPolygonDocument extends Omit<PolygonDocument, "polygon"> {
  polygon: DBPolygon;
}
