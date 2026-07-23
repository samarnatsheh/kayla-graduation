'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { invitationContent } from '@/lib/invitationContent';
import { asset } from '@/lib/config';
import { layer, layerSrc } from '@/lib/layers';
import { prefersReducedMotion } from '@/lib/animationTimeline';
import s from './gate.module.css';

export default function OpeningGate({ onOpen }: { onOpen: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGEllipseElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [gone, setGone] = useState(false);
  const opening = useRef(false);

  // entrance
  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });

    const ring = ringRef.current;
    if (ring) {
      const length = ring.getTotalLength();
      gsap.set(ring, { strokeDasharray: length, strokeDashoffset: length });
    }

    if (prefersReducedMotion()) {
      gsap.set([emblemRef.current, eyebrowRef.current, buttonRef.current], { opacity: 1, y: 0, scale: 1 });
      gsap.set(clipRef.current, { clipPath: 'none' });
      if (ring) gsap.set(ring, { strokeDashoffset: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(emblemRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1.15 }, 0)
        // lavender stems rise into view from the bottom
        .fromTo(
          clipRef.current,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power2.inOut' },
          0.1,
        )
        .to(ringRef.current, { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut' }, 0.35)
        .fromTo(eyebrowRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.9 }, 1.05)
        .fromTo(buttonRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9 }, 1.35);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleOpen = useCallback(() => {
    if (opening.current) return;
    opening.current = true;

    if (prefersReducedMotion()) {
      onOpen();
      setGone(true);
      return;
    }

    gsap
      .timeline()
      .to(buttonRef.current, { scale: 0.97, duration: 0.1, ease: 'power2.out' })
      .to(buttonRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' })
      // thin paper dissolving into light
      .to(
        rootRef.current,
        { opacity: 0, scale: 1.035, filter: 'blur(7px)', duration: 0.95, ease: 'power2.inOut', onStart: onOpen },
        0.24,
      )
      .call(() => setGone(true));
  }, [onOpen]);

  if (gone) return null;

  const emblem = layer('emblem');

  return (
    <div
      ref={rootRef}
      className={s.gate}
      role="dialog"
      aria-label={invitationContent.ui.invitationLabel}
      style={{ '--grain-src': `url(${asset('/invitation/paper-grain.png')})` } as CSSProperties}
    >
      <div className={s.grain} aria-hidden="true" />

      <div className={s.inner}>
        <div ref={emblemRef} className={s.emblemWrap}>
          <div ref={clipRef} className={s.emblemClip}>
            <img className={s.emblemImg} src={layerSrc(emblem)} width={emblem.w} height={emblem.h} alt="" draggable={false} />
          </div>
          <svg className={s.ring} viewBox="0 0 100 118" fill="none" aria-hidden="true">
            <ellipse ref={ringRef} cx="50" cy="59" rx="46" ry="56" stroke="var(--gold-line)" strokeWidth="0.5" />
          </svg>
        </div>

        <p ref={eyebrowRef} className={s.eyebrow}>
          {invitationContent.gate.eyebrow}
        </p>

        <button ref={buttonRef} type="button" className={s.button} onClick={handleOpen}>
          {invitationContent.gate.button}
        </button>
      </div>
    </div>
  );
}
