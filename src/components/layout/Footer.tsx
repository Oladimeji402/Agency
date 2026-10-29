import { siteConfig, whatsappHref } from "@/config/site";
import { Brandmark } from "@/components/ui/icons";

export function Footer() {
  const { agency, navigation, contact, socials } = siteConfig;
  const profiles = socials.filter((s) => s.href);

  return (
    <footer className="surface-dark border-t border-line bg-surface text-fg">
      <div className="shell grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <p className="flex items-center gap-3 text-[0.95rem] font-semibold tracking-[0.08em]">
            <Brandmark />
            {agency.wordmark}
          </p>
          <p className="t-body mt-5 max-w-sm text-mute">{agency.description}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3 md:col-start-6">
          <p className="t-mono text-mute">Index</p>
          <ul className="mt-4 space-y-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="inline-flex min-h-11 items-center hover:text-lime">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="t-mono text-mute">Contact</p>
          <ul className="mt-4 space-y-1">
            <li>
              <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center break-all hover:text-lime">
                {contact.email}
              </a>
            </li>
            {whatsappHref && (
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-lime">
                  WhatsApp
                </a>
              </li>
            )}
            {profiles.map((profile) => (
              <li key={profile.label}>
                <a href={profile.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-lime">
                  {profile.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell t-mono flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 text-mute">
          <p>
            © {agency.copyrightYear} {agency.legalName}. All rights reserved.
          </p>
          <a href="#top" className="inline-flex min-h-11 items-center hover:text-fg">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
