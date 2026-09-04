import type { Metadata } from "next";
import { PageHeader } from "@/components/landing/page-header";
import { ExperienceCard } from "@/components/landing/experience-card";
import { StatisticsSection } from "@/components/landing/statistics-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Reveal } from "@/components/landing/reveal";
import { EXPERIENCES } from "@/content/site-content";

export const metadata: Metadata = {
  title: "Experiences | Wayfare",
  description:
    "Wildlife safaris, cultural encounters, scenic train journeys and the coast — the kinds of days our guides build trips around.",
};

export default function ExperiencesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Experiences"
        title="More than"
        accent="just places"
        subtitle="A trip is made of days, not destinations. These are the kinds of days our guides build around — mix as many as you like into one itinerary."
        image="/images/lk/exp-wildlife.jpg"
        imageAlt="A Sri Lankan leopard resting on a rock in Yala National Park"
      />

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-2">
          {EXPERIENCES.map((experience, i) => (
            <Reveal key={experience.slug} delay={(i % 2) * 90}>
              <ExperienceCard experience={experience} variant="feature" />
            </Reveal>
          ))}
        </div>
      </div>

      <StatisticsSection />

      <div className="mt-6 pb-24 lg:pb-28">
        <FinalCta
          image="/images/lk/exp-coast.jpg"
          alt="Stilt fishermen on the coast near Galle"
          title="Build a trip around what you love"
          body="Tell us which of these matter most and we will shape the route, the pace and the guide around them."
          cta={{ href: "/customize", label: "Customize your tour" }}
        />
      </div>
    </div>
  );
}
