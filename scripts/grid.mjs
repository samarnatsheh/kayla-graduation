import sharp from './_sharp.mjs';

const W = 941, H = 1672;
const parts = [];

for (let x = 0; x <= W; x += 50) {
  const major = x % 100 === 0;
  parts.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${major ? '#FF0090' : '#00A0FF'}" stroke-width="${major ? 1.6 : 0.7}" opacity="${major ? 0.85 : 0.45}"/>`);
}
for (let y = 0; y <= H; y += 50) {
  const major = y % 100 === 0;
  parts.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${major ? '#FF0090' : '#00A0FF'}" stroke-width="${major ? 1.6 : 0.7}" opacity="${major ? 0.85 : 0.45}"/>`);
}
for (let x = 0; x <= W; x += 100) {
  parts.push(`<text x="${x + 4}" y="26" font-family="Arial" font-size="26" font-weight="bold" fill="#FF0090">${x}</text>`);
}
for (let y = 100; y <= H; y += 100) {
  parts.push(`<text x="4" y="${y - 6}" font-family="Arial" font-size="26" font-weight="bold" fill="#008000">${y}</text>`);
  parts.push(`<text x="${W - 90}" y="${y - 6}" font-family="Arial" font-size="26" font-weight="bold" fill="#008000">${y}</text>`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${parts.join('')}</svg>`;

await sharp('scripts/source-artwork.png')
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .png()
  .toFile('scripts/_grid.png');

console.log('wrote scripts/_grid.png');
