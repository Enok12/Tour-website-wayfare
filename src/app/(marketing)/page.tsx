import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { TrustBenefits } from "@/components/landing/trust-benefits";
import { SectionHeading } from "@/components/landing/section-heading";
import { PackageCard } from "@/components/landing/package-card";
import { DestinationCard } from "@/components/landing/destination-card";
import { ExperienceCard } from "@/components/landing/experience-card";
import { TestimonialCarousel } from "@/components/landing/testimonial-carousel";
import { StatisticsSection } from "@/components/landing/statistics-section";
import { BlogCard } from "@/components/landing/blog-card";
import { Newsletter } from "@/components/landing/newsletter";
import { FinalCta } from "@/components/landing/final-cta";
import { JourneyDiagram } from "@/components/landing/journey-diagram";
import { Reveal } from "@/components/landing/reveal";
import { destinationsFromPackages } from "@/lib/destinations";
import { serverFetch } from "@/lib/server-fetch";
import { ARTICLES, EXPERIENCES, HERO_SLIDES } from "@/content/site-content";
import type { PackageDto } from "@/types";

export default async function HomePage() {
  const res = await serverFetch<PackageDto[]>("/api/packages");
  const packages = res.success ? res.data : [];

  const featured = packages.slice(0, 4);
  const destinations = destinationsFromPackages(packages).slice(0, 4);

  return (
    <>
      <Hero
        slides={HERO_SLIDES}
        eyebrow="Discover the wonder of Sri Lanka"
        title="Authentic Journeys,"
        accent="Timeless Memories."
        subtitle="Handcrafted tours through Sri Lanka's most breathtaking places — designed around you, and read by a person before anyone plans a thing."
        primaryCta={{ href: "/packages", label: "Explore Our Packages" }}
        secondaryCta={{ href: "/about", label: "Our story" }}
      />

      <TrustBenefits float />

      {/* ---------------------------------------------- featured packages */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-6 lg:pt-28">
          <SectionHeading
            label="Featured packages"
            title="Handpicked tours"
            accent="just for you"
            link={{ href: "/packages", label: "View all packages" }}
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 80}>
                <PackageCard pkg={pkg} className="h-full" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------- destinations + experiences band */}
      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-6 lg:mt-28">
        <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          {destinations.length > 0 && (
            <Reveal className="rounded-3xl bg-linen-dark/55 p-7 sm:p-9">
              <SectionHeading
                label="Popular destinations"
                title="Where will you go next?"
                link={{ href: "/destinations", label: "All destinations" }}
              />
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {destinations.map((destination) => (
                  <DestinationCard key={destination.name} destination={destination} />
                ))}
              </div>
            </Reveal>
          )}

          <Reveal delay={100} className="rounded-3xl bg-pine-50/70 p-7 sm:p-9">
            <SectionHeading
              label="Experiences"
              title="More than just places"
              link={{ href: "/experiences", label: "See all" }}
            />
            <div className="mt-6 -mx-3 space-y-1">
              {EXPERIENCES.map((experience) => (
                <ExperienceCard key={experience.slug} experience={experience} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------ how it works + quotes */}
      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-6 lg:mt-28">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              label="How it works"
              title="Four steps, one"
              accent="real person"
              description="No queue, no matching algorithm. Here is exactly what happens after you send us your trip."
            />
            <div className="mt-12">
              <JourneyDiagram />
            </div>
          </div>

          <Reveal
            delay={120}
            className="rounded-3xl border border-brass-500/20 bg-brass-100/35 p-8 sm:p-9"
          >
            <p className="section-label mb-5">Traveller love</p>
            <TestimonialCarousel />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------- statistics */}
      <div className="mt-24 lg:mt-28">
        <StatisticsSection />
      </div>

      {/* ------------------------------------------------ travel inspiration */}
      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-6 lg:mt-28">
        <SectionHeading
          label="Travel inspiration"
          title="Notes from the road"
          link={{ href: "/travel-guide", label: "Read the travel guide" }}
        />
        <div className="mt-12 grid gap-9 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article, i) => (
            <Reveal key={article.slug} delay={i * 80}>
              <BlogCard article={article} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- closing */}
      <div className="mt-24 lg:mt-28">
        <Newsletter />
      </div>

      <div className="mt-6 pb-24 lg:pb-28">
        <FinalCta />
      </div>

      {packages.length === 0 && (
        <div className="mx-auto -mt-16 max-w-7xl px-5 pb-24 sm:px-6">
          <div className="rounded-2xl border border-dashed border-pine-700/25 p-10 text-center text-sm text-ink-muted">
            No tour packages are published yet.{" "}
            <Link href="/customize" className="text-brass-600 underline underline-offset-4">
              Tell us what you have in mind
            </Link>{" "}
            and we will build one around it.
            <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
          </div>
        </div>
      )}
    </>
  );
}
