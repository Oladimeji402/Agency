type IconProps = { className?: string };

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={className}>
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={className}>
      <path d="M8 2v11M4 9l4 4 4-4" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={className}>
      <path d="M4 12L12 4M5.5 4H12v6.5" />
    </svg>
  );
}

/** Armillary glyph that echoes the hero sculpture; the lime dot is the core. */
export function Brandmark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10.2" />
      <ellipse cx="12" cy="12" rx="4.2" ry="10.2" />
      <ellipse cx="12" cy="12" rx="10.2" ry="4.2" />
      <circle cx="12" cy="12" r="1.7" fill="#b8f36b" stroke="none" />
    </svg>
  );
}
