"use client";
// import { gsap } from "gsap";
// import Lottie from '@lottielab/lottie-player/react';
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

// gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin);
import { Spinner } from "@heroui/react";
// import { useEffect } from "react";

export default function Loading({ full = false }: { full?: boolean }) {


  return (
    <div className={`loading ${full && "full"}`}>
      <Spinner></Spinner>
      {/* <Lottie src="https://cdn.lottielab.com/l/71PZPJxRjfSAMs.json" autoplay /> */}


    </div>
  );
}
