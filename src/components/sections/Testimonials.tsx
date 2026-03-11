import { Reveal } from "../Reveal";
export function Testimonials() {
  const testimonials = [
    {
      name: "Ajay Verma",
      role: "Final‑year B.Tech, landed SDE offer at a MAANG company",
      quote:
        "Before SurelyPlaced, my job search was just random applications and rejection emails. They rebuilt my resume, fixed my LinkedIn, and gave me a clear weekly roadmap. Within a few months I was juggling multiple final‑rounds, and finally signed an SDE offer I didn’t think was realistic a year ago.",
    },
    {
      name: "Shreya Nair",
      role: "Recent CS graduate, offer at top product company",
      quote:
        "What helped me most was how practical everything felt—no generic advice. They showed me exactly how hiring managers read resumes, how to talk about my projects, and which roles I should actually target. The steady stream of applications they handled meant I could focus on interviews and system design prep.",
    },
    {
      name: "Rohan Gupta",
      role: "Working professional, pivoted from service company to product role",
      quote:
        "I was stuck in a service company with no clear path to a product role. SurelyPlaced helped me reposition my experience, highlight the right skills, and target companies that were actually hiring for my profile. The conversations were honest about timelines and effort, but the structure made the switch feel achievable.",
    },
  ];

  return (
    <section id="testimonials" className="container-narrow py-14 sm:py-18 scroll-mt-24">
      <Reveal className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal">
            Candidate stories
          </p>
          <h2 className="mt-1 font-display text-2xl text-slate-900 sm:text-3xl">
            What our candidates say about us.
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-600">
          We work closely with students and early‑career engineers to turn a vague
          job search into a structured path towards full‑time offers.
        </p>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t, idx) => (
          <Reveal key={t.name} delay={idx * 80}>
            <figure className="card flex h-full flex-col justify-between p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-elevated">
              <blockquote className="text-sm text-slate-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

