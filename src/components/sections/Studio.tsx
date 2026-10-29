import { siteConfig } from "@/config/site";
import { DraftNote } from "@/components/ui/DraftNote";

const mono = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace" } as const;

/** Key that maps the hero sculpture to the four pillars. */
function SculptureKey() {
  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[22rem]" role="img" aria-label="Diagram of the sculpture: an outer ring for security and reliability, a vertical ring for product engineering, a horizontal ring for experience, and a core for data, AI and automation.">
      <g fill="none" stroke="#101113" strokeWidth="1.2">
        <circle cx="110" cy="110" r="92" />
        <ellipse cx="110" cy="110" rx="34" ry="72" />
        <ellipse cx="110" cy="110" rx="56" ry="20" transform="rotate(-18 110 110)" />
      </g>
      <rect x="96" y="98" width="28" height="24" fill="#b8f36b" stroke="#101113" strokeWidth="1.2" />
      <g stroke="#101113" strokeWidth=".7" fill="#101113" fontSize="8.4" style={mono}>
        <line x1="18" y1="110" x2="4" y2="110" />
        <text x="2" y="104" stroke="#f3f1ea" strokeWidth="3" paintOrder="stroke">04 SECURITY</text>
        <line x1="142" y1="52" x2="196" y2="30" />
        <text x="198" y="26" stroke="#f3f1ea" strokeWidth="3" paintOrder="stroke" textAnchor="end" dx="-2" dy="-4">01 ENGINEERING</text>
        <line x1="166" y1="124" x2="204" y2="140" />
        <text x="218" y="154" stroke="#f3f1ea" strokeWidth="3" paintOrder="stroke" textAnchor="end">02 EXPERIENCE</text>
        <line x1="124" y1="122" x2="150" y2="196" />
        <text x="150" y="208" stroke="#f3f1ea" strokeWidth="3" paintOrder="stroke" textAnchor="middle">03 INTELLIGENCE</text>
      </g>
    </svg>
  );
}

export function Studio() {
  const { studio } = siteConfig;

  return (
    <section id="studio" aria-labelledby="studio-title" className="surface-light bg-surface text-fg">
      <div className="shell py-24 lg:py-36">
        <header>
          <p className="t-mono text-mute">04 — Studio approach</p>
          <h2 id="studio-title" className="mt-5 max-w-5xl text-[clamp(2rem,5vw,4.4rem)] leading-[1] font-medium tracking-[-0.04em] text-balance">
            {studio.statement}
          </h2>
          <div className="mt-8">
            <DraftNote>point of view proposed for the team to confirm</DraftNote>
          </div>
        </header>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <p className="t-mono mb-6 text-mute">Reading the sculpture</p>
            <SculptureKey />
            <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-mute">
              The hero object is the studio model: security wraps the product, engineering and experience pivot around each other, and data and AI sit at the core.
            </p>
          </div>

          <ol className="lg:col-span-7 lg:col-start-6">
            {studio.beliefs.map((belief) => (
              <li key={belief.number} className="reveal grid gap-4 border-t border-line py-8 last:border-b sm:grid-cols-[5rem_1fr] lg:py-10">
                <span className="text-[clamp(2.5rem,4vw,3.5rem)] leading-none font-medium tracking-[-0.05em]">{belief.number}</span>
                <div>
                  <h3 className="t-h3 max-w-lg">{belief.title}</h3>
                  <p className="mt-4 max-w-lg text-[1.02rem] leading-relaxed text-mute">{belief.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
