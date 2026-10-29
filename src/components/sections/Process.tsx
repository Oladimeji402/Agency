import { pillarById, siteConfig } from "@/config/site";
import { DraftNote } from "@/components/ui/DraftNote";
import { PillarMarks } from "@/components/ui/PillarMarks";

export function Process() {
  const { process, steps, agreements } = siteConfig;

  return (
    <section id="process" aria-labelledby="process-title" className="surface-graphite bg-surface text-fg">
      <div className="shell py-24 lg:py-36">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-mono text-mute">03 — Process</p>
            <h2 id="process-title" className="t-h2 mt-5">
              {process.title}
            </h2>
          </div>
          <p className="t-body text-mute lg:col-span-5 lg:col-start-8">{process.intro}</p>
        </header>

        <ol className="mt-16 grid gap-x-8 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="reveal relative flex flex-col border-t border-line pt-6 pb-12 sm:pr-4">
              <span aria-hidden="true" className="absolute -top-[3px] left-0 size-1.5 bg-fg" />
              <p className="text-[clamp(3.5rem,7vw,6rem)] leading-none font-medium tracking-[-0.06em] text-fg/90 tabular-nums">{step.number}</p>
              <h3 className="t-h3 mt-8">{step.title}</h3>
              <p className="mt-4 mb-8 text-[1rem] leading-relaxed text-mute">{step.description}</p>

              <div className="mt-auto border-t border-line pt-4">
                <p className="t-mono flex items-center gap-3 text-mute">
                  <PillarMarks active={step.pillars} />
                  <span className="sr-only">Pillars involved: {step.pillars.map((id) => pillarById(id).name).join(", ")}.</span>
                </p>
                <p className="t-mono mt-3 text-mute" aria-hidden="true">
                  {step.pillars.map((id) => pillarById(id).short).join(" · ")}
                </p>
                <p className="t-mono mt-5 text-mute">
                  <span className="text-fg">Output</span>
                  <br />
                  {step.output}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-6 border-t border-line pt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="t-mono text-mute">Collaboration</p>
            <h3 className="t-h3 mt-4">{agreements.title}</h3>
            <div className="mt-5">
              <DraftNote>agreements to be confirmed</DraftNote>
            </div>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {agreements.items.map((item, i) => (
              <li key={item} className="flex gap-4 border-b border-line py-4 text-[1rem] leading-snug first:border-t sm:nth-2:border-t">
                <span className="t-mono pt-0.5 text-mute">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
