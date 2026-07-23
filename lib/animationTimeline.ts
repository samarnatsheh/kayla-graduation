import { gsap } from 'gsap';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fewer ambient loops on modest hardware. */
const isLowPower = () =>
  typeof navigator !== 'undefined' && typeof navigator.hardwareConcurrency === 'number'
    ? navigator.hardwareConcurrency <= 4
    : false;

type Move = { id: string; at: number; dur: number; from: gsap.TweenVars; origin?: string };

/**
 * Every botanical group gets its own entrance — direction, delay, blur and rotation are
 * tuned per group so the sheet assembles like a painting rather than one flat image.
 */
const LAYER_MOVES: Move[] = [
  { id: 'top-left-florals', at: 0.25, dur: 1.45, from: { opacity: 0, y: 24, scale: 0.97, filter: 'blur(3px)' }, origin: '10% 0%' },
  { id: 'top-left-leaves', at: 0.46, dur: 1.4, from: { opacity: 0, y: 26, rotate: -2.2, scale: 0.975, filter: 'blur(3px)' }, origin: '0% 0%' },
  { id: 'emblem', at: 1.2, dur: 1.4, from: { opacity: 0, y: 10, scale: 0.94, filter: 'blur(3px)' } },
  { id: 'top-right-branch', at: 1.0, dur: 1.25, from: { opacity: 0, x: -18, y: -12, rotate: 1.6, filter: 'blur(2.5px)' }, origin: '100% 0%' },
  { id: 'gold-speckles', at: 1.5, dur: 1.0, from: { opacity: 0, scale: 0.88 } },
  { id: 'mid-right-cluster', at: 1.15, dur: 1.3, from: { opacity: 0, x: -16, rotate: 1.3, filter: 'blur(2.5px)' }, origin: '100% 20%' },
  { id: 'right-sprigs', at: 1.42, dur: 1.05, from: { opacity: 0, x: -10, y: 12 }, origin: '100% 100%' },
  { id: 'cap', at: 3.2, dur: 1.2, from: { opacity: 0, y: -18, rotate: -4, filter: 'blur(3px)' }, origin: '55% 35%' },
  { id: 'gold-branch', at: 3.6, dur: 1.1, from: { opacity: 0, y: 14, scale: 0.93 }, origin: '50% 100%' },
  { id: 'separator-right', at: 6.5, dur: 0.9, from: { opacity: 0, scaleY: 0.66 }, origin: '50% 50%' },
  { id: 'separator-left', at: 6.72, dur: 0.9, from: { opacity: 0, scaleY: 0.66 }, origin: '50% 50%' },
  // the arch draws outward from its centre ornament
  { id: 'arch', at: 7.0, dur: 1.15, from: { opacity: 0, clipPath: 'inset(0% 50% 0% 50%)' } },
  { id: 'bottom-right-florals', at: 7.3, dur: 1.45, from: { opacity: 0, y: 32, scale: 0.97, filter: 'blur(3px)' }, origin: '50% 100%' },
  { id: 'bottom-left-florals', at: 7.5, dur: 1.45, from: { opacity: 0, y: 30, scale: 0.97, filter: 'blur(3px)' }, origin: '50% 100%' },
  { id: 'portrait', at: 7.95, dur: 1.6, from: { opacity: 0, y: 35, filter: 'blur(5px)' } },
  { id: 'bottom-left-ribbon', at: 8.5, dur: 1.35, from: { opacity: 0, x: 24, rotate: -1.4 }, origin: '0% 60%' },
  { id: 'bottom-right-ribbon', at: 8.65, dur: 1.35, from: { opacity: 0, x: -24, rotate: 1.4 }, origin: '100% 60%' },
];

const MEDALLION_ORDER = ['date', 'time', 'location'];

/** Puts the scene in its pre-reveal state. Nothing here lives in CSS, so if JS never runs the invitation is simply visible. */
export function setInitialState(root: HTMLElement) {
  const q = gsap.utils.selector(root);

  for (const move of LAYER_MOVES) {
    const el = q(`[data-layer="${move.id}"]`);
    if (!el.length) continue;
    if (move.origin) gsap.set(el, { transformOrigin: move.origin });
    gsap.set(el, move.from);
  }

  gsap.set(q('[data-grain]'), { opacity: 0 });
  gsap.set(q('[data-medallion]'), { opacity: 0, y: 24, scale: 0.96 });
  gsap.set(q('[data-anim="med-label"], [data-anim="med-value"]'), { opacity: 0, y: 6 });
  gsap.set(q('[data-anim="word"]'), { opacity: 0, y: 8 });
  gsap.set(q('[data-anim="name-clip"]'), { clipPath: 'inset(0% 0% 0% 100%)' });
  gsap.set(q('[data-anim="name-text"]'), { opacity: 0, y: 12, filter: 'blur(4px)' });
  gsap.set(q('[data-anim="support"]'), { opacity: 0, y: 10 });
  gsap.set(q('[data-anim="divider-left"]'), { scaleX: 0, transformOrigin: '100% 50%' });
  gsap.set(q('[data-anim="divider-right"]'), { scaleX: 0, transformOrigin: '0% 50%' });
  gsap.set(q('[data-anim="divider-ornament"]'), { opacity: 0, scale: 0.55, transformOrigin: '50% 50%' });
  gsap.set(q('[data-anim="closing-line"]'), { opacity: 0, y: 10 });
  gsap.set(q('[data-anim="final-line"]'), { opacity: 0, y: 8 });
  gsap.set(q('[data-anim="butterfly"]'), { opacity: 0, scale: 0.6 });
  gsap.set(q('[data-anim="mote"], [data-anim="petal"]'), { opacity: 0 });
}

/** Reduced motion: no movement at all, just a calm scene that is fully present. */
export function revealInstantly(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  gsap.set(q('[data-layer]'), { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'none', clipPath: 'none' });
  gsap.set(q('[data-grain]'), { opacity: 0.42 });
  gsap.set(q('[data-medallion]'), { opacity: 1, y: 0, scale: 1 });
  gsap.set(
    q(
      '[data-anim="med-label"], [data-anim="med-value"], [data-anim="word"], [data-anim="support"], [data-anim="closing-line"], [data-anim="final-line"]',
    ),
    { opacity: 1, y: 0 },
  );
  gsap.set(q('[data-anim="name-clip"]'), { clipPath: 'none' });
  gsap.set(q('[data-anim="name-text"]'), { opacity: 1, y: 0, filter: 'none' });
  gsap.set(q('[data-anim="divider-left"], [data-anim="divider-right"]'), { scaleX: 1 });
  gsap.set(q('[data-anim="divider-ornament"]'), { opacity: 1, scale: 1 });
  gsap.set(q('[data-anim="butterfly"]'), { opacity: 0.85, scale: 1 });
  gsap.set(q('[data-anim="mote"]'), { opacity: 0.5 });
  gsap.set(q('[data-anim="petal"]'), { opacity: 0.62 });
}

export function buildMasterTimeline(root: HTMLElement): gsap.core.Timeline {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, paused: true });

  // ── 0.00–0.90  paper ────────────────────────────────────────────────────────
  tl.to(q('[data-grain]'), { opacity: 0.42, duration: 0.9, ease: 'none' }, 0);

  // ── botanical groups ────────────────────────────────────────────────────────
  for (const move of LAYER_MOVES) {
    const el = q(`[data-layer="${move.id}"]`);
    if (!el.length) continue;
    const to: gsap.TweenVars = { duration: move.dur, ease: 'power2.out' };
    if ('opacity' in move.from) to.opacity = 1;
    if ('x' in move.from) to.x = 0;
    if ('y' in move.from) to.y = 0;
    if ('scale' in move.from) to.scale = 1;
    if ('scaleY' in move.from) to.scaleY = 1;
    if ('rotate' in move.from) to.rotate = 0;
    if ('filter' in move.from) to.filter = 'blur(0px)';
    if ('clipPath' in move.from) to.clipPath = 'inset(0% 0% 0% 0%)';
    tl.to(el, to, move.at);
  }

  // ── 2.00–4.20  poetic lines, word by word, right to left ────────────────────
  const poeticLines = q('[data-anim="poetic"] p');
  poeticLines.forEach((line, i) => {
    tl.to(
      line.querySelectorAll('[data-anim="word"]'),
      { opacity: 1, y: 0, duration: 0.78, stagger: 0.09, ease: 'power2.out' },
      2.0 + i * 0.62,
    );
  });

  // ── 4.00–5.60  the name ─────────────────────────────────────────────────────
  const nameText = root.querySelector<HTMLElement>('[data-anim="name-text"]');

  tl.to(q('[data-anim="name-clip"]'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power2.inOut' }, 4.0)
    // drop the clip once the wipe is done so nothing can shave the calligraphy afterwards
    .set(q('[data-anim="name-clip"]'), { clipPath: 'none' }, 5.32)
    .to(q('[data-anim="name-text"]'), { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.25 }, 4.0)
    // one narrow gold pass, then it rests plum again
    .fromTo(
      nameText,
      { backgroundPosition: '100% 0' },
      {
        backgroundPosition: '0% 0',
        duration: 0.78,
        ease: 'power1.inOut',
        onStart: () => nameText?.setAttribute('data-sweep', 'on'),
        onComplete: () => nameText?.removeAttribute('data-sweep'),
      },
      5.45,
    );

  // ── 5.00–6.20  supporting line + divider ────────────────────────────────────
  tl.to(q('[data-anim="support"]'), { opacity: 1, y: 0, duration: 0.95 }, 5.0)
    .to(q('[data-anim="divider-left"], [data-anim="divider-right"]'), { scaleX: 1, duration: 0.9, ease: 'power2.out' }, 5.35)
    .to(q('[data-anim="divider-ornament"]'), { opacity: 1, scale: 1, duration: 0.55 }, 5.9);

  // ── 5.80–7.60  medallions, right to left ────────────────────────────────────
  MEDALLION_ORDER.forEach((key, i) => {
    const el = root.querySelector<HTMLElement>(`[data-medallion="${key}"]`);
    if (!el) return;
    const at = 5.8 + i * 0.22;
    tl.to(el, { opacity: 1, y: 0, scale: 1, duration: 1.05 }, at)
      .to(el.querySelectorAll('[data-anim="med-label"]'), { opacity: 1, y: 0, duration: 0.5 }, at + 0.3)
      .to(el.querySelectorAll('[data-anim="med-value"]'), { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, at + 0.45);
  });

  // ── 8.60–10.20  ambient dust settles in ─────────────────────────────────────
  tl.to(q('[data-anim="mote"]'), { opacity: 0.5, duration: 1.2, stagger: 0.05 }, 8.6)
    .to(q('[data-anim="petal"]'), { opacity: 0.62, duration: 1.2, stagger: 0.12 }, 8.9);

  // ── 9.00+  butterflies, one at a time ───────────────────────────────────────
  q('[data-anim="butterfly"]').forEach((b, i) => {
    tl.to(b, { opacity: 0.85, scale: 1, duration: 0.85 }, 9.0 + i * 0.45);
  });

  // ── 8.80–10.80  closing ─────────────────────────────────────────────────────
  tl.to(q('[data-anim="closing-line"]'), { opacity: 1, y: 0, duration: 0.95, stagger: 0.3 }, 8.8)
    .to(q('[data-anim="final-line"]'), { opacity: 1, y: 0, duration: 0.9 }, 9.95);

  return tl;
}

/**
 * Ambient life once the reveal has settled. Every loop has its own duration so the scene
 * never falls into a mechanical rhythm.
 */
export function startIdleLoops(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const light = isLowPower();
  const sway = (sel: string, vars: gsap.TweenVars, duration: number) => {
    const el = q(sel);
    if (!el.length) return;
    gsap.to(el, { ...vars, duration, ease: 'sine.inOut', repeat: -1, yoyo: true });
  };

  sway('[data-layer="top-left-leaves"]', { rotate: 0.62 }, 7.4);
  sway('[data-layer="top-left-florals"]', { y: -1.6 }, 6.8);
  sway('[data-layer="top-right-branch"]', { rotate: -0.55, y: 1.4 }, 6.2);
  sway('[data-layer="mid-right-cluster"]', { rotate: 0.7 }, 5.8);
  sway('[data-layer="right-sprigs"]', { rotate: -0.6 }, 5.1);
  sway('[data-layer="bottom-right-florals"]', { rotate: 0.4 }, 8.3);
  sway('[data-layer="bottom-left-florals"]', { rotate: -0.36 }, 9.1);
  // a small natural swing that carries the tassel with it
  sway('[data-layer="cap"]', { y: -2.6, rotate: 0.8 }, 6.6);
  sway('[data-layer="gold-speckles"]', { opacity: 0.52 }, 4.7);
  sway('[data-layer="portrait"]', { y: -1.6 }, 11.5);
  sway('[data-layer="arch"]', { y: -1.2 }, 12.5);

  if (light) return;

  q('[data-anim="mote"]').forEach((el, i) => {
    gsap.to(el, {
      y: i % 2 ? -9 : 8,
      x: i % 3 ? 5 : -6,
      opacity: 0.28,
      duration: 6 + (i % 5) * 1.35,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: i * 0.28,
    });
  });

  q('[data-anim="petal"]').forEach((el, i) => {
    gsap.to(el, {
      y: 12 + i * 3,
      x: i % 2 ? -7 : 6,
      rotate: `+=${i % 2 ? 12 : -14}`,
      duration: 11 + i * 2.4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: i * 0.9,
    });
  });

  q('[data-anim="butterfly"]').forEach((el, i) => {
    gsap.to(el, {
      x: i % 2 ? 7 : -8,
      y: i % 2 ? -6 : -9,
      duration: 9 + i * 2.1,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: i * 1.1,
    });
    gsap.to(el.querySelectorAll('[data-anim="wing-a"], [data-anim="wing-b"]'), {
      scaleX: 0.82,
      transformOrigin: '50% 50%',
      duration: 1.5 + i * 0.35,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: i * 0.4,
    });
  });
}
