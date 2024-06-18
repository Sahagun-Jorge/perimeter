import { useQueryCollection } from "@/firestore/useQueryCollection";
import { polygonConverter } from "@/models";
import { where } from "firebase/firestore";

export const usePolygons = () => {
  // const query = [where("deletedAt", "==", null)];
  const query = [where("title", "!=", "")];

  return useQueryCollection("polygons", polygonConverter, { query });
};
