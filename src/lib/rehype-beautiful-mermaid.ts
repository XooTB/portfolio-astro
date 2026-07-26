/**
 * Build-time Mermaid → inline SVG for blog markdown.
 *
 * Wired from `astro.config.mjs` through `@astrojs/markdown-remark`'s `unified()`
 * processor (Astro 7's default Sätteri pipeline does not run rehype plugins).
 *
 * Pipeline per page:
 *   1. Markdown ` ```mermaid ` blocks become `<pre><code class="language-mermaid">`
 *      because Shiki is told to skip `mermaid` (`excludeLangs`).
 *   2. This plugin walks the HAST, finds those nodes, and calls
 *      `beautiful-mermaid`'s `renderMermaidSVG` in-process (no Chromium, no
 *      client Mermaid bundle).
 *   3. The SVG string is cleaned up, parsed back into HAST, and the `<pre>` is
 *      replaced with:
 *        <figure class="blog-diagram" data-diagram="flowchart|xychart|...">
 *          <svg>...</svg>
 *        </figure>
 *
 * Theming / light-dark:
 *   SVGs are rendered with `bg: var(--mermaid-bg)` and `fg: var(--mermaid-fg)`.
 *   beautiful-mermaid derives the rest via CSS `color-mix()`. Define those
 *   tokens in `globals.css` today; override them under a future theme selector
 *   and diagrams recolor without a rebuild or a second SVG.
 *
 * Supported diagram types are whatever beautiful-mermaid supports (flowchart,
 * state, sequence, class, ER, xychart). Anything else throws and fails the
 * build so broken diagrams never ship.
 *
 * @module
 */
import type { Root, Element, ElementContent, Text } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { visit } from 'unist-util-visit';
import { renderMermaidSVG } from 'beautiful-mermaid';

function getClassList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  if (typeof value === 'string') {
    return value.split(/\s+/).filter(Boolean);
  }
  return [];
}

/** True when a <code> node is a mermaid fence (Shiki / remark class shapes). */
function isMermaidCode(node: Element): boolean {
  const classes = getClassList(node.properties?.className);
  return classes.some(
    (c) => c === 'language-mermaid' || c === 'mermaid' || c.endsWith('-mermaid'),
  );
}

/** Flatten text out of a HAST subtree (handles nested spans if any). */
function collectText(node: ElementContent): string {
  if (node.type === 'text') {
    return (node as Text).value;
  }
  if (node.type === 'element') {
    return node.children.map(collectText).join('');
  }
  return '';
}

/**
 * First non-comment line of the diagram source → coarse type for `data-diagram`.
 * Used for CSS hooks and clearer build-error messages, not for routing renderers.
 */
function detectDiagramType(source: string): string {
  const first = source
    .trim()
    .split('\n')
    .find((line) => line.trim() && !line.trim().startsWith('%%'))
    ?.trim()
    .toLowerCase();

  if (!first) return 'unknown';
  if (first.startsWith('xychart')) return 'xychart';
  if (first.startsWith('flowchart') || first.startsWith('graph')) return 'flowchart';
  if (first.startsWith('sequencediagram')) return 'sequence';
  if (first.startsWith('classdiagram')) return 'class';
  if (first.startsWith('erdiagram')) return 'er';
  if (first.startsWith('statediagram')) return 'state';
  return first.split(/\s+/)[0] ?? 'unknown';
}

/**
 * beautiful-mermaid reuses fixed marker ids like `arrowhead` on every render.
 * Multiple diagrams on one page would share `url(#arrowhead)` and break arrows,
 * so each diagram gets a unique prefix (`bm1-`, `bm2-`, …). Longer ids are
 * rewritten first so a short id is not a prefix of a longer one mid-replace.
 */
function uniquifySvgIds(svg: string, prefix: string): string {
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const unique = [...new Set(ids)].sort((a, b) => b.length - a.length);
  let out = svg;
  for (const id of unique) {
    out = out.replaceAll(`id="${id}"`, `id="${prefix}${id}"`);
    out = out.replaceAll(`url(#${id})`, `url(#${prefix}${id})`);
  }
  return out;
}

/**
 * beautiful-mermaid injects a Google Fonts @import for Inter. The site already
 * ships Inter locally — strip the import so pages do not hit fonts.googleapis.com.
 */
function stripGoogleFontImport(svg: string): string {
  return svg.replace(/@import url\([^)]+\);\s*/g, '');
}

/** Parse an SVG markup string into a single HAST `<svg>` element. */
function toSvgElement(svg: string): Element {
  const tree = fromHtml(svg, { fragment: true });
  const svgNode = tree.children.find(
    (child): child is Element => child.type === 'element' && child.tagName === 'svg',
  );
  if (!svgNode) {
    throw new Error('beautiful-mermaid did not return an <svg> root');
  }
  return svgNode;
}

/**
 * Rehype plugin factory. Register as `rehypePlugins: [rehypeBeautifulMermaid]`
 * on the unified markdown processor.
 */
export function rehypeBeautifulMermaid() {
  return (tree: Root) => {
    let diagramIndex = 0;

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || parent == null || typeof index !== 'number') {
        return;
      }

      const code = node.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code',
      );
      if (!code || !isMermaidCode(code)) {
        return;
      }

      const source = code.children.map(collectText).join('').trim();
      if (!source) {
        return;
      }

      diagramIndex += 1;
      const prefix = `bm${diagramIndex}-`;
      const diagramType = detectDiagramType(source);

      let svg: string;
      try {
        svg = renderMermaidSVG(source, {
          bg: 'var(--mermaid-bg)',
          fg: 'var(--mermaid-fg)',
          transparent: true,
          font: 'Inter, system-ui, sans-serif',
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(
          `Failed to render mermaid diagram (#${diagramIndex}, type=${diagramType}): ${message}\n\n${source}`,
        );
      }

      svg = uniquifySvgIds(stripGoogleFontImport(svg), prefix);
      const svgNode = toSvgElement(svg);

      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: {
          className: ['blog-diagram'],
          dataDiagram: diagramType,
        },
        children: [svgNode],
      };

      parent.children[index] = figure;
    });
  };
}

export default rehypeBeautifulMermaid;
