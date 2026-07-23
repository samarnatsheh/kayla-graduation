'use client';

import { useEffect, useRef, useState } from 'react';
import { AUDIO_SRC, asset } from '@/lib/config';
import { invitationContent } from '@/lib/invitationContent';
import s from './audio.module.css';

const STORAGE_KEY = 'kayla-invitation-muted';
const FADE_MS = 500;
const VOLUME = 0.42;

/**
 * Renders nothing unless a licensed audio file has been added and AUDIO_SRC set in
 * lib/config.ts — so there is never a broken player or a failed request.
 * Playback only ever begins after the opening button is pressed.
 */
export default function AudioToggle({ started }: { started: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  // restore this session's preference
  useEffect(() => {
    if (!AUDIO_SRC) return;
    setMuted(sessionStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  const fadeTo = (target: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current) window.clearInterval(fadeRef.current);

    const from = audio.volume;
    const steps = Math.max(1, Math.round(FADE_MS / 25));
    let step = 0;

    fadeRef.current = window.setInterval(() => {
      step += 1;
      const t = Math.min(1, step / steps);
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * t));
      if (t >= 1) {
        if (fadeRef.current) window.clearInterval(fadeRef.current);
        fadeRef.current = null;
        if (target === 0) audio.pause();
      }
    }, 25);
  };

  // start only once the invitation has been opened (a real user gesture)
  useEffect(() => {
    if (!AUDIO_SRC || !started || muted) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio
      .play()
      .then(() => fadeTo(VOLUME))
      .catch(() => {
        /* browser refused autoplay — the button still works */
      });
  }, [started, muted]);

  useEffect(() => () => { if (fadeRef.current) window.clearInterval(fadeRef.current); }, []);

  if (!AUDIO_SRC) return null;

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    sessionStorage.setItem(STORAGE_KEY, String(next));
    if (next) fadeTo(0);
    else {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = 0;
      audio.play().then(() => fadeTo(VOLUME)).catch(() => undefined);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={asset(AUDIO_SRC)}
        loop
        preload="auto"
        onCanPlay={() => setReady(true)}
        onError={() => setReady(false)}
      />
      {ready ? (
        <button
          type="button"
          className={s.toggle}
          onClick={toggle}
          aria-label={muted ? invitationContent.ui.soundOn : invitationContent.ui.soundOff}
          aria-pressed={!muted}
        >
          <svg className={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6.5 9H3v6h3.5L11 19z" />
            {muted ? <path d="M16.5 9.5 21 14.5M21 9.5l-4.5 5" /> : <path d="M15.5 8.6a4.6 4.6 0 0 1 0 6.8M18.2 6.3a8 8 0 0 1 0 11.4" />}
          </svg>
        </button>
      ) : null}
    </>
  );
}
