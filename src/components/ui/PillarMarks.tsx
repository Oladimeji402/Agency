import { pillarById, siteConfig, type Part } from "@/config/site";

/**
 * Four fixed positions, one per pillar. Filled squares show which pillars carry the work.
 * Always paired with a text label, so meaning never depends on the marks alone.
 */
export function PillarMarks({ active, label }: { active: Part[]; label?: string }) {
  const names = active.map((id) => pillarById(id).short).join(", ");
  return (
    <span className="inline-flex items-center gap-2" role="img" aria-label={label ?? `Pillars involved: ${names}`}>
      {siteConfig.pillars.map((pillar) => {
        const on = active.includes(pillar.id);
        return (
          <span
            key={pillar.id}
            aria-hidden="true"
            className={`size-2.5 border border-current ${on ? "bg-current" : "opacity-40"}`}
          />
        );
      })}
    </span>
  );
}
