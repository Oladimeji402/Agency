import type { ReactNode } from "react";
import { ArrowDown, ArrowRight } from "./icons";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "text";
  icon?: "right" | "down";
  external?: boolean;
  className?: string;
};

/**
 * Primary is the one lime control on a screen; text links stay quiet and underline on hover.
 */
export function ButtonLink({ href, children, variant = "primary", icon = "right", external, className = "" }: Props) {
  const Icon = icon === "down" ? ArrowDown : ArrowRight;
  const motion = icon === "down" ? "group-hover:translate-y-0.5" : "group-hover:translate-x-1";
  const base =
    "group inline-flex min-h-12 items-center gap-3 text-[0.95rem] font-medium tracking-[-0.01em] transition-colors duration-200";
  const styles =
    variant === "primary"
      ? "bg-lime px-6 text-obsidian hover:bg-bone focus-visible:outline-offset-4"
      : "text-fg underline decoration-line decoration-1 underline-offset-[0.35em] hover:decoration-fg";

  return (
    <a
      href={href}
      className={`${base} ${styles} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      <Icon className={`transition-transform duration-200 ${motion}`} />
    </a>
  );
}
