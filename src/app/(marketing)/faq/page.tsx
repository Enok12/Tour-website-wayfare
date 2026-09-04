import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/landing/page-header";
import { Reveal } from "@/components/landing/reveal";
import { FinalCta } from "@/components/landing/final-cta";
import { BRAND } from "@/content/site-content";

const groups = [
  {
    heading: "Booking with us",
    faqs: [
      {
        q: "Is this like a marketplace, where I get matched automatically?",
        a: "No. Every request is reviewed by a real person on our team, who then hand-picks the guide best suited to your trip and availability. There is no automatic matching algorithm.",
      },
      {
        q: "How long until I hear back after submitting a request?",
        a: "Most requests are reviewed and assigned within one business day. You can check the status any time with your booking reference.",
      },
      {
        q: "Do I need an account to book a trip?",
        a: "No account is required. You will receive a booking reference right after submitting your request, which you can use to track it any time.",
      },
      {
        q: "What if I don't know exactly what I want yet?",
        a: "That is completely fine. Fill in as much as you know on the Customize Your Tour form and leave the rest blank — we will follow up with questions if we need to.",
      },
    ],
  },
  {
    heading: "Guides, payment and changes",
    faqs: [
      {
        q: "Can I request a specific guide?",
        a: "You can mention a preference in your special requests and we will do our best to accommodate it, though the final assignment depends on availability and fit.",
      },
      {
        q: "How do I pay for my trip?",
        a: "Payment details are arranged directly with our team once your trip is confirmed and assigned to a guide. We do not add a booking fee on top of what you agree.",
      },
      {
        q: "Can I change or cancel after submitting?",
        a: "Yes. Contact us with your booking reference and we will adjust the trip or cancel it. The earlier you tell us, the more flexibility there is with accommodation.",
      },
      {
        q: "What does the price on a package include?",
        a: "The figure shown on a package is a starting price built from the places in that itinerary. Accommodation choice and optional extras adjust it, and you will see a running total while you build the trip.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-5 pt-36 sm:px-6 lg:pt-40">
        <PageHeader
          eyebrow="Support"
          title="Frequently asked"
          accent="questions"
          subtitle="If the answer you need is not here, write to us — a person reads that inbox too."
        />

        {groups.map((group, gi) => (
          <section key={group.heading} className="mt-16">
            <h2 className="mb-6 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-brass-600">
              {group.heading}
            </h2>
            <div className="divide-y divide-pine-900/8 border-y border-pine-900/8">
              {group.faqs.map((faq, i) => (
                <Reveal key={faq.q} delay={i * 50}>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                      <h3 className="font-display text-[1.25rem] font-semibold leading-snug text-pine-900">
                        {faq.q}
                      </h3>
                      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pine-900/15 text-pine-700 transition-all duration-300 group-open:rotate-45 group-open:border-brass-500 group-open:text-brass-600">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl pr-12 text-[0.9375rem] leading-relaxed text-ink-muted">
                      {faq.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
            {gi === groups.length - 1 && (
              <p className="mt-10 text-sm text-ink-muted">
                Still stuck? Email{" "}
                <a
                  href={`mailto:${BRAND.email}`}
                  className="text-brass-600 underline underline-offset-4"
                >
                  {BRAND.email}
                </a>{" "}
                or{" "}
                <Link href="/contact" className="text-brass-600 underline underline-offset-4">
                  get in touch
                </Link>
                .
              </p>
            )}
          </section>
        ))}
      </div>

      <div className="mt-24 pb-24 lg:pb-28">
        <FinalCta />
      </div>
    </div>
  );
}
