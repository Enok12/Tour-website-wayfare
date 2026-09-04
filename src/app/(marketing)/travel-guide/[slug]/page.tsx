import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/landing/page-header";
import { BlogCard, formatDate } from "@/components/landing/blog-card";
import { FinalCta } from "@/components/landing/final-cta";
import { ARTICLES, findArticle } from "@/content/site-content";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return { title: "Travel guide | Wayfare" };
  return { title: `${article.title} | Wayfare`, description: article.excerpt };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <div>
      <PageHeader
        eyebrow={`${article.category} · ${article.readMinutes} min read`}
        title={article.title}
        image={article.image}
        imageAlt={article.alt}
      />

      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:py-20">
        <p className="text-[0.75rem] uppercase tracking-[0.16em] text-ink-subtle">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </p>

        <div className="mt-8 space-y-6">
          {article.body.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "font-display text-[1.375rem] leading-relaxed text-pine-900"
                  : "text-[1.0625rem] leading-[1.85] text-ink-muted"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        <Link
          href="/travel-guide"
          className="mt-14 inline-flex items-center gap-2 text-sm font-medium text-pine-700 transition-colors hover:text-brass-600"
        >
          <ArrowLeft className="h-4 w-4" />
          All travel guide articles
        </Link>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl border-t border-pine-900/8 px-5 py-16 sm:px-6 lg:py-20">
          <p className="section-label mb-8">Keep reading</p>
          <div className="grid gap-10 sm:grid-cols-2">
            {related.map((item) => (
              <BlogCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      )}

      <div className="pb-24 lg:pb-28">
        <FinalCta />
      </div>
    </div>
  );
}
