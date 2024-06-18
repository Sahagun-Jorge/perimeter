import { db } from "@/firebase";
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
  const { merge = true, newDoc = false } = options;
  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(
    async (data: Partial<TModel>, id?: string, path?: string) => {
      setIsSaving(true);

      try {
        if (id && !newDoc) {
          await setDoc(
            doc(db, path || documentPath, id),
            { updatedAt: serverTimestamp(), ...data },
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
    [documentPath, merge, newDoc]
  );

  return { save, isSaving };
};
