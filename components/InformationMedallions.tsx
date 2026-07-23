'use client';

import { useCallback, useRef, useState } from 'react';
import { invitationContent } from '@/lib/invitationContent';
import { MAP_URL, hasMapUrl } from '@/lib/config';
import { downloadInvitationIcs } from '@/lib/createCalendarEvent';
import { layer, layerFrameStyle, layerImageStyle, layerSrc } from '@/lib/layers';
import s from './invitation.module.css';

const { location, time, date, ui } = invitationContent;

type Medallion = {
  key: string;
  layerId: string;
  label: string;
  values: string[];
  action?: () => boolean;
  actionLabel?: string;
  flash?: string;
};

/**
 * Rendered right-to-left, matching how the sheet reads in Arabic: date sits on the right,
 * then time, then location. That also makes keyboard tab order follow the visual order.
 */
export default function InformationMedallions() {
  const [flash, setFlash] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const showFlash = useCallback((key: string) => {
    setFlash(key);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setFlash(null), 2400);
  }, []);

  const medallions: Medallion[] = [
    {
      key: 'date',
      layerId: 'medallion-date',
      label: date.label,
      values: [date.day, date.value],
      action: () => downloadInvitationIcs(),
      actionLabel: ui.dateAction,
      flash: ui.calendarConfirm,
    },
    {
      key: 'time',
      layerId: 'medallion-time',
      label: time.label,
      values: [time.value, time.suffix],
    },
    {
      key: 'location',
      layerId: 'medallion-location',
      label: location.label,
      values: [location.value, location.suffix],
      // stays a plain, non-clickable medallion until a real map link is pasted into lib/config.ts
      action: hasMapUrl
        ? () => {
            window.open(MAP_URL, '_blank', 'noopener,noreferrer');
            return true;
          }
        : undefined,
      actionLabel: ui.locationAction,
      flash: ui.mapTooltip,
    },
  ];

  return (
    <>
      {medallions.map((m) => {
        const l = layer(m.layerId);
        const interactive = Boolean(m.action);

        const inner = (
          <>
            <img
              className={s.medallionArt}
              src={layerSrc(l)}
              width={l.w}
              height={l.h}
              style={layerImageStyle(l)}
              alt=""
              draggable={false}
            />
            <span className={s.medallionText}>
              <span className={s.medLabel} data-anim="med-label">
                {m.label}
              </span>
              {m.values.map((v, i) => (
                <span key={i} className={s.medValue} data-anim="med-value">
                  {v}
                </span>
              ))}
            </span>
          </>
        );

        return (
          <div
            key={m.key}
            className={s.medallion}
            data-medallion={m.key}
            data-interactive={interactive}
            style={layerFrameStyle(l)}
          >
            {interactive ? (
              <button
                type="button"
                className={s.medallionPress}
                aria-label={m.actionLabel}
                onClick={() => {
                  if (m.action?.() && m.flash) showFlash(m.key);
                }}
              >
                {inner}
              </button>
            ) : (
              <div className={s.medallionPress}>{inner}</div>
            )}

            {m.flash && interactive ? (
              <span className={s.tooltip} role="status" data-visible={flash === m.key}>
                {m.flash}
              </span>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
