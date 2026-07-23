'use client';

import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';

import AmbientParticles from './AmbientParticles';
import AudioToggle from './AudioToggle';
import BotanicalLayers from './BotanicalLayers';
import Butterflies from './Butterflies';
import ClosingText from './ClosingText';
import GraduateName from './GraduateName';
import InformationMedallions from './InformationMedallions';
import OpeningGate from './OpeningGate';
import PoeticText from './PoeticText';
import SupportingLine from './SupportingLine';

import { asset } from '@/lib/config';
import { invitationContent } from '@/lib/invitationContent';
import { buildMasterTimeline, prefersReducedMotion, revealInstantly, setInitialState, startIdleLoops } from '@/lib/animationTimeline';
import s from './invitation.module.css';

export default function Invitation() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<gsap.Context | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [started, setStarted] = useState(false);

  useLayoutEffect(() => {
    const root = canvasRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        revealInstantly(root);
        return;
      }
      setInitialState(root);
      const tl = buildMasterTimeline(root);
      tl.eventCallback('onComplete', () => {
        // registered on the context so it is cleaned up with everything else
        contextRef.current?.add(() => startIdleLoops(root));
      });
      timelineRef.current = tl;
    }, root);

    contextRef.current = ctx;
    return () => {
      ctx.revert();
      contextRef.current = null;
      timelineRef.current = null;
    };
  }, []);

  const handleOpen = useCallback(() => {
    setStarted(true);
    timelineRef.current?.play(0);
  }, []);

  return (
    <main className={s.page}>
      <section
        ref={canvasRef}
        className={s.canvas}
        aria-label={invitationContent.ui.invitationLabel}
        /* while the gate covers the scene, keep the medallions out of the tab order */
        inert={!started}
        style={{ '--grain-src': `url(${asset('/invitation/paper-grain.png')})` } as CSSProperties}
      >
        <div className={s.paper} data-paper aria-hidden="true" />
        {/*
         * Grain textures the bare paper so it matches the real paper grain the layer crops
         * already carry. It blends with soft-light, which leaves the base tone untouched —
         * a darkening blend here makes every crop read as a lighter rectangle.
         */}
        <div className={s.grain} data-grain aria-hidden="true" />

        <BotanicalLayers />

        <AmbientParticles />
        <Butterflies />

        <PoeticText />
        <GraduateName />
        <SupportingLine />
        <InformationMedallions />
        <ClosingText />

        {/* light and vignette go last so they fall on artwork, medallions and text alike */}
        <div className={s.light} aria-hidden="true" />
        <div className={s.vignette} aria-hidden="true" />
      </section>

      <AudioToggle started={started} />
      <OpeningGate onOpen={handleOpen} />
    </main>
  );
}
