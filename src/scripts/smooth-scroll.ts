import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (typeof window === "undefined") return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }
  if (lenis) return lenis;

  lenis = new Lenis({
    lerp: 0.1,
    autoRaf: true,
  });

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function scrollTo(target: number | string | HTMLElement, options?: object) {
  if (lenis) {
    lenis.scrollTo(target, options);
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}
