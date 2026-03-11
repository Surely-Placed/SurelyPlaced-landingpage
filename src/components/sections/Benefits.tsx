import { Reveal } from "../Reveal";

export function Benefits() {
  const benefits = [
    {
      title: "Mentorship & training",
      body: "Hands‑on guidance, feedback, and structured upskilling paths that move you from confusion to clarity about your next role.",
    },
    {
      title: "Professional resume building",
      body: "Market‑tested, ATS‑optimised resumes and profiles that frame your experience for decision‑makers—not just algorithms.",
    },
    {
      title: "Strategic job applications",
      body: "Smart, high‑leverage applications focused on the right companies and roles, instead of spraying and praying.",
    },
    {
      title: "Specialised consultants",
      body: "A team that understands FAANG/MAANG and top product companies—so your preparation, story, and target roles stay aligned.",
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
            Why choose SurelyPlaced
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight text-slate-900 sm:text-3xl">
            Comprehensive career solutions for serious candidates.
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Strategic intervention, modern hiring signals, and hands‑on
            execution—engineered to unlock your next full‑time role.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, idx) => (
            <Reveal key={b.title} delay={idx * 90}>
              <div className="group flex h-full flex-col rounded-2xl bg-white/90 p-5 shadow-soft ring-1 ring-slate-100 transition hover:-translate-y-1.5 hover:shadow-elevated">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal group-hover:bg-teal/15">
                  <span className="text-lg">★</span>
                </div>
                <h3 className="mt-4 font-display text-base text-slate-900">
                  {b.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

