import Image from "next/image";
import { type Project } from "@/config/site";
import { ArrowUpRight } from "@/components/ui/icons";
import { PillarMarks } from "@/components/ui/PillarMarks";
import { WorkVisual } from "./WorkVisuals";

const ratio: Record<Project["shape"], string> = {
  wide: "aspect-[16/10]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
};

function KindChip({ kind }: { kind: Project["kind"] }) {
  const built = kind === "built";
  return (
    <p className={`t-mono inline-flex items-center gap-2 border px-2.5 py-1 ${built ? "border-lime text-lime" : "border-line text-mute"}`}>
      <span aria-hidden="true" className={`size-1.5 ${built ? "bg-lime" : "border border-current"}`} />
      {built ? "Built · studio experiment" : "Concept · not a client project"}
    </p>
  );
}

function Tags({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((item) => (
        <li key={item} className="t-mono border border-line px-2.5 py-1.5">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Compact tile used for the concepts. */
export function ConceptCard({ project, index }: { project: Project; index: number }) {
  const body = (
    <>
      <div className={`relative overflow-hidden bg-graphite ${ratio[project.shape]}`}>
        {project.image ? (
          <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(min-width: 1024px) 50vw, 100vw" className="size-full object-cover" />
        ) : (
          <WorkVisual kind={project.visual} />
        )}
      </div>
      <div className="mt-5 grid grid-cols-[2.5rem_1fr] gap-x-4">
        <span className="t-mono pt-1.5 text-mute">{String(index).padStart(2, "0")}</span>
        <div>
          <KindChip kind={project.kind} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <h3 className="t-h3">{project.title}</h3>
            {project.href && <ArrowUpRight className="mt-1.5 shrink-0" />}
          </div>
          <p className="t-mono mt-2 flex items-center gap-3 text-mute">
            <PillarMarks active={project.pillars} />
            {project.discipline}
          </p>
          <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-mute">{project.summary}</p>
          <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed">
            <span className="t-mono mr-2 text-mute">Shows</span>
            {project.demonstrates}
          </p>
          <div className="mt-4">
            <Tags items={project.stack} label="Illustrative technology" />
          </div>
        </div>
      </div>
    </>
  );
  return project.href ? (
    <a href={project.href} className="group block">
      {body}
    </a>
  ) : (
    <article>{body}</article>
  );
}

/** Large split layout used for the real, built piece. */
export function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="grid gap-8 lg:grid-cols-12 lg:gap-0">
      <div className="relative aspect-square overflow-hidden bg-obsidian sm:aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[34rem]">
        <WorkVisual kind={project.visual} />
      </div>
      <div className="flex flex-col justify-between gap-8 border-line bg-graphite p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <div>
          <KindChip kind={project.kind} />
          <h3 className="t-h3 mt-6">{project.title}</h3>
          <p className="t-mono mt-3 flex items-center gap-3 text-mute">
            <PillarMarks active={project.pillars} />
            {project.discipline}
          </p>
          <p className="mt-6 text-[1rem] leading-relaxed text-mute">{project.summary}</p>
          <p className="mt-4 text-[1rem] leading-relaxed">
            <span className="t-mono mr-2 text-mute">Shows</span>
            {project.demonstrates}
          </p>
        </div>
        <div>
          {project.facts && (
            <dl className="border-t border-line">
              {project.facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                  <dt className="t-mono text-mute">{fact.label}</dt>
                  <dd className="text-right text-[0.95rem]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-5">
            <Tags items={project.stack} label="Technology used" />
          </div>
        </div>
      </div>
    </article>
  );
}

