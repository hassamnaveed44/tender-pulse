"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [pathname]);

  return (
    <div ref={pageRef} className="w-full flex-1 flex flex-col">
      {children}
    </div>
  );
}
