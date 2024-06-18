import { useSaveDoc } from "@/firestore";
import { PolygonDocument } from "@/models";
import { useCallback } from "react";

export const useSavePolygon = () => {
  const { save, isSaving } = useSaveDoc("polygons");

  const savePolygon = useCallback(
    async (polygonDocument: Partial<PolygonDocument>) => {
      await save(
        polygonDocument,
        polygonDocument.polygon?.id?.toString() || undefined
      );
    },
    [save]
  );

  return { savePolygon, isSaving };
};
