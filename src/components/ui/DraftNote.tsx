import { siteConfig } from "@/config/site";

/** Marks content that still needs the agency's confirmation. Hidden when `draft` is false in the config. */
export function DraftNote({ children }: { children: string }) {
  if (!siteConfig.draft) return null;
  return (
    <p className="t-mono inline-flex items-center gap-2 border border-line px-2.5 py-1 text-mute">
      <span aria-hidden="true" className="size-1.5 bg-current" />
      <span>Draft — {children}</span>
    </p>
  );
}
