/** Gradients shared by every Diya, defined once so their ids stay unique on the page. */
export default function DiyaGradients() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="diya-clay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e57a3c" />
          <stop offset=".55" stopColor="#a63c18" />
          <stop offset="1" stopColor="#5a1b0a" />
        </linearGradient>
        <linearGradient id="diya-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6a466" />
          <stop offset="1" stopColor="#c2552a" />
        </linearGradient>
        <radialGradient id="diya-oil" cx=".5" cy=".4" r=".6">
          <stop offset="0" stopColor="#9a5512" />
          <stop offset="1" stopColor="#2a1004" />
        </radialGradient>
      </defs>
    </svg>
  );
}
