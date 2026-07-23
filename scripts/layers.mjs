export const SOURCE = 'scripts/source-artwork.png';
export const W = 941;
export const H = 1672;

/** Paper tone measured by raw pixel averaging over botanical-free patches. */
export const PAPER = { r: 248, g: 244, b: 240 };

/**
 * Every layer is a rectangular crop taken from the source at its ORIGINAL position.
 * Because each is placed back at those exact coordinates, the composite reconstructs the
 * original artwork at rest — overlapping crops simply draw identical pixels twice, which
 * is invisible. The page background is clean paper with no botanicals, so nothing is
 * duplicated underneath the animated layers.
 *
 * `feather` is how far (in artwork px) each edge dissolves via a CSS mask, so no
 * rectangular crop boundary is ever visible. Crops therefore carry a margin of empty
 * paper around their content for the feather to eat into. Edges that sit on the sheet
 * boundary are not feathered — the component works that out from the geometry.
 */
export const LAYERS = [
  // ── upper botanicals ────────────────────────────────────────────────────────
  { id: 'top-left-florals',   x: 0,   y: 0,    w: 345, h: 452, feather: 34 },
  { id: 'top-left-leaves',    x: 0,   y: 392,  w: 240, h: 400, feather: 34 },
  { id: 'top-right-branch',   x: 620, y: 0,    w: 321, h: 250, feather: 26 },
  { id: 'gold-speckles',      x: 797, y: 147,  w: 142, h: 172, feather: 22 },
  { id: 'emblem',             x: 368, y: 47,   w: 210, h: 250, feather: 20 },
  { id: 'cap',                x: 277, y: 453,  w: 200, h: 219, feather: 18 },
  { id: 'gold-branch',        x: 635, y: 498,  w: 126, h: 160, feather: 18 },
  { id: 'mid-right-cluster',  x: 740, y: 536,  w: 201, h: 296, feather: 24 },
  { id: 'right-sprigs',       x: 850, y: 818,  w: 91,  h: 140, feather: 14 },

  // ── information medallions ──────────────────────────────────────────────────
  { id: 'medallion-location', x: 76,  y: 822,  w: 256, h: 302, feather: 20 },
  { id: 'medallion-time',     x: 344, y: 822,  w: 256, h: 306, feather: 20 },
  { id: 'medallion-date',     x: 612, y: 822,  w: 260, h: 302, feather: 20 },
  { id: 'separator-left',     x: 306, y: 864,  w: 62,  h: 222, feather: 14 },
  { id: 'separator-right',    x: 579, y: 864,  w: 62,  h: 222, feather: 14 },

  // ── lower graduation scene ──────────────────────────────────────────────────
  { id: 'arch',                 x: 245, y: 1166, w: 490, h: 118, feather: 26 },
  { id: 'portrait',             x: 250, y: 1240, w: 478, h: 432, feather: 30 },
  { id: 'bottom-left-florals',  x: 0,   y: 1176, w: 276, h: 336, feather: 30 },
  { id: 'bottom-right-florals', x: 692, y: 1140, w: 249, h: 418, feather: 30 },
  { id: 'bottom-left-ribbon',   x: 0,   y: 1450, w: 284, h: 222, feather: 26 },
  { id: 'bottom-right-ribbon',  x: 682, y: 1490, w: 259, h: 182, feather: 26 },
];
