import { invitationContent } from '@/lib/invitationContent';
import s from './invitation.module.css';

export default function ClosingText() {
  return (
    <>
      <div className={`${s.block} ${s.closing}`}>
        {invitationContent.closingLines.map((line, i) => (
          <p key={i} className={s.closingLine} data-anim="closing-line">
            {line}
          </p>
        ))}
      </div>

      <div className={`${s.block} ${s.final}`}>
        <p className={s.finalText} data-anim="final-line">
          {invitationContent.finalLine}
        </p>
      </div>
    </>
  );
}
