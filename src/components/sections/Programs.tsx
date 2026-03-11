import { Reveal } from "../Reveal";
export function Programs() {
  const programs = [
    {
      name: "Resume Creation",
      badge: "ATS‑optimised",
      description:
        "We craft personalised, ATS‑friendly resumes and professional profiles that highlight your skills, experience, and strengths.",
    },
    {
      name: "1:1 Technical Mentorship",
      badge: "Hands‑on guidance",
      description:
        "Get paired with experienced industry professionals for personalised mentorship to strengthen your technical depth.",
    },
    {
      name: "Job Application Support",
      badge: "End‑to‑end execution",
      description:
        "We run a structured, high‑volume, targeted application engine on your behalf for full‑time roles at reputed companies.",
    },
  ];

  return (
    <section id="programs" className="bg-surface py-14 sm:py-18 scroll-mt-24">
      <div className="container-narrow">
        <Reveal className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal">
            Programs & services
          </p>
          <h2 className="mt-1 font-display text-2xl text-slate-900 sm:text-3xl">
            Designed for serious job search journeys.
          </h2>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {programs.map((p, idx) => (
            <Reveal key={p.name} delay={idx * 80}>
              <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-soft/40 transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-elevated">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="font-display text-base text-slate-900">{p.name}</h3>
                  <span className="rounded-full bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {p.badge}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{p.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

