import { Reveal } from "../Reveal";
export function Programs() {
  const programs = [
    {
      name: "Resume Creation",
      badge: "ATS‑optimised",
      description:
        "We craft personalised, ATS‑friendly resumes and professional profiles that highlight your skills, experience, and strengths.",
      bullets: [
        "Detailed information capture and role alignment",
        "Keyword‑rich, market‑tested resume within 5–7 working days",
        "Profiles tailored to target roles and geographies",
      ],
    },
    {
      name: "1:1 Technical Mentorship",
      badge: "Hands‑on guidance",
      description:
        "Get paired with experienced industry professionals for personalised mentorship to strengthen your technical depth.",
      bullets: [
        "1:1 sessions tailored to your background and goals",
        "Guidance on core concepts, projects, and interview prep",
        "Clarity on what top companies expect at each level",
      ],
    },
    {
      name: "Job Application Support",
      badge: "End‑to‑end execution",
      description:
        "We run a structured, high‑volume, targeted application engine on your behalf for full‑time roles at reputed companies.",
      bullets: [
        "1,000–1,500 targeted applications per month",
        "Applications only to full‑time, relevant roles",
        "Ongoing tracking of assessments, responses, and interviews",
      ],
    },
  ];

  return (
    <section id="programs" className="bg-surface py-14 sm:py-18 scroll-mt-24">
      <div className="container-narrow">
        <Reveal className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">
              Programs & services
            </p>
            <h2 className="mt-1 font-display text-2xl text-slate-900 sm:text-3xl">
              Designed for serious job search journeys.
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-600">
            Whether you&apos;re a final‑year student, a recent graduate, or a working
            professional planning a switch, each program is built to move you closer
            to full‑time offers at top product companies.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {programs.map((p, idx) => (
            <Reveal key={p.name} delay={idx * 80}>
              <article className="flex flex-col rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-soft/40 transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-elevated">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="font-display text-base text-slate-900">{p.name}</h3>
                  <span className="rounded-full bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {p.badge}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{p.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

