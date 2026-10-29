import { siteConfig } from "@/config/site";

export function Process() {
  const { process, steps } = siteConfig;

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
          <p className="t-body text-mute lg:col-span-4 lg:col-start-9">{process.intro}</p>
        </header>

        <ol className="mt-16 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="reveal relative flex flex-col border-t border-line pt-6 pb-12 sm:pr-4">
              <span aria-hidden="true" className="absolute -top-[3px] left-0 size-1.5 bg-fg" />
              <p className="text-[clamp(3.5rem,7vw,6rem)] leading-none font-medium tracking-[-0.06em] text-fg/90 tabular-nums">
                {step.number}
              </p>
              <h3 className="t-h3 mt-8">{step.title}</h3>
              <p className="mt-4 mb-8 text-[1rem] leading-relaxed text-mute">{step.description}</p>
              <p className="t-mono mt-auto border-t border-line pt-4 text-mute">
                <span className="text-fg">Output</span>
                <br />
                {step.output}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
