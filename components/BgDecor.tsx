// Inline SVG decorative backgrounds for section tiles
// Each variant fills its parent (absolute positioned, pointer-events-none)

export function BgMeshGrid({ opacity = 0.4, dark = false }: { opacity?: number; dark?: boolean }) {
  const color = dark ? "rgba(255,255,255,0.07)" : "rgba(245,148,92,0.12)";
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      <defs>
        <pattern id="mesh" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mesh)" style={{ opacity }}/>
    </svg>
  );
}

export function BgDots({ opacity = 0.35, dark = false }: { opacity?: number; dark?: boolean }) {
  const color = dark ? "rgba(255,255,255,0.2)" : "rgba(245,148,92,0.35)";
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      <defs>
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill={color}/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" style={{ opacity }}/>
    </svg>
  );
}

export function BgDiagonalLines({ opacity = 0.5, dark = false }: { opacity?: number; dark?: boolean }) {
  const color = dark ? "rgba(255,255,255,0.05)" : "rgba(245,148,92,0.08)";
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      <defs>
        <pattern id="diag" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="20" stroke={color} strokeWidth="1.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diag)" style={{ opacity }}/>
    </svg>
  );
}

export function BgCircles({ opacity = 0.5, dark = false }: { opacity?: number; dark?: boolean }) {
  const stroke = dark ? "rgba(255,255,255,0.06)" : "rgba(245,148,92,0.1)";
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden preserveAspectRatio="xMidYMid slice">
      <circle cx="0" cy="0" r="200" fill="none" stroke={stroke} strokeWidth="1" style={{ opacity }}/>
      <circle cx="0" cy="0" r="350" fill="none" stroke={stroke} strokeWidth="1" style={{ opacity }}/>
      <circle cx="100%" cy="100%" r="200" fill="none" stroke={stroke} strokeWidth="1" style={{ opacity }}/>
      <circle cx="100%" cy="100%" r="350" fill="none" stroke={stroke} strokeWidth="1" style={{ opacity }}/>
    </svg>
  );
}

export function BgHex({ opacity = 0.5, dark = false }: { opacity?: number; dark?: boolean }) {
  const stroke = dark ? "rgba(255,255,255,0.05)" : "rgba(245,148,92,0.09)";
  const W = 60; const H = 52;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      <defs>
        <pattern id="hex" x="0" y="0" width={W} height={H} patternUnits="userSpaceOnUse">
          <polygon points={`${W/2},2 ${W-2},${H/4} ${W-2},${3*H/4} ${W/2},${H-2} 2,${3*H/4} 2,${H/4}`}
            fill="none" stroke={stroke} strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" style={{ opacity }}/>
    </svg>
  );
}

export function BgGlowBlob({ color = "coral", position = "tr" }: { color?: "coral"|"amber"|"violet"|"emerald"; position?: "tl"|"tr"|"bl"|"br"|"center" }) {
  const colors: Record<string, string> = {
    coral: "rgba(245,148,92,0.15)",
    amber: "rgba(254,199,111,0.15)",
    violet: "rgba(139,92,246,0.12)",
    emerald: "rgba(16,185,129,0.12)",
  };
  const pos: Record<string, { cx: string; cy: string }> = {
    tl: { cx:"15%", cy:"15%" }, tr: { cx:"85%", cy:"15%" },
    bl: { cx:"15%", cy:"85%" }, br: { cx:"85%", cy:"85%" },
    center: { cx:"50%", cy:"50%" },
  };
  const p = pos[position];
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden preserveAspectRatio="xMidYMid slice">
      <radialGradient id={`glow-${color}-${position}`} cx={p.cx} cy={p.cy} r="50%" gradientUnits="objectBoundingBox">
        <stop offset="0%" stopColor={colors[color]}/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <rect width="100%" height="100%" fill={`url(#glow-${color}-${position})`}/>
    </svg>
  );
}

export function BgWatermark({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`} aria-hidden>
      <span className="font-display font-black text-[clamp(4rem,15vw,12rem)] leading-none opacity-[0.03] whitespace-nowrap tracking-tighter text-current">
        {text}
      </span>
    </div>
  );
}

export function BgTopography({ dark = false, opacity = 0.5 }: { dark?: boolean; opacity?: number }) {
  const stroke = dark ? "rgba(255,255,255,0.06)" : "rgba(40,27,19,0.06)";
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="topo-blur"><feGaussianBlur stdDeviation="0.5"/></filter>
      </defs>
      {[0,1,2,3,4,5,6,7].map(i => (
        <ellipse key={i} cx="50%" cy="50%" rx={`${20+i*12}%`} ry={`${10+i*8}%`}
          fill="none" stroke={stroke} strokeWidth="1" filter="url(#topo-blur)"
          style={{ opacity, transform: `rotate(${i*15}deg)`, transformOrigin:"center" }}/>
      ))}
    </svg>
  );
}

export function BgCornerAccent({ dark = false }: { dark?: boolean }) {
  const color = dark ? "rgba(245,148,92,0.12)" : "rgba(245,148,92,0.08)";
  return (
    <svg className="absolute top-0 right-0 w-48 h-48 pointer-events-none" aria-hidden viewBox="0 0 192 192">
      <path d="M192 0 L192 192 L0 0 Z" fill={color}/>
      <path d="M192 0 L192 100 L92 0 Z" fill={dark?"rgba(254,199,111,0.08)":"rgba(254,199,111,0.06)"}/>
    </svg>
  );
}
