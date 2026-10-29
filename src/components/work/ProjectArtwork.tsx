import type { Project } from "@/config/site";

/**
 * Generic technical drawings used until real project imagery is supplied.
 * They are decorative placeholders and carry no project information.
 */
export function ProjectArtwork({ kind }: { kind: Project["artwork"] }) {
  if (kind === "grid") {
    return (
      <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden="true" fill="none">
        <rect width="160" height="100" fill="#202327" />
        <g stroke="#f3f1ea" strokeOpacity="0.1" strokeWidth="0.3">
          {Array.from({ length: 15 }, (_, i) => (
            <line key={`v${i}`} x1={10 + i * 10} y1="0" x2={10 + i * 10} y2="100" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={10 + i * 10} x2="160" y2={10 + i * 10} />
          ))}
        </g>
        <rect x="30" y="20" width="60" height="40" fill="#f3f1ea" />
        <g stroke="#101113" strokeWidth="0.4">
          <line x1="30" y1="40" x2="90" y2="40" />
          <line x1="60" y1="20" x2="60" y2="60" />
          <rect x="36" y="26" width="18" height="8" />
          <rect x="66" y="46" width="18" height="8" />
        </g>
        <circle cx="116" cy="46" r="24" stroke="#f3f1ea" strokeWidth="0.5" strokeDasharray="1.4 1.8" />
        <circle cx="116" cy="46" r="12" stroke="#f3f1ea" strokeWidth="0.5" />
        <rect x="112" y="42" width="8" height="8" fill="#b8f36b" />
        <g stroke="#f3f1ea" strokeWidth="0.5">
          <path d="M20 80h14M27 73v14" />
          <path d="M126 80h14M133 73v14" />
        </g>
      </svg>
    );
  }

  if (kind === "arcs") {
    return (
      <svg viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden="true" fill="none">
        <rect width="100" height="125" fill="#101113" />
        <g stroke="#f3f1ea" strokeWidth="0.5">
          {[14, 26, 38, 50, 62, 74].map((r) => (
            <path key={r} d={`M${-4} ${100 - r}A${r} ${r} 0 0 1 ${r - 4} 100`} strokeOpacity={r === 50 ? 1 : 0.35} />
          ))}
          <path d="M-4 100H104" strokeOpacity="0.5" />
          <path d="M50 20V100" strokeOpacity="0.2" strokeDasharray="1.4 1.8" />
        </g>
        <g stroke="#f3f1ea" strokeWidth="0.4">
          {Array.from({ length: 19 }, (_, i) => {
            const a = (Math.PI / 2) * (i / 18);
            const r1 = 82;
            const r2 = i % 3 === 0 ? 88 : 85;
            return <line key={i} x1={-4 + Math.sin(a) * r1} y1={100 - Math.cos(a) * r1} x2={-4 + Math.sin(a) * r2} y2={100 - Math.cos(a) * r2} />;
          })}
        </g>
        <rect x="58" y="42" width="30" height="40" fill="#f3f1ea" />
        <rect x="63" y="47" width="20" height="3" fill="#101113" />
        <rect x="63" y="53" width="12" height="3" fill="#101113" fillOpacity="0.5" />
        <rect x="63" y="72" width="20" height="5" fill="#b8f36b" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden="true" fill="none">
      <rect width="100" height="100" fill="#f3f1ea" />
      <g stroke="#101113" strokeWidth="0.4" strokeLinejoin="round">
        <path d="M50 14L82 32V68L50 86L18 68V32Z" fill="#e4e1d7" />
        <path d="M18 32L50 50L82 32M50 50V86" />
        <path d="M34 41L66 23" strokeOpacity="0.4" />
        <path d="M34 59L66 41" strokeOpacity="0.4" />
        <path d="M34 41V59M66 23V41" strokeOpacity="0.4" />
        <path d="M50 50L82 32V68L50 86Z" fill="#101113" />
        <path d="M50 50L18 32V68L50 86Z" fill="#202327" />
        <path d="M18 32L50 14L82 32L50 50Z" fill="#f3f1ea" />
      </g>
      <path d="M44 31L56 38L50 42L38 35Z" fill="#b8f36b" stroke="#101113" strokeWidth="0.4" />
      <g stroke="#101113" strokeWidth="0.4">
        <path d="M8 92H24M8 92V76" />
        <path d="M92 8H76M92 8V24" />
      </g>
    </svg>
  );
}
