import { db } from "@/firebase";
import { polygonConverter } from "@/models/converters/polygonConverter";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useCallback, useState } from "react";

export interface SaveOptions {
  merge?: boolean;
  newDoc?: boolean;
}

export const useSaveDoc = <TModel>(
  documentPath: string,
  options: SaveOptions = {}
) => {
  const { merge = true } = options;
  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(
    async (data: Partial<TModel>, id?: string, path?: string) => {
      setIsSaving(true);

      try {
        if (id) {
          await setDoc(
            doc(db, path || documentPath, id).withConverter(polygonConverter),
            { ...data, updatedAt: serverTimestamp() },
            { merge }
          );
          return id;
        } else {
          const result = await addDoc(collection(db, path || documentPath), {
            ...data,
            createdAt: serverTimestamp(),
            deletedAt: null,
          });
          return result.id;
        }
      } catch (error) {
        console.error("Error saving document:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [documentPath, merge]
  );

  return { save, isSaving };
};
