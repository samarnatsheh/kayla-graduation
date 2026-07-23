import { invitationContent } from '@/lib/invitationContent';
import s from './invitation.module.css';

/**
 * Each line is split on spaces only, so every Arabic word keeps its ligatures intact and
 * is revealed as a whole. DOM order is already right-to-left visually under dir="rtl",
 * so a plain stagger reads as a right-to-left reveal.
 */
export default function PoeticText() {
  return (
    <div className={`${s.block} ${s.poetic}`} data-anim="poetic">
      {invitationContent.poeticLines.map((line, i) => {
        const words = line.split(' ');
        return (
          <p key={i} className={s.poeticLine}>
            {words.map((word, j) => (
              <span key={j} className={s.word} data-anim="word">
                {word}
                {j < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
