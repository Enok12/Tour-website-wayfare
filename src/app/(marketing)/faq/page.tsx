const faqs = [
  {
    q: "Is this like Uber, where I get matched automatically?",
    a: "No. Every request is reviewed by a real person on our team, who then hand-picks the guide best suited to your trip and availability. There's no automatic matching algorithm.",
  },
  {
    q: "How long until I hear back after submitting a request?",
    a: "Most requests are reviewed and assigned within one business day. You can track the status any time with your booking reference.",
  },
  {
    q: "Do I need an account to book a trip?",
    a: "No account is required. You'll receive a booking reference right after submitting your request, which you can use to check on its status any time.",
  },
  {
    q: "What if I don't know exactly what I want yet?",
    a: "That's completely fine -- fill in as much as you know on the Customize Your Tour form, and leave the rest blank. We'll follow up with questions if needed.",
  },
  {
    q: "Can I request a specific guide?",
    a: "You can mention a preference in your special requests, and we'll do our best to accommodate it, though final assignment is based on availability and fit.",
  },
  {
    q: "How do I pay for my trip?",
    a: "Payment details are arranged directly with our team after your trip is confirmed and assigned to a guide.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="mb-3 font-display italic text-brass-600">FAQ</p>
      <h1 className="font-sans text-4xl font-bold tracking-tight text-pine-950 sm:text-5xl">
        Frequently asked questions
      </h1>

      <dl className="mt-12 divide-y divide-black/5">
        {faqs.map((faq) => (
          <div key={faq.q} className="py-6">
            <dt className="font-display text-lg text-pine-900">{faq.q}</dt>
            <dd className="mt-2 leading-relaxed text-ink-muted">{faq.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
