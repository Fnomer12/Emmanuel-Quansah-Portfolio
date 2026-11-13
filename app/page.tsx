import Hero from "@/components/hero";
import About from "@/components/about";
import Stats from "@/components/stats";
import Experience from "@/components/experience";
import Centrepiece from "@/components/centrepiece";
import Training from "@/components/training";
import Education from "@/components/education";
import Beyond from "@/components/beyond";
import Mission from "@/components/mission";
import Contact from "@/components/contact";
import SiteFooter from "@/components/site-footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white">
      <Hero />
      <About />
      <Stats />
      <Experience />
      <Centrepiece />
      <Training />
      <Education />
      <Beyond />
      <Mission />
      <Contact />
      <SiteFooter />
    </main>
  );
}