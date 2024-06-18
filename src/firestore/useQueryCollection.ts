import { db } from "@/firebase";
import {
  FirestoreDataConverter,
  QueryConstraint,
  collection,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  CollectionDataHook,
  useCollectionData,
} from "react-firebase-hooks/firestore";

export interface QueryCollectionOptions {
  query?: QueryConstraint[];
}

export const useQueryCollection = <TModel>(
  path: string,
  converter?: FirestoreDataConverter<TModel>,
  options?: QueryCollectionOptions
): CollectionDataHook<TModel> => {
  const [documents, setDocuments] = useState<TModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [results, _loadingData, ...rest] = useCollectionData(
    query(collection(db, path), ...(options?.query || [])).withConverter(
      converter as FirestoreDataConverter<TModel>
    )
  );

  useEffect(() => {
    const resolver = async () => {
      const resolved = await Promise.all(
        results as unknown as Promise<TModel>[]
      );
      setDocuments(resolved);
      setIsLoading(false);
    };

    if (!_loadingData) {
      if (results) {
        resolver();
      } else {
        setIsLoading(false);
      }
    }
  }, [_loadingData, results]);

  useEffect(() => {
    if (_loadingData) {
      setIsLoading(true);
    }
  }, [_loadingData]);

  return [documents, isLoading, ...rest];
};
