import { Timestamp } from "firebase/firestore";
import { Polygon } from "@/models";

export interface PolygonDocument {
  title: string;
  polygon: Polygon;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
  deletedAt: Timestamp | null;
}
