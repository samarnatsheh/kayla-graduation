import sharp from './_sharp.mjs';
import { LAYERS, SOURCE, W, H, PAPER } from './layers.mjs';
import { mkdirSync, writeFileSync, statSync } from 'node:fs';

const OUT = 'public/invitation';
mkdirSync(OUT, { recursive: true });
mkdirSync('lib', { recursive: true });

// ── 1. tileable paper grain (procedural — never repeats a botanical) ──────────
const N = 256;
const noise = Buffer.alloc(N * N);
let seed = 20260815;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
for (let i = 0; i < noise.length; i++) {
  const v = 0.5 * rnd() + 0.5 * rnd(); // two octaves, flattened toward mid grey
  noise[i] = Math.max(0, Math.min(255, Math.round(128 + (v - 0.5) * 150)));
}
await sharp(noise, { raw: { width: N, height: N, channels: 1 } })
  .blur(0.5)
  .png({ compressionLevel: 9, palette: true })
  .toFile(`${OUT}/paper-grain.png`);

// ── 2. cut every layer ────────────────────────────────────────────────────────
let total = 0;
const manifest = [];
for (const L of LAYERS) {
  if (L.x + L.w > W || L.y + L.h > H) throw new Error(`layer ${L.id} exceeds source bounds`);
  const file = `layer-${L.id}.webp`;
  await sharp(SOURCE)
    .extract({ left: L.x, top: L.y, width: L.w, height: L.h })
    .webp({ quality: 92, effort: 6 })
    .toFile(`${OUT}/${file}`);
  const kb = statSync(`${OUT}/${file}`).size / 1024;
  total += kb;
  manifest.push({ id: L.id, x: L.x, y: L.y, w: L.w, h: L.h, feather: L.feather, src: file });
  console.log(`  ${file.padEnd(34)} ${String(L.w).padStart(4)}x${String(L.h).padEnd(4)} @ ${L.x},${L.y}  ${kb.toFixed(0)}kB`);
}
console.log(`\n${LAYERS.length} layers, ${total.toFixed(0)}kB total`);

const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, '0')).join('');
writeFileSync('lib/layerManifest.json', JSON.stringify({ width: W, height: H, paper: hex(PAPER), layers: manifest }, null, 2) + '\n');

// ── 3. reassemble over clean paper and diff against the original ──────────────
const crops = await Promise.all(
  LAYERS.map(async (L) => ({
    input: await sharp(SOURCE).extract({ left: L.x, top: L.y, width: L.w, height: L.h }).png().toBuffer(),
    left: L.x,
    top: L.y,
  })),
);
const reassembled = await sharp({ create: { width: W, height: H, channels: 3, background: PAPER } })
  .composite(crops)
  .png()
  .toBuffer();
await sharp(reassembled).toFile('scripts/_reassembled.png');

// composite must finish before greyscale/linear, so the diff runs as a second pipeline
const diff = await sharp(reassembled)
  .composite([{ input: await sharp(SOURCE).png().toBuffer(), blend: 'difference' }])
  .png()
  .toBuffer();
await sharp(diff).greyscale().linear(8, 0).png().toFile('scripts/_diff.png');

// ── 4. contact sheet, to confirm each crop holds the element it is named after ─
const COLS = 5, CELL = 232, PAD = 26;
const rows = Math.ceil(LAYERS.length / COLS);
const cells = await Promise.all(
  LAYERS.map(async (L, i) => {
    const buf = await sharp(SOURCE)
      .extract({ left: L.x, top: L.y, width: L.w, height: L.h })
      .resize({ width: CELL - 16, height: CELL - 16, fit: 'contain', background: '#ffffff' })
      .png()
      .toBuffer();
    return { input: buf, left: (i % COLS) * CELL + 8, top: Math.floor(i / COLS) * (CELL + PAD) + 8 };
  }),
);
const labels = LAYERS.map(
  (L, i) =>
    `<text x="${(i % COLS) * CELL + CELL / 2}" y="${Math.floor(i / COLS) * (CELL + PAD) + CELL + 18}" font-family="Arial" font-size="15" font-weight="bold" fill="#7a2f6a" text-anchor="middle">${i + 1}. ${L.id}</text>`,
).join('');
const sheetW = COLS * CELL, sheetH = rows * (CELL + PAD) + 10;
await sharp({ create: { width: sheetW, height: sheetH, channels: 3, background: '#ffffff' } })
  .composite([...cells, { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}">${labels}</svg>`), top: 0, left: 0 }])
  .png()
  .toFile('scripts/_contact-sheet.png');

console.log('wrote _reassembled.png, _diff.png, _contact-sheet.png');
