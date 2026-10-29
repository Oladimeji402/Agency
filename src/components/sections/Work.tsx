import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DraftNote } from "@/components/ui/DraftNote";
import { ConceptCard, FeaturedProject } from "@/components/work/ProjectCard";

export function Work() {
  const { work, projects } = siteConfig;
  const featured = projects.find((p) => p.kind === "built");
  const concepts = projects.filter((p) => p.kind === "concept");
  const [signal, flow, access] = [
    concepts.find((p) => p.visual === "signal"),
    concepts.find((p) => p.visual === "flow"),
    concepts.find((p) => p.visual === "access"),
  ];

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
              <DraftNote>replace concepts with real case studies as they exist</DraftNote>
            </div>
          </div>
        </header>

        {featured && (
          <div className="reveal mt-16 lg:mt-24">
            <FeaturedProject project={featured} />
          </div>
        )}

        <div className="mt-20 grid gap-x-8 gap-y-16 lg:mt-28 lg:grid-cols-12">
          {signal && (
            <div className="reveal lg:col-span-5">
              <ConceptCard project={signal} index={2} />
            </div>
          )}
          <div className="flex flex-col gap-16 lg:col-span-6 lg:col-start-7 lg:mt-24">
            {access && (
              <div className="reveal">
                <ConceptCard project={access} index={3} />
              </div>
            )}
            {flow && (
              <div className="reveal lg:ml-auto lg:w-[82%]">
                <ConceptCard project={flow} index={4} />
              </div>
            )}
          </div>
        </div>

        <aside className="reveal mt-20 grid gap-6 border-t border-line pt-8 lg:mt-28 lg:grid-cols-12 lg:items-end">
          <p className="t-h3 max-w-xl lg:col-span-7">Have a system in mind that does not fit a template?</p>
          <div className="lg:col-span-4 lg:col-start-9">
            <ButtonLink href="#contact">Send a brief</ButtonLink>
          </div>
        </aside>
      </div>
    </section>
  );
}
