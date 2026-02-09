# Styling Guide

Reference for styling new pages and features in this portfolio site.

---

## Color System

### Dark Background Palette

The site is dark-themed. These are the actual colors in use:

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#2b2b2b` | Primary page background, canvas containers |
| `--color-bg-muted` | `#1e1e1e` | Muted/secondary backgrounds |
| `--color-text` | `#f9f9f9` | Primary text |
| `--color-highlight` | `#ffc107` | Highlight/accent (amber) |
| `--color-accent` | `#03a9f4` | Accent (blue) |
| `black` | `#000000` | Footer section background (`bg-black`) |

### shadcn/ui Theme Tokens (HSL)

Used by UI primitives (Button, Accordion, Checkbox, Sheet). Defined as HSL values in `globals.css` and consumed via Tailwind classes:

```
bg-background, text-foreground, bg-primary, bg-secondary,
bg-muted, text-muted-foreground, bg-accent, bg-destructive,
border-border, ring-ring, bg-card, bg-popover
```

Dark mode variables exist under `.dark` but are **not actively toggled** — the site is dark by default via explicit dark colors on `body` and containers.

### Direct Color Usage

Components primarily use **white text on dark backgrounds** — `text-white` is set on the top container (`#top-container`) and inherited. Interactive hover states use:

- `hover:text-indigo-400` / `hover:text-indigo-300` — link hover color (footer)
- `hover:bg-white hover:text-black` — inversion hover (feed entries, icons)
- `#424242` — SVG stroke color for hand-drawn arrows (TextFill)

---

## Typography

### Font Stack

| Tailwind Class | Font | CSS Variable | Usage |
|---|---|---|---|
| `font-mono` | JetBrains Mono | `--font-jetbrains-mono` | **Primary font** — nav, headings, body text, labels, feed |
| `font-inter` | Inter | `--font-inter` | Sans-serif body (via `font-sans`) |
| `font-bebas` | Bebas Neue | `--font-bebas-neue` | Giant display text (footer title `text-[22vw]`) |
| `font-nunito` | Nunito | `--font-nunito` | Available but not prominently used |
| `font-reross` | Reross Quad | `--font-reross` | Horizontal scroll text (TextFill section) |
| `font-sans` | Inter (fallback stack) | `--font-sans` | Default body font |
| `font-heading` | Inter (fallback stack) | `--font-heading` | Heading font |

### Key Pattern: `font-mono` Is the Primary Font

Almost every component uses `font-mono` (JetBrains Mono). This is the defining typographic choice of the site. **Default to `font-mono` for new components.**

### Text Sizes by Context

| Context | Mobile | Desktop | Example |
|---|---|---|---|
| Logo | `text-2xl` | `text-2xl` | "SAMIUL A." |
| Section headings | `text-xl` | `text-7xl` | "Feed" |
| Hero name | `text-5xl` | `text-8xl` | "Samiul" |
| Hero subtitle | `text-xl` | `text-2xl` / `text-3xl` | "Hey! I'm", "And I do stuff for fun..." |
| Contact heading | `text-2xl` | `text-4xl` | "Let's Get in Touch!" |
| Contact details | `text-lg` | `text-2xl` | Email, phone |
| Feed entry title | `text-lg` | `text-3xl` | Post titles |
| Feed labels | `text-xs` | `text-base` | "/ DATE", "/ NAME" |
| Feed date | `text-[10px]` | `text-xs` | Date stamps |
| Type badges | `text-[9px]` — `text-[10px]` | `text-xs` | "BLOG", "VIDEO" |
| Nav links | `text-xs` | `text-xs` | Desktop nav (14px via `.nav-item`) |
| Mobile nav links | `text-lg` | — | Sheet drawer links |
| Version label | `text-[10px]` | `text-[10px]` | "V_001" |
| Footer meta | `text-sm` | `text-base` | Copyright, location |
| Footer display | — | `text-[22vw]` | "SAMIUL ALIM" (viewport-scaled) |
| Horizontal scroll | — | `text-xl` | TextFill statements |

### Text Styling Patterns

- **`tracking-tighter`** — Applied to nav, logo, headings. Use on any mono-font heading.
- **`font-medium`** — Nav links, logo.
- **`font-extralight` / `font-thin`** — Feed dates, labels.
- **`font-bold`** — Footer display title, hover states.
- **`uppercase`** — Type badges, topic tags, filter labels, footer meta, Zoop text.
- **`line-clamp-1`** / **`line-clamp-2`** / **`line-clamp-3`** — Truncation in feed entries.

---

## Layout

### Spacing Conventions

| Pattern | Mobile | Desktop |
|---|---|---|
| Horizontal page padding | `px-4` — `px-6` | `px-10` — `px-20` |
| Section top padding | `pt-36` (feed) | `pt-[10vh]` — `pt-[14vh]` (contact) |
| Section bottom padding | `pb-10` — `pb-20` | `pb-0` (with `min-h-screen`) |
| Element gaps | `gap-2` — `gap-4` | `gap-5` — `gap-10` |
| Nav padding | `px-10 py-5` | Same |

### Responsive Breakpoints

The primary breakpoint is **`lg` (1024px)**. Most layouts flip between mobile and desktop at this point:

```
flex-col lg:flex-row      — stack → row
hidden lg:flex            — hide on mobile, show on desktop
lg:hidden                 — show on mobile, hide on desktop
w-full lg:w-1/2           — full width → half
```

A secondary breakpoint at **`sm` (640px)** is used for fine-tuning within mobile:

```
flex-col sm:flex-row      — stack → row on small tablets
px-4 sm:px-8 md:px-20    — progressive padding
text-2xl sm:text-3xl md:text-4xl  — progressive text scaling
```

The **`main-hover`** custom screen (`(hover: hover)`) is available for hover-capable device detection.

### Section Layout

Sections are full-width with horizontal padding:

```html
<section class="min-h-screen w-full pb-20">
  <div class="w-full px-6 lg:px-20 pt-36 pb-10">
    <!-- section heading -->
  </div>
  <div class="w-full px-6 lg:px-20 flex gap-10">
    <!-- content columns -->
  </div>
</section>
```

### Column Layouts

Feed uses fractional widths:

```
w-1/4  — sidebar (desktop)
w-3/4  — main content (desktop)
w-1/6  — column within feed rows
w-4/6  — title column in feed rows
```

### Z-Index Layers

| Layer | Z-Index | Element |
|---|---|---|
| Curtain overlay | `z-30` | `.curtain` (loading animation) |
| Navbar | `z-20` | `<header>` |
| Container body | `z-10` | `.container-body` |
| Top container | `z-5` | `#top-container` |
| Canvas | `z-0` | `#canvas-container` |

---

## Components & Patterns

### NavBar (Glassmorphism)

```
backdrop-blur-xl rounded-3xl bg-white/30
```

Fixed at top, centered, 95% width. Frosted glass effect on white at 30% opacity.

### Nav Link Underline Animation

Defined in `globals.css` as `.nav-item`:

```css
.nav-item::after {
  width: 0;
  height: 2px;
  bottom: -4px;
  background-color: currentColor;
  transition: width 0.3s ease-in-out;
}
.nav-item:hover::after {
  width: 100%;
}
```

### Badges / Tags

Type and topic badges use a consistent dotted-border pill style:

```
border px-2 py-1 rounded-md border-dotted uppercase text-[9px]
```

With hover inversion:

```
hover:bg-white hover:text-black hover:cursor-pointer
```

### Borders

- **`border-b`** — Row separators (feed entries, filter headers)
- **`border-t`** — Mobile feed top border
- **`border-l border-dotted`** — Accordion content indent
- **`border`** — Buttons, badges
- **No colored borders** — Default `border-border` from shadcn theme

### Border Radius

- `rounded-3xl` — Navbar container
- `rounded-md` — Buttons, badges, hover states
- `rounded-sm` — Small tags
- `rounded-[1vh]` — Image containers (via CSS `.img-container`)
- `var(--radius)` = `0.5rem` — shadcn base radius

### Images

- All parallax images are **grayscale**: `filter: grayscale(100%)` (CSS class `.image`)
- Images use `object-fit: cover` for uniform cropping
- Image containers use `overflow: hidden` with border-radius

---

## Animation Patterns

### Motion Library

The site uses both `framer-motion` and `motion/react` (the newer package). For new components, **use `motion/react`**.

### Common Animation Presets

**Fade + slide up (reveal on scroll):**
```tsx
initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.1 }}
```

**Expand/collapse (accordion-style):**
```tsx
animate(scope.current, { height: 250 }, { duration: 0.4 });
animate(scope.current, { height: 58 }, { duration: 0.4 });
```

**SVG path drawing:**
```tsx
initial={{ pathLength: 0, opacity: 0 }}
whileInView={{ pathLength: 1, opacity: 1 }}
transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
```

**Character stagger (Zoop hover):**
```tsx
const DURATION = 0.25;
const STAGGER = 0.025;
// Each character delayed by STAGGER * index
```

### Transition Defaults

- **Duration:** `0.2s` — `0.5s` for UI interactions, `1s` for scroll reveals
- **Easing:** `ease-in-out` (CSS), `"easeInOut"` (framer-motion)
- **Stagger:** `0.025s` per character, `0.1s` per element

### CSS Transitions

Used for simple hover effects:

```
transition-all duration-300 ease-in-out   — nav items
transition-all duration-300               — mobile nav hover translate
transition-colors                         — buttons (via shadcn)
```

---

## Hover States

| Element | Effect |
|---|---|
| Nav links | Underline grows from left (`width: 0 → 100%`) |
| Mobile nav links | `hover:translate-x-2` |
| Feed entries | Cursor pointer on row |
| Feed +/- icons | `hover:bg-white hover:text-black hover:rounded-md` |
| Tags/badges | `hover:bg-white hover:text-black hover:cursor-pointer` |
| Footer links | `hover:text-indigo-400` |
| Back to top | `hover:text-indigo-300 hover:font-bold` |
| Buttons (ghost) | `hover:bg-accent hover:text-accent-foreground` |

---

## UI Primitives (shadcn/ui)

Located in `src/components/ui/`. Use these for interactive elements:

- **Button** — `<Button variant="ghost" className="border">` (ghost with border is the main CTA style)
- **Accordion** — Used for filter dropdowns
- **Checkbox** — Used in filter panel
- **Sheet** — Used for mobile navigation drawer

### Using `cn()` for Class Merging

Always use the `cn()` utility from `@/lib/utils` when a component accepts a `className` prop:

```tsx
import { cn } from "@/lib/utils";

const MyComponent = ({ className }: { className?: string }) => (
  <div className={cn("base-classes here", className)}>
```

---

## Icons

- **lucide-react** — For interactive React components (`Square`, `Plus`, `Minus`, `Menu`, `X`, `Folder`)
- **Inline SVGs** — For static Astro components (avoids shipping JS). See `LandingFooter.astro` for examples.
- Default icon size: `size={18}` for small UI icons, `size={24}` for nav toggles, `size={8}` for decorative dots.

---

## File Conventions

### When to Use `.astro` vs `.tsx`

- **`.astro`** — Static content with no client-side interactivity. Zero JS shipped.
- **`.tsx`** — Anything needing state, event handlers, animations, or Three.js.

### Component File Organization

```
components/
├── sections/    — Full page sections (Hero, Feed, Footer, etc.)
├── blocks/      — Reusable structural blocks (FooterTitle, Type, VerticalScroll)
├── atoms/       — Small interactive units (Post, BackToTopButton)
├── text/        — Text effect components (Scrambler, Zoop, TextFill)
├── three/       — Three.js/R3F components (Canvas, shaders)
└── ui/          — shadcn/ui primitives (button, accordion, sheet, checkbox)
```

---

## Quick Reference: New Section Template

```astro
---
// imports
---

<section id="section-id" class="min-h-screen w-full pb-20">
  <div class="w-full px-6 lg:px-20 pt-36 pb-10">
    <h2 class="text-xl lg:text-7xl font-mono tracking-tighter">Section Title</h2>
  </div>
  <div class="w-full px-6 lg:px-20">
    <!-- content -->
  </div>
</section>
```

## Quick Reference: New React Island Template

```tsx
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface Props {
  className?: string;
}

const MyComponent = ({ className }: Props) => {
  return (
    <motion.div
      className={cn("font-mono", className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* content */}
    </motion.div>
  );
};

export default MyComponent;
```

Usage in Astro:
```astro
<MyComponent client:visible />
```
