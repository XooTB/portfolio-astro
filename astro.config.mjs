import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import mermaid from 'astro-mermaid';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://iamsamiul.me',
  output: 'static',
  compressHTML: true,
  integrations: [mermaid({
    theme: 'dark',
    autoTheme: true,
    mermaidConfig: {
      xyChart: {
        width: 700,
        height: 400,
        titleFontSize: 14,
        titlePadding: 24,
        plotReservedSpacePercent: 52,
        xAxis: {
          showAxisLine: false,
          showTick: false,
          labelFontSize: 11,
          labelPadding: 10,
          titleFontSize: 12,
          titlePadding: 8,
        },
        yAxis: {
          showAxisLine: false,
          showTick: false,
          labelFontSize: 11,
          labelPadding: 10,
          titleFontSize: 12,
          titlePadding: 8,
        },
      },
      themeVariables: {
        xyChart: {
          backgroundColor: 'transparent',
          titleColor: '#f5f5f5',
          dataLabelColor: '#d4d4d4',
          xAxisLabelColor: '#a3a3a3',
          xAxisTitleColor: '#d4d4d4',
          xAxisTickColor: 'transparent',
          xAxisLineColor: 'transparent',
          yAxisLabelColor: '#a3a3a3',
          yAxisTitleColor: '#d4d4d4',
          yAxisTickColor: 'transparent',
          yAxisLineColor: 'transparent',
          plotColorPalette: '#ffffff, #737373, #525252, #404040',
        },
      },
      themeCSS: `
        svg[aria-roledescription="xychart"] {
          font-family: Inter, system-ui, sans-serif !important;
        }
        svg[aria-roledescription="xychart"] .chart-title text {
          font-weight: 500;
        }
      `,
    },
  })],
  vite: {
    ssr: { noExternal: ['three', 'lenis', 'gsap'] },
    plugins: [tailwindcss()],
  },
});
