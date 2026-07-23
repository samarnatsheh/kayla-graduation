import type { CSSProperties } from 'react';
import manifest from './layerManifest.json';
import { asset } from './config';

export interface Layer {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** how far each interior edge dissolves, in artwork px */
  feather: number;
  src: string;
}

export const SHEET = { w: manifest.width, h: manifest.height };
export const PAPER_TONE = manifest.paper;
export const layers = manifest.layers as Layer[];

const byId = new Map(layers.map((l) => [l.id, l]));
export const layer = (id: string): Layer => {
  const found = byId.get(id);
  if (!found) throw new Error(`unknown layer: ${id}`);
  return found;
};

export const layerSrc = (l: Layer) => asset(`/invitation/${l.src}`);

/** artwork px → percentage of the sheet */
export const px = (v: number, axis: 'x' | 'y') => `${(v / (axis === 'x' ? SHEET.w : SHEET.h)) * 100}%`;

/**
 * The wrapper carries the vertical feather and the position; the <img> inside carries the
 * horizontal feather. Splitting them across two elements avoids `mask-composite`, which
 * older iOS Safari handles inconsistently.
 *
 * Edges that sit flush against the sheet boundary are never feathered — the artwork is
 * meant to bleed off the page there.
 */
export function layerFrameStyle(l: Layer): CSSProperties {
  const top = l.y === 0 ? 0 : (l.feather / l.h) * 100;
  const bottom = l.y + l.h >= SHEET.h ? 0 : (l.feather / l.h) * 100;
  const mask = `linear-gradient(to bottom, transparent 0%, #000 ${top.toFixed(2)}%, #000 ${(100 - bottom).toFixed(2)}%, transparent 100%)`;

  return {
    left: px(l.x, 'x'),
    top: px(l.y, 'y'),
    width: px(l.w, 'x'),
    height: px(l.h, 'y'),
    maskImage: mask,
    WebkitMaskImage: mask,
  };
}

export function layerImageStyle(l: Layer): CSSProperties {
  const left = l.x === 0 ? 0 : (l.feather / l.w) * 100;
  const right = l.x + l.w >= SHEET.w ? 0 : (l.feather / l.w) * 100;
  const mask = `linear-gradient(to right, transparent 0%, #000 ${left.toFixed(2)}%, #000 ${(100 - right).toFixed(2)}%, transparent 100%)`;

  return { maskImage: mask, WebkitMaskImage: mask };
}
