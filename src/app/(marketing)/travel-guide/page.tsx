import type { Metadata } from "next";
import { PageHeader } from "@/components/landing/page-header";
import { BlogCard } from "@/components/landing/blog-card";
import { Newsletter } from "@/components/landing/newsletter";
import { Reveal } from "@/components/landing/reveal";
import { ARTICLES } from "@/content/site-content";

export const metadata: Metadata = {
  title: "Travel guide | Wayfare",
  description:
    "Seasonal advice, food, and the quiet corners of Sri Lanka — written by the people who plan our trips.",
};

export default function TravelGuidePage() {
  const [lead, ...rest] = ARTICLES;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-36 sm:px-6 lg:pb-28 lg:pt-40">
      <PageHeader
        eyebrow="Travel guide"
        title="Notes from"
        accent="the road"
        subtitle="Seasonal advice, food worth crossing the island for, and the places our guides suggest when someone asks what else there is."
      />

      {lead && (
        <Reveal className="mt-16">
          <BlogCard article={lead} className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12" />
        </Reveal>
      )}

      {rest.length > 0 && (
        <div className="mt-16 grid gap-10 border-t border-pine-900/8 pt-16 sm:grid-cols-2 lg:grid-cols-2">
          {rest.map((article, i) => (
            <Reveal key={article.slug} delay={i * 80}>
              <BlogCard article={article} className="h-full" />
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-24 -mx-5 sm:-mx-6">
        <Newsletter />
      </div>
    </div>
  );
}
