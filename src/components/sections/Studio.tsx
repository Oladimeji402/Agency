import { siteConfig } from "@/config/site";
import { DraftNote } from "@/components/ui/DraftNote";

export function Studio() {
  const { studio } = siteConfig;

  return (
    <section id="studio" aria-labelledby="studio-title" className="surface-light bg-surface text-fg">
      <div className="shell grid gap-14 py-24 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <header className="lg:col-span-6">
          <p className="t-mono text-mute">04 — Studio</p>
          <h2 id="studio-title" className="sr-only">
            {studio.title}
          </h2>
          <p className="mt-5 text-[clamp(1.9rem,4.2vw,3.7rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance">
            {studio.statement}
          </p>
          <div className="mt-8">
            <DraftNote>studio description to be confirmed</DraftNote>
          </div>
        </header>

        <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-5 lg:col-start-8">
          {studio.principles.map((principle) => (
            <div key={principle.label} className="reveal border-t border-line py-6 sm:pb-12">
              <dt className="t-mono">{principle.label}</dt>
              <dd className="mt-4 text-[1rem] leading-relaxed text-mute">{principle.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
