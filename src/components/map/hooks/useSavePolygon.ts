import { useSaveDoc } from "@/firestore";
import { Polygon } from "@/models";
import { useCallback } from "react";

export const useSavePolygon = () => {
  const { save, isSaving } = useSaveDoc("polygons");

  const savePolygon = useCallback(
    async (title: string, polygon: Polygon) => {
      await save({ title, polygon }, polygon.id?.toString());
    },
    [save]
  );

  return { savePolygon, isSaving };
};
