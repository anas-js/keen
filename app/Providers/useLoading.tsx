"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Loading from "../components/loading";

const LoadingContext = createContext<Dispatch<SetStateAction<boolean>>>(null!);

export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
{/* <Loading full /> */}
  return (
    <LoadingContext.Provider value={setLoading}>
      {loading && <Loading full />}
      {children}
    </LoadingContext.Provider>
  );
}
