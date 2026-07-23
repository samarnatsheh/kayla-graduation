import s from './invitation.module.css';

/**
 * Fixed positions (no randomness — the markup has to match between server and client).
 * Every particle sits in a band of empty paper, never over an Arabic line.
 */
const MOTES = [
  { r: 12, t: 30.5, size: 0.5 },
  { r: 24, t: 34.8, size: 0.4 },
  { r: 36, t: 29.6, size: 0.55 },
  { r: 48, t: 33.4, size: 0.42 },
  { r: 60, t: 30.2, size: 0.5 },
  { r: 72, t: 35.2, size: 0.45 },
  { r: 86, t: 31.4, size: 0.38 },
  { r: 30, t: 36.6, size: 0.36 },
  { r: 66, t: 36.8, size: 0.34 },
  { r: 6, t: 13.0, size: 0.42 },
  { r: 94, t: 9.5, size: 0.4 },
  { r: 54, t: 12.0, size: 0.34 },
];

const PETALS = [
  { r: 18, t: 32.4, size: 1.05, tilt: 18 },
  { r: 78, t: 33.0, size: 0.92, tilt: -24 },
  { r: 44, t: 36.2, size: 0.85, tilt: 8 },
];

export default function AmbientParticles() {
  return (
    <div className={s.particles} aria-hidden="true">
      {MOTES.map((p, i) => (
        <span
          key={`m${i}`}
          className={s.particle}
          data-anim="mote"
          style={{
            right: `${p.r}%`,
            top: `${p.t}%`,
            width: `${p.size}cqw`,
            height: `${p.size}cqw`,
            background: 'radial-gradient(circle, rgba(197,165,111,0.62) 0%, rgba(197,165,111,0) 70%)',
          }}
        />
      ))}

      {PETALS.map((p, i) => (
        <span
          key={`p${i}`}
          className={s.particle}
          data-anim="petal"
          style={{
            right: `${p.r}%`,
            top: `${p.t}%`,
            width: `${p.size}cqw`,
            height: `${p.size * 0.66}cqw`,
            borderRadius: '62% 38% 58% 42%',
            background: 'rgba(216,205,217,0.5)',
            transform: `rotate(${p.tilt}deg)`,
          }}
        />
      ))}
    </div>
  );
}
