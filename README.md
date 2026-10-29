# The Digital Instrument — agency landing page

A single-page landing site for a software development studio. Next.js (App Router), TypeScript, Tailwind CSS 4.
The hero is a machined three-axis gimbal: modelled and rendered in Blender, shown live with three.js.

The agency name, services, projects and contact details are **placeholders** until real ones are supplied.
Everything editable lives in one file: [`src/config/site.ts`](src/config/site.ts).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint
npx tsc --noEmit   # type check
```

## Configure

Edit [`src/config/site.ts`](src/config/site.ts):

| What | Where in the file |
| --- | --- |
| Agency name and wordmark (nav, footer, page title) | `agency` |
| Headline, description, audience line, hero buttons | `hero` |
| Service pillars and their capabilities (mark unconfirmed ones with `confirm: true`) | `pillars` |
| Engagement shapes in the combination matrix | `shapes` |
| Work: the built piece and the concepts | `projects` |
| Process steps and working agreements | `steps`, `agreements` |
| Studio point of view | `studio` |
| Email, WhatsApp number, form endpoint, "what happens next" | `contact` |
| Social profiles (only entries with a real `href` render) | `socials` |

The team review pack, with research, open decisions and what is confirmed versus assumed, is in
[`REVIEW.md`](REVIEW.md).

`draft: true` shows small "Draft" markers beside content that is not yet confirmed. Set it to `false` when the
copy is final.

Real project images: put the file in `public/`, then add
`image: { src: "/work/name.webp", alt: "…", width: 1600, height: 1000 }` to a project. Without `image`, the coded
visual for that project is shown. A project with `href` becomes a link; without it, no link is rendered. Set
`kind` to `"built"` only for real work, and keep `"concept"` for anything that is not a delivered project.

Colours, type scale and surfaces are tokens in [`src/app/globals.css`](src/app/globals.css).

### Contact form

The form validates input and has loading, success and failure states. It never reports success unless a request
succeeded.

- **With an endpoint** (recommended): copy `.env.example` to `.env.local` and set
  `NEXT_PUBLIC_CONTACT_ENDPOINT` to a form service URL (for example a Formspree form). The form sends a JSON `POST`
  of `{ name, email, projectType, message }`.
- **Without an endpoint**: the button becomes "Compose email" and opens the visitor's email app addressed to
  `contact.email`. No success message is shown, because nothing was sent by the site.

`NEXT_PUBLIC_*` values are embedded at build time, so set the variable in your host's build settings and redeploy.

## The 3D sculpture

| File | What it is |
| --- | --- |
| `scripts/blender/build_sculpture.py` | Blender Python script that builds the model, exports the GLB and renders the poster |
| `assets/blender/instrument.blend` | Generated source scene (open it in Blender to inspect or adjust) |
| `public/models/instrument.glb` | Real-time model (meshopt-compressed, ~240 KB) |
| `public/images/instrument-poster.webp` | Blender (Cycles) render used before the 3D loads and as the fallback |
| `src/lib/instrument-scene.ts` | three.js scene: loads the GLB, studio lighting, animation |
| `src/components/hero/HeroFigure.tsx` | Poster, canvas, part markers and loading logic |
| `src/components/hero/PillarRail.tsx` | Pillar index under the hero; hover or focus highlights the matching sculpture part |

Rebuild the assets (Blender 4.2+; developed with 5.2):

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/blender/build_sculpture.py -- \
  --glb public/models/instrument.glb \
  --png assets/blender/poster.png \
  --blend assets/blender/instrument.blend
```

Then convert the poster:
`node -e "require('sharp')('assets/blender/poster.png').resize(1200).webp({quality:84,alphaQuality:90}).toFile('public/images/instrument-poster.webp')"`

Behaviour:

- The poster is server-rendered, so the first paint is never empty.
- The three.js bundle and GLB load only after the page has loaded and the browser is idle.
- Rendering runs only while the sculpture is on screen and the tab is visible.
- Reduced-motion users, Save-Data users and browsers without WebGL keep the poster; the 3D code is never downloaded.
- Touch devices render at a lower pixel ratio and skip the pointer tilt.

## Deploy

The site is fully static (`○ Static` in the build output), so any static-capable host works.

**Vercel:** import the repository, add `NEXT_PUBLIC_CONTACT_ENDPOINT` in Project Settings → Environment Variables,
and deploy. No other settings are required.

**Other Node hosts:** `npm run build && npm start` (set `PORT` as needed).

Before launch: replace the placeholders in `site.ts`, set `draft` to `false`, set a real contact email and form
endpoint, and set `metadataBase` plus an Open Graph image in `src/app/layout.tsx` once the production URL is known.

## Structure

```
src/
  app/                 layout, page, global styles and tokens
  config/site.ts       all editable content
  components/
    layout/            Nav (mobile menu is a native <dialog>), Footer
    sections/          Hero, Capabilities, Work, Process, Studio, Contact
    work/              project cards and the coded concept visuals
    contact/           ContactForm (client)
    hero/              HeroFigure (client)
    ui/                buttons, icons, draft marker
  lib/instrument-scene.ts
scripts/blender/       sculpture build script
assets/blender/        .blend source and full-size poster render
```

Only `Nav`, `HeroFigure` and `ContactForm` are client components. Entrance and scroll-reveal motion is CSS only and
is disabled under `prefers-reduced-motion`.
