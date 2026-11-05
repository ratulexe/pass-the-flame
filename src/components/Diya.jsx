const RIM_DOTS = [
  [16, 37],
  [26, 41.5],
  [38, 44.5],
  [49, 46],
  [71, 46],
  [82, 44.5],
  [94, 41.5],
  [104, 37],
];
const BOSS_DOTS = [
  [52, 54],
  [68, 54],
  [60, 61],
  [60, 47.5],
];

/** Clay diya. It lights when an ancestor has the `lit` class. `anchorRef` marks the wick. */
export default function Diya({ anchorRef, showTarget = false }) {
  return (
    <div className="diya">
      <svg viewBox="0 0 120 72" aria-hidden="true">
        <ellipse cx="60" cy="69" rx="22" ry="3" fill="#3a1206" />
        <path d="M6 26 C10 54 34 68 60 68 C86 68 110 54 114 26 Z" fill="url(#diya-clay)" />
        <g fill="#ffd166">
          {RIM_DOTS.map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r="1.9" />
          ))}
        </g>
        <circle cx="60" cy="54" r="4.6" fill="#e23d5b" />
        <circle cx="60" cy="54" r="1.9" fill="#ffd166" />
        <g fill="#ffd166">
          {BOSS_DOTS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" />
          ))}
        </g>
        <ellipse cx="60" cy="26" rx="54" ry="10" fill="url(#diya-rim)" />
        <ellipse cx="60" cy="25.5" rx="45" ry="6.5" fill="url(#diya-oil)" />
        <path d="M47 31 Q60 41 73 31 Q60 35.5 47 31 Z" fill="#f08a4a" />
        <path d="M60 31 L60 22.5" stroke="#2b1408" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <div className="anchor" ref={anchorRef}>
        <div className="halo" />
        {showTarget && <div className="wick-target" />}
        <div className="flame">
          <div className="flame-core" />
          <div className="flame-blue" />
        </div>
      </div>
    </div>
  );
}
