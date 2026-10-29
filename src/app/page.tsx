import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Studio } from "@/components/sections/Studio";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="t-mono fixed top-3 left-3 z-[60] -translate-y-20 bg-lime px-4 py-3 text-obsidian focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Capabilities />
        <Work />
        <Process />
        <Studio />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
