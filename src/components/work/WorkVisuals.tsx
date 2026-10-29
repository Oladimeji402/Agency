import Image from "next/image";
import type { Project } from "@/config/site";

const mono = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace" } as const;

/** Real render from the Blender pipeline, framed like a technical drawing. */
function GimbalVisual() {
  return (
    <div className="relative size-full bg-obsidian">
      <div aria-hidden="true" className="grid-lines absolute inset-0 opacity-70" />
      <Image
        src="/images/instrument-poster.webp"
        alt="Render of the gimbal sculpture used in this page's hero: a bone outer ring holding nested graphite and steel rings around a lime-banded spindle."
        width={1200}
        height={1200}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="absolute inset-0 m-auto size-[92%] object-contain"
      />
      <p className="t-mono absolute bottom-3 left-4 text-mute">Blender · Cycles render</p>
      <p className="t-mono absolute right-4 bottom-3 text-mute">GLB · 238 KB</p>
    </div>
  );
}

/** Concept: a dashboard that leads with a decision. All values are synthetic. */
function SignalVisual() {
  const a = [30, 34, 33, 38, 36, 41, 44, 43, 48, 47, 52, 66];
  const b = [40, 39, 41, 40, 42, 41, 43, 42, 44, 43, 44, 45];
  const x = (i: number) => 8 + i * (84 / 11);
  const y = (v: number) => 98 - (v - 26) * 0.78;
  const path = (d: number[]) => d.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("");
  return (
    <svg viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" className="size-full" role="img" aria-label="Concept dashboard: a recommended-action panel above a line chart where one series diverges at the last data point.">
      <rect width="100" height="125" fill="#202327" />
      <rect x="6" y="6" width="88" height="34" fill="#f3f1ea" />
      <text x="11" y="15" fontSize="3" fill="#55574f" style={mono} letterSpacing=".3">WHAT CHANGED</text>
      <text x="11" y="25" fontSize="5.6" fill="#101113" fontWeight="600">Series A is pulling away</text>
      <text x="11" y="31" fontSize="3.4" fill="#55574f">from its baseline over 4 periods</text>
      <rect x="11" y="33.2" width="22" height="4" fill="#101113" />
      <text x="13" y="36.1" fontSize="2.6" fill="#b8f36b" style={mono}>OPEN TRIAGE →</text>

      <g stroke="#f3f1ea" strokeOpacity=".12" strokeWidth=".3">
        {[56, 68, 80, 92].map((v) => (
          <line key={v} x1="6" x2="94" y1={v} y2={v} />
        ))}
      </g>
      <path d={path(b)} fill="none" stroke="#9b9d98" strokeWidth=".7" />
      <path d={path(a)} fill="none" stroke="#f3f1ea" strokeWidth=".9" />
      <line x1={x(11)} x2={x(11)} y1="60" y2="98" stroke="#b8f36b" strokeWidth=".4" strokeDasharray="1 1" />
      <circle cx={x(11)} cy={y(66)} r="1.8" fill="#b8f36b" />
      <text x={x(11) - 3} y="62" fontSize="2.8" fill="#b8f36b" style={mono} textAnchor="end">CHANGE DETECTED</text>

      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${6 + i * 30} 104)`}>
          <rect width="28" height="14" fill="none" stroke="#f3f1ea" strokeOpacity=".25" strokeWidth=".3" />
          <path d={`M3 ${10 - i} L8 ${8 + i} L13 ${9 - i} L18 ${6 + i} L25 ${4 + i * 2}`} fill="none" stroke="#f3f1ea" strokeWidth=".5" />
        </g>
      ))}
      <text x="94" y="122" fontSize="2.8" fill="#9b9d98" style={mono} textAnchor="end">SYNTHETIC DATA</text>
    </svg>
  );
}

/** Concept: AI drafts and routes; a person approves; everything is logged. */
function FlowVisual() {
  const nodes = [
    { label: "Inbound request", tag: "email · form" },
    { label: "Classify and draft", tag: "model" },
    { label: "Human approval", tag: "required", accent: true },
    { label: "Send and file ticket", tag: "api" },
  ];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="size-full" role="img" aria-label="Concept workflow: inbound request, model classifies and drafts, a person approves, then the system sends and files a ticket. An audit log runs alongside every step.">
      <rect width="100" height="100" fill="#f3f1ea" />
      {nodes.map((n, i) => {
        const y = 8 + i * 22;
        return (
          <g key={n.label}>
            <rect x="12" y={y} width="56" height="14" fill={n.accent ? "#101113" : "none"} stroke="#101113" strokeWidth=".5" />
            {n.accent && <rect x="12" y={y} width="2.4" height="14" fill="#b8f36b" />}
            <text x="18" y={y + 6.2} fontSize="4" fontWeight="600" fill={n.accent ? "#f3f1ea" : "#101113"}>{n.label}</text>
            <text x="18" y={y + 11} fontSize="2.8" fill={n.accent ? "#b8f36b" : "#55574f"} style={mono}>{n.tag.toUpperCase()}</text>
            {i < nodes.length - 1 && (
              <g stroke="#101113" strokeWidth=".5">
                <line x1="40" y1={y + 14} x2="40" y2={y + 22} />
                <path d={`M38.4 ${y + 20} L40 ${y + 22} L41.6 ${y + 20}`} fill="none" />
              </g>
            )}
          </g>
        );
      })}
      <line x1="80" y1="8" x2="80" y2="82" stroke="#101113" strokeWidth=".4" strokeDasharray="1.2 1.4" />
      {nodes.map((_, i) => (
        <g key={i}>
          <line x1="68" y1={15 + i * 22} x2="80" y2={15 + i * 22} stroke="#101113" strokeWidth=".3" strokeDasharray="1 1" />
          <rect x="78.6" y={13.6 + i * 22} width="2.8" height="2.8" fill="#101113" />
        </g>
      ))}
      <text x="80" y="90" fontSize="3" fill="#101113" style={mono} textAnchor="middle">AUDIT LOG</text>
      <text x="12" y="96" fontSize="2.8" fill="#55574f" style={mono}>CONCEPT DIAGRAM</text>
    </svg>
  );
}

/** Concept: a role-by-resource matrix that makes over-broad access visible. */
function AccessVisual() {
  const roles = ["Admin", "Editor", "Analyst", "Support", "Contractor"];
  const resources = ["Billing", "Users", "Data", "Logs", "Deploy"];
  // 1 = granted, 2 = granted and outside the role baseline
  const grid = [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [2, 0, 1, 0, 2],
  ];
  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className="size-full" role="img" aria-label="Concept access matrix: five roles by five resources, with two permissions on the Contractor role highlighted as outside the role baseline.">
      <rect width="160" height="100" fill="#101113" />
      <g stroke="#f3f1ea" strokeOpacity=".08" strokeWidth=".3">
        {Array.from({ length: 15 }, (_, i) => (
          <line key={i} x1={10 + i * 10} x2={10 + i * 10} y1="0" y2="100" />
        ))}
      </g>
      {resources.map((r, c) => (
        <text key={r} x={64 + c * 16} y="20" fontSize="2.8" fill="#9b9d98" style={mono} textAnchor="middle">{r.toUpperCase()}</text>
      ))}
      {roles.map((role, rI) => (
        <g key={role}>
          <text x="14" y={34 + rI * 11} fontSize="3.6" fill="#f3f1ea" fontWeight="500">{role}</text>
          <line x1="14" x2="146" y1={38 + rI * 11} y2={38 + rI * 11} stroke="#f3f1ea" strokeOpacity=".14" strokeWidth=".3" />
          {grid[rI].map((v, cI) => (
            <g key={cI}>
              {v === 0 && <rect x={61.5 + cI * 16} y={31 + rI * 11 - 0.5} width="5" height="5" fill="none" stroke="#f3f1ea" strokeOpacity=".25" strokeWidth=".3" />}
              {v === 1 && <rect x={61.5 + cI * 16} y={30.5 + rI * 11} width="5" height="5" fill="#f3f1ea" />}
              {v === 2 && <rect x={60.5 + cI * 16} y={29.5 + rI * 11} width="7" height="7" fill="#b8f36b" stroke="#b8f36b" />}
            </g>
          ))}
        </g>
      ))}
      <rect x="12" y="78" width="136" height="0.3" fill="#b8f36b" opacity=".0" />
      <text x="14" y="90" fontSize="3" fill="#b8f36b" style={mono}>2 PERMISSIONS EXCEED THE ROLE BASELINE</text>
      <text x="146" y="90" fontSize="3" fill="#9b9d98" style={mono} textAnchor="end">CONCEPT · SYNTHETIC</text>
    </svg>
  );
}

export function WorkVisual({ kind }: { kind: Project["visual"] }) {
  switch (kind) {
    case "gimbal":
      return <GimbalVisual />;
    case "signal":
      return <SignalVisual />;
    case "flow":
      return <FlowVisual />;
    case "access":
      return <AccessVisual />;
  }
}
