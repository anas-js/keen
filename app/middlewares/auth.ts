// import { ReactNode, useEffect, useState } from "react";

import { db, settings } from "../db";

// import Loading from "../components/loading";

export default async function auth({ router, path , stop }) {
  const settings = await db.settings.get(1) as settings;

  //  console.log("run auth");
  if (!settings.name && path != "/") {
    router.replace("/");
    stop();
  } else if (settings.name && path == "/") {
    router.replace("/dashboard");
    stop();
  }


}
