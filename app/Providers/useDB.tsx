"use client";
import { Card, CardBody } from "@heroui/react";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

interface Database {
  categories: () => IDBObjectStore;
  exercises: () => IDBObjectStore;
}

export type categories = {
  id: number;
  title: string;
}[];

export type exercises = {
  id: number;
  title: string;
  img: string;
  days: {
    date: string;
    rounds: {
      repet: number;
      weight: number;
      unit: "kg" | "lb";
    }[];
  }[];
  categorie_id : number
}[];

export type days = {
    date: string;
    rounds: {
      repet: number;
      weight: number;
      unit: "kg" | "lb";
    }[];
  categorie_id : number
}[];


const AppContext = createContext<Database>(null!);

export function UseDB() {
  return useContext(AppContext);
}

export function DBProvider({ children }: { children: ReactNode }) {
  // const [loading, setLoading] = useState(true);
  const [db, setDb] = useState<Database>(null!);
  const [error, setError] = useState(false);

  useEffect(() => {
    const init = async () => {
      const request = window.indexedDB.open("keen", 3);

      request.onupgradeneeded = function () {
        const db = request.result;
        if (!db.objectStoreNames.contains("categories")) {
          db.createObjectStore("categories", {
            keyPath: "id",
            autoIncrement: true,
          });
        }

        if (!db.objectStoreNames.contains("exercises")) {
          db.createObjectStore("exercises", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      function newCategoriesTrans(): IDBObjectStore {
        return request.result
          .transaction("categories", "readwrite")
          .objectStore("categories");
      }

      function newExercisesTrans(): IDBObjectStore {
        return request.result
          .transaction("exercises", "readwrite")
          .objectStore("exercises");
      }

      request.onsuccess = async function () {
        setDb({
          categories: newCategoriesTrans,
          exercises: newExercisesTrans,
        });
      };

      // console.error('Failed to initialize database:', error);

      request.onerror = function () {
        setError(true);
      };
    };
    init();
  }, []);

  // useEffect(() => {
  //   console.log(db);
  // },[db])

  if (error) {
    return (
      <Card>
        <CardBody>
          <p className="text-start">
            حدث خطأ في قاعدة البيانات يرجى التواصل مع المطور
          </p>
        </CardBody>
      </Card>
    );
  }
  return <AppContext.Provider value={db}>{children}</AppContext.Provider>;
}
