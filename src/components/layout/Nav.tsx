"use client";

import { useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { Brandmark } from "@/components/ui/icons";

export function Nav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();

  return (
    <header className="surface-dark sticky top-0 z-50 border-b border-line bg-surface">
      <nav aria-label="Primary" className="shell flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-3 text-fg" aria-label={`${siteConfig.agency.name}, back to top`}>
          <Brandmark />
          <span className="text-[0.95rem] font-semibold tracking-[0.08em]">{siteConfig.agency.wordmark}</span>
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {siteConfig.navigation
            .filter((item) => item.href !== "#contact")
            .map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="t-mono relative py-2 text-mute transition-colors hover:text-fg after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-lime after:transition-transform hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          <li>
            <a
              href="#contact"
              className="t-mono inline-flex min-h-10 items-center border border-fg/40 px-4 text-fg transition-colors hover:border-lime hover:bg-lime hover:text-obsidian"
            >
              Contact
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={openMenu}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="t-mono -mr-2 inline-flex min-h-12 min-w-12 items-center justify-center gap-2 px-2 text-fg lg:hidden"
        >
          Menu
          <span aria-hidden="true" className="flex w-5 flex-col gap-1">
            <span className="h-px bg-current" />
            <span className="h-px bg-current" />
          </span>
        </button>
      </nav>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Site menu"
        onClose={() => setOpen(false)}
        className="surface-dark m-0 h-dvh max-h-none w-dvw max-w-none bg-surface p-0 text-fg backdrop:bg-transparent"
      >
        <div className="shell flex h-full flex-col pb-8">
          <div className="flex h-16 items-center justify-between">
            <span className="flex items-center gap-3">
              <Brandmark />
              <span className="text-[0.95rem] font-semibold tracking-[0.08em]">{siteConfig.agency.wordmark}</span>
            </span>
            <button
              type="button"
              onClick={closeMenu}
              className="t-mono -mr-2 inline-flex min-h-12 min-w-12 items-center justify-center px-2"
            >
              Close
            </button>
          </div>
          <ul className="mt-8 flex flex-1 flex-col">
            {siteConfig.navigation.map((item, i) => (
              <li key={item.href} className="border-t border-line last:border-b">
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className="flex min-h-16 items-baseline gap-4 py-4 text-[clamp(1.8rem,8vw,2.6rem)] font-medium tracking-[-0.03em]"
                >
                  <span className="t-mono w-6 text-mute">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${siteConfig.contact.email}`} className="t-mono mt-8 text-mute">
            {siteConfig.contact.email}
          </a>
        </div>
      </dialog>
    </header>
  );
}
