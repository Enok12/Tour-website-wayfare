import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/landing/photo";
import type { Article } from "@/content/site-content";
import { cn } from "@/lib/utils";

export function BlogCard({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  return (
    <article className={cn("group flex flex-col", className)}>
      <Link
        href={`/travel-guide/${article.slug}`}
        className="relative block overflow-hidden rounded-2xl"
      >
        <Photo
          src={article.image}
          alt={article.alt}
          className="aspect-[16/10] w-full"
          imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-linen/92 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-pine-900 backdrop-blur-sm">
          {article.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span className="mx-2 text-brass-500">/</span>
          {article.readMinutes} min read
        </p>

        <h3 className="mt-2.5 font-display text-[1.375rem] font-semibold leading-snug text-pine-900">
          <Link
            href={`/travel-guide/${article.slug}`}
            className="transition-colors duration-200 hover:text-brass-600"
          >
            {article.title}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-3 flex-1 text-[0.875rem] leading-relaxed text-ink-muted">
          {article.excerpt}
        </p>

        <Link
          href={`/travel-guide/${article.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-pine-700 transition-colors hover:text-brass-600"
        >
          Read more
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
