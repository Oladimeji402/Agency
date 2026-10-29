import { siteConfig, whatsappHref } from "@/config/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { DraftNote } from "@/components/ui/DraftNote";
import { ArrowUpRight } from "@/components/ui/icons";

export function Contact() {
  const { contact } = siteConfig;

  return (
    <section id="contact" aria-labelledby="contact-title" className="surface-dark bg-surface text-fg">
      <div className="shell grid gap-16 py-24 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-6">
          <p className="t-mono text-mute">05 — Contact</p>
          <h2 id="contact-title" className="t-h2 mt-5 text-balance">
            {contact.title}
          </h2>
          <p className="t-body mt-6 text-mute">{contact.intro}</p>

          <ul className="mt-10 space-y-2 border-t border-line pt-6">
            <li>
              <a href={`mailto:${contact.email}`} className="group inline-flex min-h-12 items-center gap-3 text-[clamp(1.25rem,2.6vw,1.9rem)] tracking-[-0.02em] break-all">
                <span className="underline decoration-line underline-offset-[0.3em] group-hover:decoration-lime">{contact.email}</span>
                <ArrowUpRight className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </li>
            {whatsappHref && (
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-12 items-center gap-3 text-[1.1rem]">
                  <span className="underline decoration-line underline-offset-[0.3em] group-hover:decoration-lime">Message on WhatsApp</span>
                  <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            )}
          </ul>
          <div className="mt-6">
            <DraftNote>contact details are placeholders</DraftNote>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
