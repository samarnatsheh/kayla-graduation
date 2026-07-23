import { invitationContent } from '@/lib/invitationContent';
import s from './invitation.module.css';

export default function SupportingLine() {
  return (
    <>
      <div className={`${s.block} ${s.support}`}>
        <p className={s.supportText} data-anim="support">
          {invitationContent.supportingLine}
        </p>
      </div>

      {/* fine gold rule that draws outward from its centre ornament */}
      <div className={s.divider} aria-hidden="true">
        <svg viewBox="0 0 200 12" width="100%" height="100%" fill="none" preserveAspectRatio="xMidYMid meet">
          <g stroke="var(--gold-line)" strokeWidth="0.7" strokeLinecap="round">
            <line data-anim="divider-left" x1="94" y1="6" x2="10" y2="6" />
            <line data-anim="divider-right" x1="106" y1="6" x2="190" y2="6" />
            <circle cx="16" cy="6" r="0.8" fill="var(--gold-line)" stroke="none" data-anim="divider-left" />
            <circle cx="184" cy="6" r="0.8" fill="var(--gold-line)" stroke="none" data-anim="divider-right" />
          </g>
          <g data-anim="divider-ornament" fill="var(--gold)">
            <path d="M100 1.9 L102.6 6 L100 10.1 L97.4 6 Z" opacity="0.85" />
            <circle cx="100" cy="6" r="0.85" fill="var(--paper-art)" />
          </g>
        </svg>
      </div>
    </>
  );
}
