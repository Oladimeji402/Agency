import { siteConfig } from "@/config/site";
import { DraftNote } from "@/components/ui/DraftNote";
import { PillarMarks } from "@/components/ui/PillarMarks";

export function Capabilities() {
  const { capabilities, pillars, shapes, draft } = siteConfig;

  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="surface-light bg-surface text-fg">
      <div className="shell py-24 lg:py-36">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-mono text-mute">01 — Capabilities</p>
            <h2 id="capabilities-title" className="t-h2 mt-5">
              {capabilities.title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="t-body text-mute">{capabilities.intro}</p>
            <div className="mt-5 flex flex-col items-start gap-3">
              <DraftNote>scope to be confirmed by the team</DraftNote>
              {draft && (
                <p className="t-mono text-mute">
                  <span aria-hidden="true">◦ </span>
                  {capabilities.legend}
                </p>
              )}
            </div>
          </div>
        </header>

        <div className="mt-16 lg:mt-24">
          {pillars.map((pillar) => (
            <article
              key={pillar.id}
              id={`pillar-${pillar.id}`}
              className="reveal grid scroll-mt-20 gap-8 border-t border-line py-10 last:border-b lg:grid-cols-12 lg:gap-8 lg:py-14"
            >
              <header className="lg:col-span-5">
                <p className="t-mono flex items-center gap-3 text-mute">
                  <span>{pillar.number}</span>
                  <span aria-hidden="true" className="h-px w-8 bg-line" />
                  <span>{pillar.part} of the sculpture</span>
                </p>
                <h3 className="t-h3 mt-5 max-w-md">{pillar.name}</h3>
                <p className="mt-5 max-w-sm text-[1.15rem] leading-snug tracking-[-0.01em]">{pillar.problem}</p>
              </header>

              <div className="lg:col-span-6 lg:col-start-7">
                <ul className="grid gap-x-8 sm:grid-cols-2" aria-label={`${pillar.name}: capabilities`}>
                  {pillar.capabilities.map((capability) => (
                    <li key={capability.label} className="flex items-baseline gap-2 border-b border-line py-3 text-[1rem] leading-snug first:border-t sm:nth-2:border-t">
                      <span>{capability.label}</span>
                      {draft && capability.confirm && (
                        <span className="t-mono shrink-0 text-mute" title="To be confirmed">
                          <span aria-hidden="true">◦</span>
                          <span className="sr-only">(to be confirmed)</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-mute">
                  <span className="t-mono mr-2 text-fg">Connects</span>
                  {pillar.connects}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* how pillars combine */}
        <div className="mt-24 grid gap-10 lg:mt-36 lg:grid-cols-12 lg:gap-8">
          <header className="lg:col-span-4">
            <p className="t-mono text-mute">Combinations</p>
            <h3 className="t-h3 mt-5">{shapes.title}</h3>
            <p className="mt-4 max-w-sm text-[1rem] leading-relaxed text-mute">{shapes.intro}</p>
          </header>

          <div className="lg:col-span-8">
            {/* column headers, desktop */}
            <div className="t-mono hidden grid-cols-[1fr_repeat(4,4.5rem)] gap-2 pb-3 text-mute lg:grid" aria-hidden="true">
              <span />
              {pillars.map((pillar) => (
                <span key={pillar.id} className="text-center">
                  {pillar.number}
                  <br />
                  {pillar.short.slice(0, 3)}
                </span>
              ))}
            </div>
            <ul>
              {shapes.items.map((shape) => (
                <li key={shape.title} className="reveal grid items-center gap-x-2 gap-y-3 border-t border-line py-6 last:border-b lg:grid-cols-[1fr_repeat(4,4.5rem)]">
                  <div>
                    <h4 className="text-[1.25rem] leading-tight font-medium tracking-[-0.02em]">{shape.title}</h4>
                    <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-mute">{shape.situation}</p>
                  </div>
                  {/* desktop matrix cells */}
                  {pillars.map((pillar) => {
                    const on = shape.pillars.includes(pillar.id);
                    return (
                      <span key={pillar.id} className="hidden justify-center lg:flex">
                        <span aria-hidden="true" className={`size-3.5 border border-fg ${on ? "bg-fg" : "opacity-25"}`} />
                        <span className="sr-only">
                          {pillar.name}: {on ? "involved" : "not involved"}
                        </span>
                      </span>
                    );
                  })}
                  {/* mobile: marks plus names */}
                  <p className="t-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-mute lg:hidden">
                    <PillarMarks active={shape.pillars} />
                    <span>{shape.pillars.map((id) => pillars.find((p) => p.id === id)!.short).join(" · ")}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
