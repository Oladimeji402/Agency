"use client";

import { siteConfig, type Part } from "@/config/site";

export const HIGHLIGHT_EVENT = "instrument:highlight";

const announce = (part: Part | null) =>
  window.dispatchEvent(new CustomEvent<Part | null>(HIGHLIGHT_EVENT, { detail: part }));

/**
 * The four pillars as an index under the hero. Hovering or focusing one lights the matching
 * part of the sculpture (when the 3D scene is running); each is a plain link to its section.
 */
export function PillarRail() {
  return (
    <nav aria-label="Service pillars" className="anim-fade border-t border-line" style={{ "--i": 6 } as React.CSSProperties}>
      <ul className="grid grid-cols-2 lg:grid-cols-4">
        {siteConfig.pillars.map((pillar) => (
          <li key={pillar.id} className="border-line not-lg:odd:border-r lg:border-r lg:last:border-r-0">
            <a
              href={`#pillar-${pillar.id}`}
              onPointerEnter={() => announce(pillar.id)}
              onPointerLeave={() => announce(null)}
              onFocus={() => announce(pillar.id)}
              onBlur={() => announce(null)}
              className="group flex min-h-24 flex-col justify-between gap-3 px-4 py-4 transition-colors first:pl-0 hover:bg-fg/5 focus-visible:bg-fg/5 sm:px-5 lg:py-5 not-lg:odd:pl-0"
            >
              <span className="t-mono flex items-center justify-between text-mute">
                <span>{pillar.number}</span>
                <span className="hidden sm:inline">{pillar.part}</span>
              </span>
              <span className="text-[0.98rem] leading-tight font-medium tracking-[-0.01em] sm:text-[1.1rem]">
                <span className="mr-2 inline-block size-1.5 bg-lime align-middle opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />
                {pillar.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
