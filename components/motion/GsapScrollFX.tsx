"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Fades/rises any [data-gsap-reveal] element on scroll. */
export const GsoroScrollFX: React.FC = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0, scale: 0.985 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "expo.out",
            overwrite: "auto",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-gsap-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.gsapParallax || "0.12");
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          overwrite: "auto",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      });
    });
    // Silky ticker + scroll sync (same API, less jank)
    gsap.ticker.lagSmoothing(0);
    const onRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", onRefresh);
    return () => {
      window.removeEventListener("load", onRefresh);
      ctx.revert();
    };
  }, []);
  return null;
};
