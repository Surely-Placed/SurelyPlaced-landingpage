import { Reveal } from "../Reveal";

export function Benefits() {
  const steps = [
    {
      title: "Book a call",
      body: "Schedule a quick consultation to share your background, target roles, and timelines.",
    },
    {
      title: "Get your roadmap",
      body: "We outline a focused plan across resume, profile, and job search so you know what happens next.",
    },
    {
      title: "Move towards offers",
      body: "You execute with our support on applications and prep, while we help you stay on track.",
    },
  ];

  return (
    <section
      id="benefits"
      className="scroll-mt-24 bg-slate-50 py-16 sm:py-20"
    >
      <div className="container-narrow">
        <Reveal className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">
            Why choose us
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight text-slate-900 sm:text-3xl">
            How SurelyPlaced works for you.
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            A simple three‑step flow from first call to concrete progress on your job search.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, idx) => (
            <Reveal key={step.title} delay={idx * 90}>
              <div className="flex h-full flex-col items-center rounded-2xl bg-white/90 p-6 text-center shadow-soft ring-1 ring-slate-100 transition hover:-translate-y-1.5 hover:shadow-elevated">
                <div className="relative mb-4 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
                    <span className="text-lg">
                      {idx === 0 ? "📞" : idx === 1 ? "👥" : "🎯"}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white shadow-soft">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="font-display text-base text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

