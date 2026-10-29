"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "@/components/ui/icons";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "submitting" | "sent" | "failed" | "mail";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Enter your name.";
  if (!EMAIL.test(values.email.trim())) errors.email = "Enter a valid email address, like name@company.com.";
  if (values.message.trim().length < 20) errors.message = "Describe the project in at least 20 characters.";
  return errors;
}

const inputClass =
  "mt-2 block w-full border-0 border-b bg-transparent py-3 text-[1.1rem] text-fg placeholder:text-mute/70 focus:outline-none focus-visible:border-lime aria-[invalid=true]:border-[#ff8a7a]";

const noopSubscribe = () => () => {};

export function ContactForm() {
  const { contact, services } = siteConfig;
  // False on the server and until hydration: stops a native GET submit from putting the brief in the URL.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real visitors never see or fill this field.
    if (data.get("company")) return;

    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const projectType = String(data.get("projectType") ?? "");

    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      const invalid = form.elements.namedItem(firstInvalid);
      if (invalid instanceof HTMLElement) invalid.focus();
      return;
    }

    if (!contact.formEndpoint) {
      // No submission endpoint is configured: hand the brief to the visitor's email client.
      const subject = `Project inquiry from ${values.name.trim()}`;
      const body = `${values.message.trim()}\n\n—\n${values.name.trim()}\n${values.email.trim()}${projectType ? `\nProject type: ${projectType}` : ""}`;
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("mail");
      return;
    }

    setStatus("submitting");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(contact.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, projectType }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("failed");
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const describedBy = (field: Field) => (errors[field] ? `${field}-error` : undefined);

  return (
    <form ref={formRef} onSubmit={onSubmit} method="post" noValidate className="grid gap-8">
      <noscript>
        <p className="text-mute">
          This form needs JavaScript. Please email{" "}
          <a className="text-fg underline underline-offset-4" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>{" "}
          instead.
        </p>
      </noscript>
      <fieldset disabled={!hydrated} className="m-0 grid min-w-0 gap-8 border-0 p-0">
        <div>
          <label htmlFor="name" className="t-mono text-mute">
            Name
          </label>
          <input id="name" name="name" type="text" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={`${inputClass} border-line`} />
          {errors.name && (
            <p id="name-error" className="mt-2 text-[0.9rem] text-[#ff8a7a]">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="t-mono text-mute">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={`${inputClass} border-line`} />
          {errors.email && (
            <p id="email-error" className="mt-2 text-[0.9rem] text-[#ff8a7a]">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="projectType" className="t-mono text-mute">
            Project type <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <select id="projectType" name="projectType" defaultValue="" className={`${inputClass} border-line [&>option]:bg-obsidian`}>
            <option value="">Not sure yet</option>
            {services.map((service) => (
              <option key={service.id} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="t-mono text-mute">
            Project brief
          </label>
          <textarea id="message" name="message" rows={5} required aria-invalid={!!errors.message} aria-describedby={describedBy("message")} placeholder="What are you building, who is it for and when do you need it?" className={`${inputClass} resize-y border-line`} />
          {errors.message && (
            <p id="message-error" className="mt-2 text-[0.9rem] text-[#ff8a7a]">
              {errors.message}
            </p>
          )}
        </div>

        {/* honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Company
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="group inline-flex min-h-12 items-center gap-3 bg-lime px-6 text-[0.95rem] font-medium text-obsidian transition-colors hover:bg-bone disabled:cursor-wait disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : contact.formEndpoint ? "Send inquiry" : "Compose email"}
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </fieldset>

      <div role="status" aria-live="polite" className="min-h-6 text-[0.98rem]">
        {status === "sent" && <p className="text-lime">Thanks. Your inquiry was sent. We will reply to the address you provided.</p>}
        {status === "mail" && (
          <p className="text-mute">
            Your email app should open with the brief filled in. If it does not, write to{" "}
            <a className="text-fg underline underline-offset-4" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            .
          </p>
        )}
        {status === "failed" && (
          <p className="text-[#ff8a7a]">
            The inquiry could not be sent. Please try again, or email{" "}
            <a className="underline underline-offset-4" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>{" "}
            directly.
          </p>
        )}
      </div>
    </form>
  );
}
