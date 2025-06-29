"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Auth from "./middlewares/auth";
import InitDB from "./middlewares/initDB";
import Loading from "./components/loading";
import initPWA from "./middlewares/initPWA";

export default function Middlewares({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const path = usePathname();
  const context = { router, path, stop };

  const [stopStatus, setStopStatus] = useState(false);


  const [loading, setLoading] = useState({
    once: true,
    multi: true,
  });

  function stop() {
    setStopStatus(true);
  }

  useEffect(() => {
   
    async function init() {
      await InitDB(context);
      await initPWA();
      setLoading((l) => ({ ...l,  once: false }));
    }
    init();
  }, []);
  //   // For All Pages
  useEffect(() => {
    async function init() {
      if(loading.once){
        return;
      }
      setStopStatus(false);
      // console.log("START");
      await Auth(context);
      setLoading((l) => ({ ...l, multi: false }));
    }
    init();
  }, [path, loading.once]);

  //   // one Time Load

  if (!loading.once && !loading.multi && !stopStatus) {
    return <>{children}</>;
  } else {
    return <Loading full></Loading>;
  }
}
