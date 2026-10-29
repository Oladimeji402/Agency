import Image from "next/image";
import { siteConfig, type Project } from "@/config/site";
import { ArrowUpRight } from "@/components/ui/icons";
import { ProjectArtwork } from "./ProjectArtwork";

const ratio: Record<Project["shape"], string> = {
  wide: "aspect-[16/10]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
};

export function ProjectTile({ project, index }: { project: Project; index: number }) {
  const body = (
    <>
      <div className={`relative overflow-hidden bg-graphite ${ratio[project.shape]}`}>
        <div className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="size-full object-cover"
            />
          ) : (
            <ProjectArtwork kind={project.artwork} />
          )}
        </div>
        {siteConfig.draft && !project.image && (
          <p className="t-mono absolute top-3 left-3 bg-obsidian px-2 py-1 text-bone">Placeholder artwork</p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-[2.5rem_1fr] gap-x-4">
        <span className="t-mono pt-1.5 text-mute">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="t-h3">{project.title}</h3>
            {project.href && <ArrowUpRight className="mt-1.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
          </div>
          <p className="t-mono mt-2 text-mute">{project.discipline}</p>
          <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-mute">{project.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies and disciplines">
            {project.tags.map((tag) => (
              <li key={tag} className="t-mono border border-line px-2.5 py-1.5">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );

  return project.href ? (
    <a href={project.href} className="group block">
      {body}
    </a>
  ) : (
    <article className="group">{body}</article>
  );
}
