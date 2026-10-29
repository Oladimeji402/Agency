import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DraftNote } from "@/components/ui/DraftNote";
import { ProjectTile } from "@/components/work/ProjectTile";

export function Work() {
  const { work, projects } = siteConfig;
  const [wide, portrait, square] = projects;

  return (
    <section id="work" aria-labelledby="work-title" className="surface-dark bg-surface text-fg">
      <div className="shell py-24 lg:py-36">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-mono text-mute">02 — Work</p>
            <h2 id="work-title" className="t-h2 mt-5">
              {work.title}
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="t-body text-mute">{work.intro}</p>
            <div className="mt-5">
              <DraftNote>replace with real projects</DraftNote>
            </div>
          </div>
        </header>

        <div className="mt-16 grid gap-x-8 gap-y-16 lg:mt-24 lg:grid-cols-12">
          {wide && (
            <div className="reveal lg:col-span-8">
              <ProjectTile project={wide} index={0} />
            </div>
          )}
          {portrait && (
            <div className="reveal lg:col-span-4 lg:mt-40">
              <ProjectTile project={portrait} index={1} />
            </div>
          )}
          {square && (
            <div className="reveal lg:col-span-5 lg:col-start-2">
              <ProjectTile project={square} index={2} />
            </div>
          )}
          <aside className="reveal flex flex-col justify-end gap-8 border-t border-line pt-8 lg:col-span-5 lg:col-start-8 lg:mt-24">
            <p className="t-h3 max-w-sm">Have a system in mind that does not fit a template?</p>
            <ButtonLink href="#contact">Send a brief</ButtonLink>
          </aside>
        </div>
      </div>
    </section>
  );
}
