import s from './invitation.module.css';

/**
 * Positions are fixed (never random) so the server and client markup match exactly.
 * All three sit inside the arch and well clear of the closing Arabic lines.
 */
const BUTTERFLIES = [
  { left: 30.5, top: 78.2, size: 2.1, tilt: -8 },
  { left: 67.0, top: 76.4, size: 1.75, tilt: 10 },
  { left: 36.5, top: 87.6, size: 1.5, tilt: -4 },
];

export default function Butterflies() {
  return (
    <div className={s.butterflies} aria-hidden="true">
      {BUTTERFLIES.map((b, i) => (
        <div
          key={i}
          className={s.butterfly}
          data-anim="butterfly"
          style={{
            right: `${b.left}%`,
            top: `${b.top}%`,
            width: `${b.size}cqw`,
            transform: `rotate(${b.tilt}deg)`,
          }}
        >
          <svg viewBox="0 0 20 15" width="100%" height="100%" fill="none">
            <g className={s.wing} data-anim="wing-a">
              <path
                d="M10 7.5 C7.6 3.1 4.2 1.2 2.1 2.4 C0.2 3.5 0.8 6.6 3 8 C5 9.3 8 8.8 10 7.5 Z"
                fill="var(--lavender-pale)"
                stroke="var(--lavender)"
                strokeWidth="0.35"
                opacity="0.82"
              />
              <path
                d="M10 7.5 C8.2 9.9 5.8 12.4 4 12 C2.4 11.6 2.6 9.6 4.2 8.6 C5.9 7.6 8.4 7.4 10 7.5 Z"
                fill="var(--lavender-pale)"
                stroke="var(--lavender)"
                strokeWidth="0.32"
                opacity="0.72"
              />
            </g>
            <g className={s.wing} data-anim="wing-b">
              <path
                d="M10 7.5 C12.4 3.1 15.8 1.2 17.9 2.4 C19.8 3.5 19.2 6.6 17 8 C15 9.3 12 8.8 10 7.5 Z"
                fill="var(--lavender-pale)"
                stroke="var(--lavender)"
                strokeWidth="0.35"
                opacity="0.82"
              />
              <path
                d="M10 7.5 C11.8 9.9 14.2 12.4 16 12 C17.6 11.6 17.4 9.6 15.8 8.6 C14.1 7.6 11.6 7.4 10 7.5 Z"
                fill="var(--lavender-pale)"
                stroke="var(--lavender)"
                strokeWidth="0.32"
                opacity="0.72"
              />
            </g>
            <path d="M10 5.4 L10 9.8" stroke="var(--plum)" strokeWidth="0.5" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>
      ))}
    </div>
  );
}
