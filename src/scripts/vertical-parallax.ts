/** Motion `useScroll` offset `["start end", "end start"]` → 0..1 */
function scrollProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const total = vh + rect.height;
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, (vh - rect.top) / total));
}

function updateGallery(gallery: HTMLElement) {
  const progress = scrollProgress(gallery);
  gallery.querySelectorAll<HTMLElement>("[data-parallax-col]").forEach((col) => {
    const range = Number(col.dataset.range ?? 0);
    col.style.transform = `translate3d(0, ${progress * range}px, 0)`;
  });
}

export function initVerticalParallax(root: ParentNode = document) {
  if (typeof window === "undefined") return () => {};

  const galleries = Array.from(
    root.querySelectorAll<HTMLElement>("[data-parallax-gallery]")
  );
  if (galleries.length === 0) return () => {};

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  const visible = new Set<HTMLElement>();
  let rafId = 0;

  const tick = () => {
    for (const gallery of visible) updateGallery(gallery);
    rafId = visible.size > 0 ? requestAnimationFrame(tick) : 0;
  };

  const start = () => {
    if (rafId === 0 && visible.size > 0) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) visible.add(el);
        else visible.delete(el);
      }
      if (visible.size > 0) start();
      else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    },
    { rootMargin: "10% 0px" }
  );

  for (const gallery of galleries) {
    updateGallery(gallery);
    observer.observe(gallery);
  }

  return () => {
    observer.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
    visible.clear();
  };
}
