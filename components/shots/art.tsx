/*
 * Illustrated stills for the screenshots: webcam tiles, a lecture frame and a
 * phone photo of a notebook. Vector so they stay sharp at 2x, with soft
 * gradients and blur so they read as camera images rather than icons.
 */

type Person = { skin: number; hair: string; shirt: string; wall: string; x?: number; tilt?: number; glasses?: boolean; long?: boolean; beard?: boolean };

export const people: Person[] = [
  { skin: 0.72, hair: "#2a1d17", shirt: "#3d5a80", wall: "#d9d2c5", long: true },
  { skin: 0.66, hair: "#17110e", shirt: "#e9e4da", wall: "#bfc9cf", glasses: true },
  { skin: 0.7, hair: "#1d1410", shirt: "#7a2f3b", wall: "#e4dccd", long: true, x: -4 },
  { skin: 0.62, hair: "#120c0a", shirt: "#2f4a3a", wall: "#c9c3b8", beard: true, x: 3 },
  { skin: 0.74, hair: "#3a271d", shirt: "#c99a3d", wall: "#d5dbe0", long: true, glasses: true },
  { skin: 0.64, hair: "#16100c", shirt: "#1f2937", wall: "#e8e1d4", x: -2 },
  { skin: 0.69, hair: "#21160f", shirt: "#5b6b8c", wall: "#cfd6cf", long: true, x: 2 },
  { skin: 0.6, hair: "#0f0b09", shirt: "#8a8f98", wall: "#ddd5c8", beard: true, glasses: true },
  { skin: 0.71, hair: "#2b1c14", shirt: "#3f6f6a", wall: "#d8cfc0", x: -3 },
  { skin: 0.67, hair: "#1a120e", shirt: "#a14f3c", wall: "#c4ccd4", long: true },
  { skin: 0.63, hair: "#140e0b", shirt: "#e3e0d8", wall: "#d0c8bb", beard: true },
  { skin: 0.73, hair: "#33241a", shirt: "#4a4e69", wall: "#dcd6cb", long: true, x: 3 },
];

const skinCol = (l: number, d = 0) => `oklch(${(l - d).toFixed(3)} 0.075 55)`;

/** One webcam frame. `extra` puts a second, out-of-focus person behind the candidate. */
export function Webcam({ p, id, extra, className, dim }: { p: Person; id: string; extra?: boolean; className?: string; dim?: boolean }) {
  const x = p.x ?? 0;
  return (
    <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <radialGradient id={`f${id}`} cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor={skinCol(p.skin + 0.05)} />
          <stop offset="1" stopColor={skinCol(p.skin, 0.08)} />
        </radialGradient>
        <linearGradient id={`w${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={p.wall} />
          <stop offset="1" stopColor={p.wall} stopOpacity="0.75" />
        </linearGradient>
        <radialGradient id={`v${id}`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </radialGradient>
        <filter id={`b${id}`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" /></filter>
        <filter id={`s${id}`}><feGaussianBlur stdDeviation="0.5" /></filter>
      </defs>
      <rect width="160" height="120" fill="#6f6a63" />
      <rect width="160" height="120" fill={`url(#w${id})`} />
      {/* room, out of focus */}
      <g filter={`url(#b${id})`} opacity="0.85">
        <rect x="112" y="8" width="40" height="52" rx="2" fill="#f4efe6" opacity="0.55" />
        <rect x="116" y="12" width="15" height="44" fill="#a8c0cf" opacity="0.6" />
        <rect x="133" y="12" width="15" height="44" fill="#a8c0cf" opacity="0.5" />
        <rect x="6" y="30" width="34" height="5" fill="#7b5b40" opacity="0.7" />
        <rect x="9" y="18" width="5" height="12" fill="#b14d3a" opacity="0.7" />
        <rect x="16" y="20" width="4" height="10" fill="#3e6d8e" opacity="0.7" />
        <rect x="22" y="16" width="6" height="14" fill="#d7b46a" opacity="0.7" />
        {extra && (
          <g transform="translate(118 30)">
            <ellipse cx="10" cy="14" rx="8.5" ry="10.5" fill={skinCol(0.68)} />
            <path d="M1.5,12 C2,3 8,0 11,0 C16,0 19.5,4 18.5,12 C16,7 6,6 1.5,12 Z" fill="#1b130f" />
            <path d="M-8,60 C-6,40 2,32 10,32 C19,32 27,40 28,60 Z" fill="#6b7a5a" />
          </g>
        )}
      </g>
      {/* candidate */}
      <g transform={`translate(${x} 0)`} filter={`url(#s${id})`}>
        {p.long && <path d="M55,52 C52,80 56,100 62,108 L98,108 C104,100 108,80 105,52 Z" fill={p.hair} />}
        <path d="M14,120 C17,96 42,86 80,86 C118,86 143,96 146,120 Z" fill={p.shirt} />
        <path d="M14,120 C17,96 42,86 80,86 C118,86 143,96 146,120 Z" fill="#000" opacity="0.08" />
        <path d="M70,72 L90,72 L92,90 C86,95 74,95 68,90 Z" fill={skinCol(p.skin, 0.07)} />
        <ellipse cx="62.5" cy="57" rx="3" ry="5" fill={skinCol(p.skin, 0.04)} />
        <ellipse cx="97.5" cy="57" rx="3" ry="5" fill={skinCol(p.skin, 0.04)} />
        <ellipse cx="80" cy="54" rx="17.5" ry="22" fill={`url(#f${id})`} />
        {p.beard && <path d="M63,58 C64,72 72,77 80,77 C88,77 96,72 97,58 C94,66 88,68 80,68 C72,68 66,66 63,58 Z" fill={p.hair} opacity="0.85" />}
        <path d={p.long ? "M61,56 C59,36 68,29 80,29 C93,29 102,36 99,56 C97,44 92,38 80,38 C70,38 64,43 61,56 Z" : "M62,50 C61,36 69,30 80,30 C92,30 100,36 98,50 C95,42 90,39 80,39 C71,39 65,42 62,50 Z"} fill={p.hair} />
        <g opacity="0.75">
          <ellipse cx="73" cy="54" rx="1.6" ry="1.2" fill="#2a1b14" />
          <ellipse cx="87" cy="54" rx="1.6" ry="1.2" fill="#2a1b14" />
          <path d="M69.5,49.5 Q73,48 76,49.5 M84,49.5 Q87,48 90.5,49.5" stroke="#2a1b14" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M76.5,66 Q80,67.5 83.5,66" stroke="#7a3e30" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        </g>
        {p.glasses && (
          <g fill="none" stroke="#1e1a17" strokeWidth="1" opacity="0.8">
            <rect x="67.5" y="50" width="11" height="8" rx="3" />
            <rect x="81.5" y="50" width="11" height="8" rx="3" />
            <path d="M78.5,53 L81.5,53" />
          </g>
        )}
      </g>
      {/* screen glow on the face and lens vignette */}
      <rect width="160" height="120" fill="#a9c4ff" opacity="0.05" />
      <rect width="160" height="120" fill={`url(#v${id})`} />
      {dim && <rect width="160" height="120" fill="#000" opacity="0.35" />}
    </svg>
  );
}

/** A frame from a recorded lecture: chalkboard with the incline problem and the teacher on the right. */
export function Lecture({ className, id = "lec", topic = "projectile" }: { className?: string; id?: string; topic?: "projectile" | "friction" }) {
  const chalk = "#eef0e6";
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}b`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#24372f" />
          <stop offset="1" stopColor="#1a2924" />
        </linearGradient>
        <radialGradient id={`${id}l`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.25" />
        </radialGradient>
        <radialGradient id={`${id}f`} cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="oklch(0.74 0.075 55)" />
          <stop offset="1" stopColor="oklch(0.6 0.075 55)" />
        </radialGradient>
        <filter id={`${id}c`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" /><feColorMatrix in="n" type="saturate" values="0" /><feComponentTransfer><feFuncA type="table" tableValues="0 0.07" /></feComponentTransfer><feComposite in2="SourceGraphic" operator="in" /></filter>
        <filter id={`${id}s`}><feGaussianBlur stdDeviation="0.6" /></filter>
      </defs>
      <rect width="1600" height="900" fill="#3b3732" />
      <rect x="0" y="0" width="1600" height="820" fill={`url(#${id}b)`} />
      <rect x="0" y="0" width="1600" height="820" filter={`url(#${id}c)`} fill="#fff" />
      <rect x="0" y="812" width="1600" height="16" fill="#8a6a49" />
      <rect x="0" y="828" width="1600" height="72" fill="#4a443d" />
      {/* chalk smudges */}
      <g opacity="0.06" fill={chalk}><ellipse cx="420" cy="620" rx="260" ry="60" /><ellipse cx="900" cy="200" rx="200" ry="40" /></g>
      {topic === "friction" ? (
      <g stroke={chalk} fill="none" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}s)`}>
        <text x="90" y="120" fill={chalk} stroke="none" fontSize="54" fontStyle="italic" fontWeight="500" letterSpacing="1">Friction on an incline</text>
        <path d="M90,142 L680,138" strokeWidth="3" opacity="0.7" />
        <path d="M120,720 L860,720" strokeWidth="4" />
        <path d="M120,720 L860,330" strokeWidth="4" />
        <path d="M860,330 L860,720" strokeWidth="2.5" strokeDasharray="10 10" opacity="0.6" />
        <path d="M240,720 A120,120 0 0 0 226,664" strokeWidth="3" />
        <text x="252" y="700" fill={chalk} stroke="none" fontSize="38" fontStyle="italic">θ</text>
        <g transform="translate(470 535) rotate(-27.8)">
          <rect x="-70" y="-110" width="140" height="110" strokeWidth="4" />
          <path d="M0,-55 L0,-250" strokeWidth="4" />
          <path d="M0,-250 L-14,-224 M0,-250 L14,-224" strokeWidth="4" />
          <text x="18" y="-226" fill={chalk} stroke="none" fontSize="38" fontStyle="italic" transform="rotate(27.8 18 -226)">N</text>
          <path d="M70,-20 L240,-20" strokeWidth="4" stroke="#f3d27a" />
          <path d="M240,-20 L214,-34 M240,-20 L214,-6" strokeWidth="4" stroke="#f3d27a" />
          <text x="250" y="-30" fill="#f3d27a" stroke="none" fontSize="38" fontStyle="italic" transform="rotate(27.8 250 -30)">f</text>
        </g>
        <path d="M470,480 L470,700" strokeWidth="4" />
        <path d="M470,700 L456,674 M470,700 L484,674" strokeWidth="4" />
        <text x="486" y="690" fill={chalk} stroke="none" fontSize="36" fontStyle="italic">mg</text>
        <g fill={chalk} stroke="none" fontSize="40" fontStyle="italic">
          <text x="900" y="250">N = mg cos θ</text>
          <text x="900" y="320">f = μN = μ mg cos θ</text>
          <text x="900" y="430">ma = mg sin θ − μ mg cos θ</text>
          <text x="900" y="530">a = g (sin θ − μ cos θ)</text>
        </g>
        <path d="M880,555 C870,570 1240,570 1300,552" strokeWidth="2.5" stroke="#f3d27a" opacity="0.8" />
        <text x="900" y="640" fill={chalk} stroke="none" fontSize="34" fontStyle="italic" opacity="0.85">slides only if tan θ &gt; μ</text>
      </g>
      ) : (
      <g stroke={chalk} fill="none" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}s)`}>
        <text x="90" y="120" fill={chalk} stroke="none" fontSize="54" fontStyle="italic" fontWeight="500" letterSpacing="1">Projectile on an incline</text>
        <path d="M90,142 L700,138" strokeWidth="3" opacity="0.7" />
        {/* incline */}
        <path d="M120,700 L860,700 L120,330 Z" strokeWidth="4" opacity="0.0" />
        <path d="M120,700 L900,700" strokeWidth="4" />
        <path d="M120,700 L860,400" strokeWidth="4" />
        <path d="M230,700 A110,110 0 0 0 222,660" strokeWidth="3" />
        <text x="250" y="682" fill={chalk} stroke="none" fontSize="38" fontStyle="italic">β</text>
        {/* axes along incline */}
        <path d="M150,688 L320,620" strokeWidth="2.5" strokeDasharray="10 10" opacity="0.8" />
        <path d="M150,688 L105,575" strokeWidth="2.5" strokeDasharray="10 10" opacity="0.8" />
        <text x="330" y="616" fill={chalk} stroke="none" fontSize="32" fontStyle="italic">x′</text>
        <text x="80" y="566" fill={chalk} stroke="none" fontSize="32" fontStyle="italic">y′</text>
        {/* trajectory */}
        <path d="M150,688 C260,420 520,330 720,458" strokeWidth="4.5" stroke="#f3d27a" />
        <path d="M150,688 L250,480" strokeWidth="4" />
        <path d="M250,480 L232,505 M250,480 L254,510" strokeWidth="4" />
        <text x="262" y="478" fill={chalk} stroke="none" fontSize="38" fontStyle="italic">u</text>
        <path d="M205,666 A60,60 0 0 0 190,612" strokeWidth="3" />
        <text x="214" y="628" fill={chalk} stroke="none" fontSize="34" fontStyle="italic">α</text>
        <circle cx="720" cy="458" r="9" fill={chalk} />
        <text x="732" y="440" fill={chalk} stroke="none" fontSize="32">P</text>
        {/* equations */}
        <g fill={chalk} stroke="none" fontSize="40" fontStyle="italic">
          <text x="880" y="250">a<tspan fontSize="28" dy="10">x′</tspan><tspan dy="-10"> = −g sin β</tspan></text>
          <text x="880" y="320">a<tspan fontSize="28" dy="10">y′</tspan><tspan dy="-10"> = −g cos β</tspan></text>
          <text x="880" y="430">T = 2u sin α / g cos β</text>
          <text x="880" y="530">R = 2u² sin α cos(α+β)</text>
          <text x="1010" y="584" fontSize="36">g cos² β</text>
        </g>
        <path d="M960,545 L1250,545" strokeWidth="3" />
        <path d="M860,455 C850,470 1160,470 1220,452" strokeWidth="2.5" stroke="#f3d27a" opacity="0.8" />
      </g>
      )}
      <rect width="1600" height="900" fill={`url(#${id}l)`} />
      {/* teacher, slightly soft as if in front of the board */}
      <g transform="translate(1330 420) scale(0.88)">
        <path d="M-40,520 C-30,300 40,250 150,250 C260,250 330,300 340,520 Z" fill="#5c6f8f" />
        <path d="M95,250 L150,330 L205,250 Z" fill="#e9e3d6" />
        <path d="M118,170 L182,170 L188,262 C170,280 130,280 112,262 Z" fill="oklch(0.62 0.075 55)" />
        <ellipse cx="150" cy="120" rx="66" ry="84" fill={`url(#${id}f)`} />
        <path d="M80,130 C70,40 110,22 152,22 C200,22 236,48 222,130 C214,80 192,62 150,62 C108,62 88,84 80,130 Z" fill="#1b1310" />
        <path d="M84,120 C72,170 80,240 98,262 L78,262 C60,220 60,160 84,120 Z" fill="#1b1310" />
        <path d="M216,120 C228,170 222,240 204,262 L224,262 C240,220 240,160 216,120 Z" fill="#1b1310" />
        <g opacity="0.7" fill="#2a1b14">
          <ellipse cx="124" cy="116" rx="6" ry="4.5" /><ellipse cx="176" cy="116" rx="6" ry="4.5" />
        </g>
        <path d="M134,160 Q150,168 166,160" stroke="#7a3e30" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M-10,400 C30,360 60,330 70,300" stroke="#4d5f7d" strokeWidth="40" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

/** A phone photo of a handwritten problem in a ruled notebook. */
export function NotebookPhoto({ className, id = "nb" }: { className?: string; id?: string }) {
  const ink = "#1f3a8a";
  return (
    <svg viewBox="0 0 480 360" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}p`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fbf8f0" />
          <stop offset="1" stopColor="#e9e3d4" />
        </linearGradient>
        <radialGradient id={`${id}s`} cx="0.3" cy="0.2" r="1">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </radialGradient>
        <filter id={`${id}i`}><feGaussianBlur stdDeviation="0.35" /></filter>
      </defs>
      <rect width="480" height="360" fill="#7b6a58" />
      <g transform="rotate(-3 240 180)">
        <rect x="18" y="-10" width="470" height="390" fill={`url(#${id}p)`} />
        {Array.from({ length: 13 }, (_, i) => <line key={i} x1="18" x2="488" y1={38 + i * 28} y2={38 + i * 28} stroke="#9fb5d6" strokeWidth="1" opacity="0.7" />)}
        <line x1="70" x2="70" y1="-10" y2="380" stroke="#e08a8a" strokeWidth="1.4" opacity="0.8" />
        <g fill={ink} filter={`url(#${id}i)`} fontStyle="italic" style={{ fontFamily: "var(--font-archivo)" }}>
          <text x="80" y="58" fontSize="20" fontWeight="500">Q7. Find the roots and the nature of roots</text>
          <text x="112" y="114" fontSize="30" fontWeight="500">2x² − 7x + 3 = 0</text>
          <text x="96" y="170" fontSize="22">D = b² − 4ac = 49 − 24 = 25</text>
          <text x="96" y="226" fontSize="22">x = (7 ± 5) / 2 ... ?</text>
          <text x="96" y="282" fontSize="22" opacity="0.7">x = 6, 1 ??</text>
        </g>
        <path d="M300,214 C320,206 336,218 350,208" stroke={ink} strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M92,290 L210,262" stroke={ink} strokeWidth="1.6" opacity="0.55" />
      </g>
      <rect width="480" height="360" fill={`url(#${id}s)`} />
    </svg>
  );
}
