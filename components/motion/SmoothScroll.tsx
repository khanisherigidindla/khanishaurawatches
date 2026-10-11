"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export const SmoothScroll: React.FC = () => {
  useEffect(() => {
    // Silky 120Hz-friendly smooth scroll — same Lenis, tuned feel.
    const lenis = new Lenis({
      lerp: 0.11,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
};

