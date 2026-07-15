import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_BASE_SCALE = 0.94;
const Y_STEP = 20;

function readLengthPx(
  stack: HTMLElement,
  cssVar: string,
  cacheKey: "peekPx" | "navPx",
  fallback: string
) {
  const cached = stack.dataset[cacheKey];
  if (cached) return Number(cached);

  const raw = getComputedStyle(stack).getPropertyValue(cssVar).trim();
  const probe = document.createElement("div");
  probe.style.cssText = `position:absolute;visibility:hidden;height:${raw || fallback}`;
  stack.appendChild(probe);
  const px = probe.getBoundingClientRect().height || Number.parseFloat(fallback) || 0;
  probe.remove();
  stack.dataset[cacheKey] = String(px);
  return px;
}

function readBaseScale(stack: HTMLElement) {
  const cached = stack.dataset.baseScale;
  if (cached) return Number(cached);

  const raw = getComputedStyle(stack).getPropertyValue("--skills-base-scale").trim();
  const value = Number.parseFloat(raw);
  const scale =
    Number.isFinite(value) && value > 0 && value <= 1
      ? value
      : DEFAULT_BASE_SCALE;
  stack.dataset.baseScale = String(scale);
  return scale;
}

function clearLengthCache(stack: HTMLElement) {
  delete stack.dataset.peekPx;
  delete stack.dataset.navPx;
  delete stack.dataset.baseScale;
}

function setupStack(stack: HTMLElement) {
  const cards = Array.from(
    stack.querySelectorAll<HTMLElement>("[data-stack-card]")
  );
  if (cards.length === 0) return [];

  clearLengthCache(stack);

  const peek = readLengthPx(stack, "--skills-peek", "peekPx", "0.85rem");
  const nav = readLengthPx(stack, "--skills-nav", "navPx", "8.5rem");
  const baseScale = readBaseScale(stack);
  const step = 1 - baseScale;

  const triggers: ScrollTrigger[] = [];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const inner = card.querySelector<HTMLElement>("[data-stack-inner]");
    if (!inner) continue;

    const baseY = i * peek;
    gsap.set(inner, {
      y: baseY,
      scale: 1,
      transformOrigin: "top center",
      force3D: true,
    });

    // Each later card adds one linear depth unit. The last card stays at
    // full scale and scrolls away with the section.
    const layers = cards.slice(i + 1);
    if (layers.length === 0) continue;

    const progress = layers.map(() => 0);

    const applyDepth = () => {
      const depth = progress.reduce((sum, p) => sum + p, 0);
      gsap.set(inner, {
        scale: 1 - depth * step,
        y: baseY - depth * Y_STEP,
      });
    };

    for (let d = 0; d < layers.length; d++) {
      const trigger = ScrollTrigger.create({
        trigger: layers[d],
        start: "top bottom",
        end: () => `top ${nav}px`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress[d] = self.progress;
          applyDepth();
        },
        onRefresh: (self) => {
          progress[d] = self.progress;
          applyDepth();
        },
      });
      triggers.push(trigger);
    }
  }

  return triggers;
}

export function initSkillsStack(root: ParentNode = document) {
  if (typeof window === "undefined") return () => {};

  const stacks = Array.from(
    root.querySelectorAll<HTMLElement>("[data-skills-stack]")
  );
  if (stacks.length === 0) return () => {};

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  const triggers = stacks.flatMap(setupStack);
  ScrollTrigger.refresh();

  return () => {
    for (const trigger of triggers) trigger.kill();
    for (const stack of stacks) {
      clearLengthCache(stack);
      for (const inner of stack.querySelectorAll<HTMLElement>("[data-stack-inner]")) {
        gsap.set(inner, { clearProps: "transform" });
      }
    }
  };
}
