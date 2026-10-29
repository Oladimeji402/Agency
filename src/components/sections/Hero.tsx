import type { CSSProperties } from "react";
import { siteConfig } from "@/config/site";
import { HeroFigure } from "@/components/hero/HeroFigure";
import { PillarRail } from "@/components/hero/PillarRail";
import { ButtonLink } from "@/components/ui/ButtonLink";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export function Hero() {
  const { hero } = siteConfig;
  const lastLine = hero.headline.length - 1;

  return (
    <section id="top" aria-labelledby="hero-title" className="surface-dark relative isolate overflow-hidden bg-surface">
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10" />

      <div className="shell relative flex min-h-[calc(100svh-4rem)] flex-col pt-6 lg:pt-8">
        <p className="t-mono anim-fade flex items-center gap-3 text-mute" style={step(0)}>
          <span aria-hidden="true" className="size-2 bg-lime" />
          {hero.label}
        </p>

        <div className="relative flex flex-1 flex-col lg:justify-end lg:pb-12">
          {/* sculpture: in flow on small screens, anchored right on large ones */}
          <div className="relative left-1/2 mt-2 w-[min(122%,42rem)] -translate-x-1/2 lg:absolute lg:top-1/2 lg:right-[-1vw] lg:left-auto lg:mt-0 lg:w-[min(48vw,calc(100svh-15rem))] lg:-translate-y-1/2 lg:translate-x-0">
            <HeroFigure />
          </div>

          <div className="relative z-10 mt-2 pb-8 lg:mt-0 lg:pb-0">
            <h1 id="hero-title" className="t-hero">
              {hero.headline.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.05em]">
                  <span className="anim-line" style={step(i)}>
                    {line}
                    {i === lastLine && <span className="text-lime">.</span>}
                  </span>
                </span>
              ))}
            </h1>

            <div className="anim-fade mt-6 max-w-[33rem] lg:mt-8" style={step(4)}>
              <p className="t-body text-fg/85">{hero.description}</p>
              <p className="t-mono mt-4 text-mute">{hero.audience}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
                <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
                <ButtonLink href={hero.secondaryCta.href} variant="text" icon="down">
                  {hero.secondaryCta.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        <PillarRail />
      </div>
    </section>
  );
}
