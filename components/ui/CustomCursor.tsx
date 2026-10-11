"use client";

import React, { useEffect, useRef, useState } from "react";

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const trail = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const hoverRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      const t = e.target as HTMLElement | null;
      const interactiveEl = t?.closest("button, a, [data-cursor]");
      const hovering = !!interactiveEl;
      if (hovering !== hoverRef.current) {
        hoverRef.current = hovering;
        setIsHovered(hovering);
        setCursorText(interactiveEl?.getAttribute("data-cursor") || "");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let raf = 0;
    const render = () => {
      // Dot: 1:1 ultra-responsive (lerp 0.55). Ring: silky trail (lerp 0.16).
      pos.current.x += (target.current.x - pos.current.x) * 0.55;
      pos.current.y += (target.current.y - pos.current.y) * 0.55;
      trail.current.x += (target.current.x - trail.current.x) * 0.16;
      trail.current.y += (target.current.y - trail.current.y) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trail.current.x}px, ${trail.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[100]">
      {/* Precision inner center dot */}
      <div
        ref={dotRef}
        className="smooth-cursor-dot fixed top-0 left-0 w-1.5 h-1.5 bg-gold rounded-full pointer-events-none"
      />

      {/* Trailing luxury ring */}
      <div
        ref={ringRef}
        className={`smooth-cursor-ring fixed top-0 left-0 rounded-full border pointer-events-none flex items-center justify-center ${
          isHovered
            ? "w-16 h-16 bg-gold/10 backdrop-blur-[1px] border-gold"
            : "w-8 h-8 bg-transparent border-gold/40"
        }`}
      >
        {cursorText && (
          <span className="text-[9px] tracking-widest text-gold uppercase font-sans font-semibold">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
