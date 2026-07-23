import sharp from './_sharp.mjs';

const SRC = 'scripts/source-artwork.png';

// candidate botanical-free patches spread across the sheet
const spots = [
  { name: 'centre-upper', x: 380, y: 320, w: 140, h: 110 },
  { name: 'centre-mid',   x: 460, y: 700, w: 160, h: 110 },
  { name: 'left-mid',     x: 140, y: 780, w: 140, h: 100 },
  { name: 'right-mid',    x: 600, y: 700, w: 130, h: 100 },
  { name: 'below-meds',   x: 120, y: 1130, w: 160, h: 60 },
  { name: 'upper-centre', x: 250, y: 330, w: 110, h: 90 },
  { name: 'right-upper',  x: 600, y: 300, w: 150, h: 120 },
];

for (const s of spots) {
  const { data } = await sharp(SRC)
    .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0;
  const n = data.length / 3;
  for (let i = 0; i < data.length; i += 3) { r += data[i]; g += data[i + 1]; b += data[i + 2]; }
  r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
  const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  console.log(`${s.name.padEnd(14)} rgb(${r}, ${g}, ${b})  ${hex}`);
}

// what does .stats() claim for the same patch? (sanity check on the earlier reading)
const st = await sharp(SRC).extract({ left: 380, top: 320, width: 140, height: 110 }).stats();
console.log('\nstats() means:', st.channels.map((c) => Math.round(c.mean)).join(', '));
console.log('source metadata:', JSON.stringify(await sharp(SRC).metadata().then(m => ({ w: m.width, h: m.height, space: m.space, channels: m.channels, depth: m.depth, icc: !!m.icc }))));
