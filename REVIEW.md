# Team review — iteration 2

Review pack for the team meeting on Friday, 30 October 2026. It records what was researched, what was wrong with
the first version, what changed, and, most importantly, which decisions are still open.

**Nothing on the page is a confirmed fact about the agency.** The name, positioning, audience, service list and
point of view are proposals for the team to accept, change or reject.

## 1. Run the demo

```bash
npm install
npm run dev        # http://localhost:3000
```

For the closest thing to what visitors see, use `npm run build && npm start`. Everything editable is in
[`src/config/site.ts`](src/config/site.ts). `draft: true` in that file shows the "Draft" and "◦ to confirm"
markers; set it to `false` once the content is agreed.

## 2. Research

Six references were supplied; I read each one directly (page text, and for TechWap, which renders client-side, in a
real browser). I added three more to cover the creative-technology and security ends of the brief. I could read
copy and structure, **not motion or visual polish**; those notes are marked as such.

| Site | What it does well | Implication for this page |
| --- | --- | --- |
| [Rimola](https://rimola.org/) | Opens with a point of view ("we build what others only pitch") and proves it with its own live products. Numbered, short process. Low-friction single-paragraph contact. | Lead with a claim the studio can defend. Keep the contact path short. Its stats and "taking two projects" scarcity line are **not** copied: nothing equivalent is established here. |
| [H-Studio, AERA case study](https://www.h-studio.id/en/case-studies/aera-product-studio-website) | Frames a broad technical offer as a *system with defined roles*, not a list. Shows design-system thinking and responsive pairs. Weakness: no measurable outcome. | Present capabilities as a structure with relationships. Show reasoning, not just screenshots. Do not claim outcomes without evidence. |
| [Bit Design](https://bitdesign.agency/) | Typography-led hero, a repeated discovery-call CTA, a WhatsApp route. Weakness: services and portfolio menus blur together; some placeholder links. | Keep one clear primary CTA. Keep services and work separate. Offer a second contact route (WhatsApp is supported in config). |
| [Cactus Digital Media](https://www.cactusdigitalmedia.ng/) | Six flat numbered services, a "connected by design" idea, a four-step process, "Start a project" repeated. No logos or testimonials, so it leans on process and showreel. | A flat six-item list is the pattern to avoid. The "connected" idea is worth keeping, but needs a visual structure (the pillar matrix). |
| [TechWap](https://techwapltd.com/) | Agency work and owned products presented side by side; strong specifics (founding year, counts, named products); plain process; FAQ. | Real products are the strongest proof. We have none yet, so the page shows **one real built piece and clearly labelled concepts** rather than borrowing that tone. |
| [Native](https://www.native.agency/) | Clear audience and operating model; "you own the code"; consistent case-study format with outcome-led headlines; repeated CTA. Relies on logos, testimonials and figures. | Name the audience and the working model explicitly. Those proof devices are exactly what must **not** be invented here. |
| [basement.studio](https://basement.studio/) | Treats engineering, design, 3D and creative development as one outcome tied to client needs, not a menu. Credibility from named clients, awards and open-source typeface work. | Supports the "one team" framing and 3D as a capability, not decoration. Experiments and open source are credible proof the studio can publish later. |
| [Instrument](https://www.instrument.com/) | Strategy, creative and technology presented as one multidisciplinary approach; filterable work. Heavy reliance on client roster and awards. | Filtering work by discipline is a good later feature once there is enough work. |
| [Trail of Bits](https://www.trailofbits.com/) | Security credibility comes from publishing: audits, research, open-source tools, talks. | Security claims need evidence. For now it is listed as *potential*, with assessments flagged as to-confirm; publishing is the long-term route to credibility. |

A general search for "service pillar" structure returned only generic homepage guidance. The usable points were:
state the value proposition, one visual and one primary CTA in the first screen; say plainly what the services are
and who they are for; position before showing output.

### Cross-cutting findings

1. **Strong sites lead with a defensible claim, then prove it.** Proof is clients, owned products, published work or
   specific numbers. The studio has none of these yet, so proof here is limited to what exists: one built piece.
2. **Service sprawl is the common failure.** Flat lists of six to nine services read as unfocused. Grouping into a
   few pillars and showing how they combine reads as a team.
3. **Process is a trust device** when each step has a concrete output. Every reference that does well has one.
4. **A repeated, single primary CTA** converts better than several competing ones, with one lightweight alternative
   route (email, WhatsApp, a call).
5. **Security and AI need restraint.** Both attract exaggerated claims. The page frames AI with a human approval step
   and logging, and security as a requirement from architecture onward, with assessments marked unconfirmed.

## 3. Critique of the first version

Honest findings from reading the source and the rendered page:

| Area | Weakness |
| --- | --- |
| Positioning | "We engineer what's next" says nothing about what is built, for whom, or why a multidisciplinary team matters. A visitor could not tell what the studio does without scrolling. |
| Hero | The oversized headline consumed the first screen and pushed the proposition down. The gimbal was striking but meaningless: its annotation ("A · Index mark") was decorative. |
| Services | Six flat items, each a generic sentence. No sign that design, data and security work together. |
| Work | Three empty placeholder tiles. Looked unfinished, and nothing demonstrated capability. |
| Process | Credible but generic; nothing tied it to the multidisciplinary pitch. |
| Studio | A single abstract statement ("software should behave like an instrument") with no stated point of view. |
| Contact | Generic form; no sense of what happens after sending. |
| Transition | The hero ended abruptly into a light section with no bridge. |
| Consistency | Section headings and spacing were consistent, but every section used the same row-list composition. |

What worked and was kept: the obsidian/graphite/bone palette with restrained lime, the gimbal and its Blender
pipeline, the grid, the typography, the single-file config, the accessibility and performance foundations.

## 4. What changed

- **Hero** now says what, for whom and why: a smaller three-line headline ("Engineering, design and intelligence."),
  a plain description, an assumed audience line, one primary CTA, and a **pillar rail** that bridges into the next
  section.
- **The gimbal now carries meaning.** Each part is a pillar (outer ring: security; middle ring: engineering; inner
  ring: experience; core: data, AI and automation). Numbered markers sit on the sculpture, and hovering or focusing a
  pillar in the rail lights the matching part in lime. The studio section includes a key.
- **Capabilities** are four pillars with a problem statement each, the full capability list, and how each connects
  to the others, plus a **combination matrix** showing which pillars carry typical engagements. Unconfirmed
  capabilities carry a "◦" marker.
- **Work** leads with one real piece (this page's Blender-to-browser sculpture, with only measured facts) and three
  labelled **concepts** (data dashboard, AI workflow with human approval, access review). Each is clearly marked
  "Concept · not a client project", uses synthetic data and lists *illustrative* technology.
- **Process** shows which pillars are active at each stage, and adds proposed working agreements.
- **Studio approach** replaces the abstract statement with a point of view and three beliefs.
- **Contact** adds optional area checkboxes and timeline, and a proposed "what happens next".
- Removed: the decorative "Index mark" annotation and the three empty placeholder tiles.

## 5. Proposed service pillars

| # | Pillar | Sculpture part | Contains |
| --- | --- | --- | --- |
| 01 | Product engineering | Middle ring | Web and mobile apps, SaaS and custom software, APIs and integrations, databases, cloud, DevOps and testing |
| 02 | Experience and creative technology | Inner ring | UI/UX, product design and prototyping, design systems, motion, 3D and interactive, creative development, brand and interface design* |
| 03 | Data, AI and automation | Core | Analysis and visualisation, BI and dashboards, AI integrations, workflow automation, agents and chatbots, data pipelines* |
| 04 | Security and reliability | Outer ring | Secure development, authentication and access control, application security, QA and performance, infrastructure hardening*, authorised security assessments* |

\* Marked "to confirm" on the page. The brief said these apply only "where supported".

Why four, and why these groupings: engineering is the base most buyers need; experience and data/AI are the
disciplines that most often get bought *with* it; security is the layer that makes the others trustworthy. Brand
and interface design sits under Experience only if the team can really deliver it.

## 6. Confirmed versus assumed

**Confirmed (exists in the repository and was measured):**

- The gimbal is a real Blender asset: scripted build, 7,252 polygons, 238 KB meshopt GLB, 67 KB rendered poster.
- The page builds, type-checks and lints cleanly; the contact form sends a real request when an endpoint is
  configured (tested against a local mock server, not a live service).
- Lighthouse results in section 8.

**Assumed (placeholders, not facts):**

- The agency name, wordmark, email address and every piece of copy.
- The audience ("startups, scale-ups and established teams").
- The four pillars, the capability lists, the engagement shapes and the process steps.
- The working agreements and the "what happens next" steps.
- The studio's point of view and beliefs.
- The three concepts: they are designs of work the team *could* do, not work done.

**Deliberately not included** because nothing supports them: clients, logos, testimonials, awards, certifications,
team size or bios, years in business, project counts, outcomes, pricing, response-time promises.

## 7. Decisions for the team tomorrow

1. **Name and identity.** What is the agency called? Does the armillary mark stay, and does the gimbal remain the
   signature image?
2. **Positioning.** Is "engineering, design and intelligence" the right promise, or is one pillar the lead (for
   example engineering first, with the others as support)?
3. **Audience.** Startups, established businesses, a sector, a region? This changes the headline, the examples and
   the pricing conversation.
4. **Pillar priorities.** Which of the four are genuinely deliverable now? Which items marked "◦" should be cut,
   kept or deferred?
5. **Security scope.** Will the studio offer authorised security assessments, or only secure development? The page
   must not imply testing services the team is not set up to deliver. If offered, what is the authorisation process?
6. **AI scope.** Integration and automation only, or model work as well? Which tools and providers?
7. **Proof.** Which real projects, products or experiments can be shown, with permission? Until then, are the
   concepts acceptable as labelled, or should work be reduced to the one built piece?
8. **Team.** Do we show people (names, roles)? Credibility improves a lot with real faces, but only if the team is
   comfortable with it.
9. **Contact.** Which email, whether WhatsApp is used, and which form service receives inquiries (Formspree or
   similar). What response time can we honestly commit to?
10. **Business model.** Fixed-scope projects, retainers, discovery paid or free? The page is deliberately silent.
11. **Voice.** The copy is plain and restrained. Does the team want a more playful or more formal tone?

## 8. Verification

Run on 29 October 2026, local machine, headless Chrome with software rendering, production build:

| Check | Result |
| --- | --- |
| `npx tsc --noEmit`, `npm run lint`, `npm run build` | All pass; the page builds as fully static |
| Browser review at 360, 390, 768, 1024 and 1440 px | No horizontal overflow and no clipped headings at any width; every section reviewed at 1440 and 390/360, hero reviewed at all five |
| In-page anchors | All 25 `#` links resolve to a section |
| Pillar hover highlight | Verified in the browser: the matching sculpture part lights lime and the rest dim |
| Reduced motion | With the preference forced on, only the static poster renders and `instrument.glb` is never requested |
| Contact form | Validation, success and failure states, and the new fields (areas, timeline), verified against a local mock endpoint. No live form service was used |
| Lighthouse, desktop | Performance 100, accessibility 100, best practices 100, SEO 100 (LCP 0.6 s, TBT 0 ms, CLS 0) |
| Lighthouse, mobile (throttled) | Performance 93, accessibility 100, best practices 100, SEO 100 (LCP 2.5 s, TBT 240 ms, CLS 0) |

Lighthouse was run once per mode against the production build in headless Chrome with software rendering, so
treat the scores as indicative; they vary by a few points between runs.

Not tested: a physical phone, Safari, Firefox, screen-reader use, or a live form service. Only the hero was
inspected visually at 768 and 1024 px.

## 9. Limitations and next steps

- **No real proof yet.** The biggest credibility gap. Next: publish one real case study or product, with
  permission, in the same format as the built piece.
- **Concepts are illustrations**, not interactive prototypes. If the team likes the direction, build one into a
  working demo.
- **The pillar-to-sculpture markers are positioned for the default pose**; they sit close to the right part but do
  not track the rotating rings exactly.
- **The Blender build script is the only 3D source.** The concept visuals are coded SVG, not Blender renders.
- **Single page only.** Per-pillar pages, a team page and a writing section are natural follow-ons.
- **Open Graph image and production URL** are not set. Add them in `src/app/layout.tsx` when the domain is known.
- Real-time 3D on a low-end phone has not been tested on hardware; if it struggles, disable the live scene on
  small screens and keep the poster.
