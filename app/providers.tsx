"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
// import { DBProvider } from "./Providers/useDB";
import NProgress from "nprogress";

import { LoadingProvider } from "./Providers/useLoading";
import Middlewares from "@/app/Middlewares";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// import Loading from "./components/loading";
export function Providers({ children }: { children: React.ReactNode }) {

  const path = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    NProgress.done();
    // console.log("start");
    return () => {
      NProgress.start();
    };
  }, [path, params]);

  return (
    // <AuthMiddleware>
    <Middlewares>
      <LoadingProvider>
        <HeroUIProvider className="hero-app-layout">
          <ToastProvider />

          {/* <DBProvider> */}
          {children}
          {/* </DBProvider> */}
        </HeroUIProvider>
      </LoadingProvider>
    </Middlewares>
    // </AuthMiddleware>
  );
}
