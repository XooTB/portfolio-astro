import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { OgImageTemplate, type OgImageData } from './og-image-template';

const FONT_DIR = join(process.cwd(), 'node_modules/@fontsource/jetbrains-mono/files');

type SatoriFont = {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: 'normal';
};

let fontsPromise: Promise<SatoriFont[]> | null = null;

async function loadFonts(): Promise<SatoriFont[]> {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFile(join(FONT_DIR, 'jetbrains-mono-latin-400-normal.woff')),
      readFile(join(FONT_DIR, 'jetbrains-mono-latin-700-normal.woff')),
    ]).then(([regular, bold]) => [
      { name: 'JetBrains Mono', data: regular, weight: 400, style: 'normal' },
      { name: 'JetBrains Mono', data: bold, weight: 700, style: 'normal' },
    ]);
  }

  return fontsPromise;
}

export async function generateOgImage(data: OgImageData): Promise<Buffer> {
  const fonts = await loadFonts();
  const svg = await satori(OgImageTemplate(data), {
    width: 1200,
    height: 630,
    fonts,
  });

  return sharp(Buffer.from(svg)).png().toBuffer();
}
