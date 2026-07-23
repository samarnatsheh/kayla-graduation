import sharp from './_sharp.mjs';
import { LAYERS, SOURCE, W, H, PAPER } from './layers.mjs';

/**
 * Finds artwork the layer rectangles fail to cover.
 *  - content mask  = pixels measurably different from the paper tone
 *  - covered mask  = union of all layer rectangles
 *  - anything in content \ covered is a gap and gets reported + drawn in red
 */
const THRESHOLD = 10; // rgb distance; white petals sit ~10-14 above paper, texture noise ~4

const { data } = await sharp(SOURCE).raw().toBuffer({ resolveWithObject: true });

const content = new Uint8Array(W * H);
for (let i = 0, p = 0; i < data.length; i += 3, p++) {
  const dr = data[i] - PAPER.r, dg = data[i + 1] - PAPER.g, db = data[i + 2] - PAPER.b;
  if (Math.sqrt(dr * dr + dg * dg + db * db) > THRESHOLD) content[p] = 1;
}

const covered = new Uint8Array(W * H);
for (const L of LAYERS) {
  for (let y = L.y; y < L.y + L.h; y++) {
    const row = y * W;
    for (let x = L.x; x < L.x + L.w; x++) covered[row + x] = 1;
  }
}

const gap = new Uint8Array(W * H);
let gapCount = 0, contentCount = 0;
for (let p = 0; p < gap.length; p++) {
  if (content[p]) contentCount++;
  if (content[p] && !covered[p]) { gap[p] = 1; gapCount++; }
}

// connected components over the gap mask, so we report real clusters not stray specks
const seen = new Uint8Array(W * H);
const clusters = [];
const stack = new Int32Array(W * H);
for (let p0 = 0; p0 < gap.length; p0++) {
  if (!gap[p0] || seen[p0]) continue;
  let sp = 0;
  stack[sp++] = p0;
  seen[p0] = 1;
  let n = 0, minX = W, maxX = 0, minY = H, maxY = 0;
  while (sp > 0) {
    const p = stack[--sp];
    const x = p % W, y = (p - x) / W;
    n++;
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (gap[q] && !seen[q]) { seen[q] = 1; stack[sp++] = q; }
      }
    }
  }
  if (n >= 30) clusters.push({ n, x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });
}
clusters.sort((a, b) => b.n - a.n);

console.log(`content pixels : ${contentCount}`);
console.log(`uncovered      : ${gapCount}  (${((gapCount / contentCount) * 100).toFixed(2)}% of artwork)`);
console.log(`\ngap clusters >=120px: ${clusters.length}`);
for (const c of clusters.slice(0, 25)) {
  console.log(`  ${String(c.n).padStart(7)}px  box x:${c.x}-${c.x + c.w}  y:${c.y}-${c.y + c.h}  (${c.w}x${c.h})`);
}

// visualisation: paper white, covered artwork grey, gaps red
const vis = Buffer.alloc(W * H * 3, 255);
for (let p = 0; p < gap.length; p++) {
  const o = p * 3;
  if (gap[p]) { vis[o] = 255; vis[o + 1] = 0; vis[o + 2] = 0; }
  else if (content[p]) { vis[o] = 205; vis[o + 1] = 205; vis[o + 2] = 205; }
}
await sharp(vis, { raw: { width: W, height: H, channels: 3 } }).png().toFile('scripts/_coverage.png');
console.log('\nwrote scripts/_coverage.png (red = artwork no layer covers)');
