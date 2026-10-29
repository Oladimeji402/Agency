/**
 * Single source of truth for everything the agency needs to decide or supply.
 * Replace the values below, then set `draft` to false to hide the "draft" and
 * "to confirm" markers shown beside unconfirmed content.
 *
 * Nothing here is a confirmed fact about the agency. See REVIEW.md for the list of
 * decisions the team still has to make.
 */

/** The four 3D parts of the sculpture, in the same order as the pillars. */
export type Part = "security" | "engineering" | "experience" | "intelligence";

export type Capability = {
  label: string;
  /** True when the team has not yet confirmed it can deliver this. Shown with a marker while `draft` is on. */
  confirm?: boolean;
};

export type Pillar = {
  id: Part;
  number: string;
  name: string;
  /** Two-word label for the hero rail and diagrams. */
  short: string;
  /** Which sculpture part this pillar maps to. */
  part: string;
  /** The business problem this pillar answers, in one sentence. */
  problem: string;
  capabilities: Capability[];
  /** How this pillar depends on or feeds the others. */
  connects: string;
};

export type Shape = {
  title: string;
  situation: string;
  pillars: Part[];
};

export type Step = {
  number: string;
  title: string;
  description: string;
  output: string;
  /** Pillars that are actively involved in this stage. */
  pillars: Part[];
};

export type Project = {
  id: string;
  kind: "built" | "concept";
  title: string;
  discipline: string;
  summary: string;
  /** What the piece is meant to demonstrate. */
  demonstrates: string;
  /** Facts that were actually measured or counted. Only for kind "built". */
  facts?: { label: string; value: string }[];
  /** Illustrative technology, never a claim about a delivered stack. */
  stack: string[];
  pillars: Part[];
  /** Visual shown in the tile. */
  visual: "gimbal" | "signal" | "flow" | "access";
  shape: "wide" | "portrait" | "square";
  /** Optional real project image, stored in /public. */
  image?: { src: string; alt: string; width: number; height: number };
  /** Optional case-study or live URL. Leave undefined to render no link. */
  href?: string;
};

export type Belief = { number: string; title: string; text: string };

export const siteConfig = {
  /** Set to false once all content below has been confirmed by the agency. */
  draft: true,

  agency: {
    /** Provisional brand name. Replace with the real agency name. */
    name: "Agency Name",
    wordmark: "AGENCY NAME",
    legalName: "Agency Name",
    copyrightYear: 2026,
    description:
      "A software studio combining product engineering, experience design, data and AI, and security under one team.",
  },

  hero: {
    label: "Software and creative technology studio",
    /** One entry per line; the last line receives the accent full stop. */
    headline: ["Engineering,", "design and", "intelligence"],
    description:
      "One team for the product, the interface, the data behind it and the security around it. We build web and mobile software from first prototype to production.",
    /** Assumed audience, to be confirmed. */
    audience: "For startups, scale-ups and established teams building or modernising software.",
    primaryCta: { label: "Start a project", href: "#contact" },
    secondaryCta: { label: "See capabilities", href: "#capabilities" },
  },

  navigation: [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Studio", href: "#studio" },
    { label: "Contact", href: "#contact" },
  ],

  capabilities: {
    title: "Four pillars, one build.",
    intro:
      "Most products need more than code. These four areas are organised so they can be bought together, which is how they work best, or separately.",
    legend: "Marked items are potential capabilities the team has not yet confirmed.",
  },

  pillars: [
    {
      id: "engineering",
      number: "01",
      name: "Product engineering",
      short: "Engineering",
      part: "Middle ring",
      problem: "You need software that works, scales and can be changed by the next developer.",
      capabilities: [
        { label: "Web applications and SaaS" },
        { label: "Mobile applications (iOS and Android)" },
        { label: "Custom business software" },
        { label: "APIs and system integrations" },
        { label: "Database architecture" },
        { label: "Cloud infrastructure" },
        { label: "DevOps, testing and deployment" },
      ],
      connects: "Builds what Experience designs, runs on what Security hardens, and feeds the data Intelligence uses.",
    },
    {
      id: "experience",
      number: "02",
      name: "Experience and creative technology",
      short: "Experience",
      part: "Inner ring",
      problem: "The product has to be understood in seconds and feel considered in use.",
      capabilities: [
        { label: "UI and UX design" },
        { label: "Product design and prototyping" },
        { label: "Design systems" },
        { label: "Motion design and animation" },
        { label: "3D and interactive experiences" },
        { label: "Creative development and digital storytelling" },
        { label: "Brand and interface design", confirm: true },
      ],
      connects: "Prototypes in code, so design decisions are tested against real engineering constraints early.",
    },
    {
      id: "intelligence",
      number: "03",
      name: "Data, AI and automation",
      short: "Intelligence",
      part: "Core",
      problem: "Your team repeats manual work, or has data nobody can read or act on.",
      capabilities: [
        { label: "Data analysis and visualisation" },
        { label: "Business intelligence and dashboards" },
        { label: "AI integrations and intelligent applications" },
        { label: "Workflow and process automation" },
        { label: "AI agents and chatbot integrations" },
        { label: "Data engineering and pipelines", confirm: true },
      ],
      connects: "Sits at the centre: needs engineering for reliable data, design so people trust it, and security so it is safe to use.",
    },
    {
      id: "security",
      number: "04",
      name: "Security and reliability",
      short: "Security",
      part: "Outer ring",
      problem: "The system must stay up, stay correct and keep the right people in and the wrong ones out.",
      capabilities: [
        { label: "Secure software development" },
        { label: "Authentication and access control" },
        { label: "Application security" },
        { label: "Quality assurance and performance optimisation" },
        { label: "Infrastructure hardening", confirm: true },
        { label: "Authorised security assessments", confirm: true },
      ],
      connects: "Wraps everything else: threat modelling shapes the architecture, and tests and monitoring protect each release.",
    },
  ] as Pillar[],

  shapes: {
    title: "How the pillars combine",
    intro: "Illustrative engagement shapes. Filled marks show which pillars carry the work.",
    items: [
      {
        title: "Launch a product",
        situation: "A new product that has to look credible and run reliably on day one.",
        pillars: ["engineering", "experience", "security"],
      },
      {
        title: "Make operations smarter",
        situation: "Manual processes and scattered data that automation and a dashboard could replace.",
        pillars: ["engineering", "intelligence"],
      },
      {
        title: "Harden what already exists",
        situation: "A working system that needs better access control, testing and monitoring.",
        pillars: ["engineering", "security"],
      },
      {
        title: "Add intelligence to a product",
        situation: "An existing product that needs AI features people can understand and trust.",
        pillars: ["engineering", "experience", "intelligence", "security"],
      },
    ] satisfies Shape[],
  },

  work: {
    title: "Work and experiments",
    intro:
      "No client engagements are shown here. One piece is real work the studio built for this site; the rest are labelled concepts that show how we think.",
  },

  projects: [
    {
      id: "instrument",
      kind: "built",
      title: "The Instrument: a gimbal from Blender to browser",
      discipline: "3D and creative development",
      summary:
        "The hero sculpture on this page. Modelled and rendered in Blender through a script, exported as a compressed GLB and shown live in the browser, with a rendered poster as the fallback.",
      demonstrates:
        "A real 3D asset pipeline with performance budgets and graceful fallbacks, rather than a decorative effect.",
      facts: [
        { label: "Model", value: "7,252 polygons, 238 KB GLB" },
        { label: "Fallback", value: "67 KB rendered poster" },
        { label: "3D loads", value: "After page load, when idle" },
        { label: "Reduced motion", value: "Poster only, no 3D download" },
      ],
      stack: ["Blender 5.2 (Python)", "glTF + meshopt", "three.js", "Next.js"],
      pillars: ["experience", "engineering"],
      visual: "gimbal",
      shape: "wide",
    },
    {
      id: "signal-board",
      kind: "concept",
      title: "Signal board",
      discipline: "Data and dashboards",
      summary:
        "A concept operations dashboard that puts one decision above the chart: what changed, and what to do about it.",
      demonstrates: "Turning data into a decision surface instead of a wall of charts.",
      stack: ["Postgres", "dbt", "TypeScript", "Charting library"],
      pillars: ["intelligence", "experience", "engineering"],
      visual: "signal",
      shape: "portrait",
    },
    {
      id: "intake-flow",
      kind: "concept",
      title: "Intake to ticket",
      discipline: "AI and automation",
      summary:
        "A concept workflow where a language model drafts and routes inbound requests, and a person approves anything that leaves the building.",
      demonstrates: "AI automation with a human approval step, logs and a clear fallback.",
      stack: ["LLM API", "Queue", "Ticketing API", "Audit log"],
      pillars: ["intelligence", "engineering", "security"],
      visual: "flow",
      shape: "square",
    },
    {
      id: "access-review",
      kind: "concept",
      title: "Access review",
      discipline: "Security and reliability",
      summary:
        "A concept console that makes over-broad permissions visible, so they can be reviewed before they become incidents.",
      demonstrates: "Access control and security review designed as a usable product, not a spreadsheet.",
      stack: ["OIDC", "RBAC model", "Audit events", "TypeScript"],
      pillars: ["security", "experience", "engineering"],
      visual: "access",
      shape: "wide",
    },
  ] satisfies Project[],

  process: {
    title: "How we work",
    intro:
      "Four stages with a written output at the end of each. The pillars involved change from stage to stage, so design, data and security are present from the start rather than added at the end.",
  },

  steps: [
    {
      number: "01",
      title: "Discover",
      description:
        "We learn how the business works, who will use the software and which constraints are real, including data, compliance and existing systems.",
      output: "Problem statement, risks, open questions",
      pillars: ["engineering", "experience", "intelligence", "security"],
    },
    {
      number: "02",
      title: "Define",
      description:
        "Scope, architecture and a delivery plan. Interface prototypes and a threat model are produced alongside the technical approach.",
      output: "Scope, prototype, architecture, milestone plan",
      pillars: ["engineering", "experience", "security"],
    },
    {
      number: "03",
      title: "Build",
      description:
        "Short iterations that end in working software. You review progress in a running environment, not in status reports.",
      output: "Tested increments, reviewed code, staging builds",
      pillars: ["engineering", "experience", "intelligence"],
    },
    {
      number: "04",
      title: "Validate and deliver",
      description:
        "Testing against real use, performance and security checks, then a documented handover so your team can operate and extend the system.",
      output: "Production release, documentation, handover",
      pillars: ["engineering", "security"],
    },
  ] satisfies Step[],

  agreements: {
    title: "Proposed working agreements",
    items: [
      "One shared backlog across design and engineering",
      "A working demo at the end of every iteration",
      "Decisions written down where everyone can find them",
      "Code, designs and documentation handed over at the end",
    ],
  },

  studio: {
    title: "Studio approach",
    statement: "Four disciplines in one team make better software than four vendors passing files.",
    beliefs: [
      {
        number: "01",
        title: "Design and engineering share one backlog.",
        text: "Prototypes are built in code early, so a design decision meets real constraints before it is expensive to change.",
      },
      {
        number: "02",
        title: "Security is a requirement, not a phase.",
        text: "Access, data handling and failure modes are decided at the architecture stage and checked on every release.",
      },
      {
        number: "03",
        title: "AI should earn its place.",
        text: "We use it where it removes real work, keep a person in the loop for decisions that matter, and log what it does.",
      },
    ] satisfies Belief[],
  },

  contact: {
    title: "Tell us what you are building.",
    intro:
      "Describe the product, the problem or the system you want to improve. Pick the areas involved if you know them; if not, we will work it out with you.",
    /** Placeholder address. Replace before launch. */
    email: "hello@agency.example",
    /** International format without symbols, e.g. "233201234567". Leave empty to hide. */
    whatsapp: "",
    /**
     * Form submission endpoint (for example a Formspree form URL), supplied at build time.
     * When empty, the form opens the visitor's email client addressed to `email` instead.
     */
    formEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "",
    next: [
      "We read the brief and reply with questions.",
      "A short call to scope it, if that helps.",
      "A written proposal with scope and milestones.",
    ],
  },

  /** Real profile URLs only. Entries with an empty `href` are not rendered. */
  socials: [
    { label: "GitHub", href: "" },
    { label: "LinkedIn", href: "" },
    { label: "X", href: "" },
  ] as { label: string; href: string }[],
};

export type SiteConfig = typeof siteConfig;

export const whatsappHref = siteConfig.contact.whatsapp
  ? `https://wa.me/${siteConfig.contact.whatsapp}`
  : "";

export const pillarById = (id: Part) => siteConfig.pillars.find((p) => p.id === id)!;
