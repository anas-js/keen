// db.ts
import Dexie, { type EntityTable } from "dexie";

export type categorie = {
  id: number;
  title: string;
};

export type exercise = {
  id: number;
  title: string;
  img: string;
  categorie_id: number;
};

export type day = {
  id: number;
  date: number;
  rounds: {
    repet: number;
    weight: number;
    unit: "kg" | "lb";
  }[];
  exercise_id: number;
};

export type settings = {
  id: number;
  name : string | null
  dateInit : number | null,
  defaultUnit : "kg" | "lb"
};

const db = new Dexie("keen") as Dexie & {
  categories: EntityTable<categorie, "id">;
  exercises: EntityTable<exercise, "id">;
  days: EntityTable<day, "id">;
  settings: EntityTable<settings, "id">;
};

 db.version(1).stores({
  categories: "++id",
  exercises: "++id, categorie_id",
  days: "++id,[exercise_id+date], exercise_id, date",
  settings: "++id"
});




export { db };
