import { useState } from "react";
import { Reveal } from "../Reveal";

export function Faq() {
  const faqs = [
    {
      q: "What does SurelyPlaced help me with?",
      a: "We support students and early‑career engineers across the full job‑search cycle—from building an ATS‑optimised resume and LinkedIn profile to identifying the right target roles, tailoring your story, and running high‑volume, targeted applications on your behalf. Along the way, you also get guidance on interview prep, offer comparison, and navigating timelines so you can take clearer decisions instead of guessing your next step.",
    },
    {
      q: "What kind of roles and companies do you target?",
      a: "We focus primarily on full‑time software and data roles at reputed organisations—such as Amazon, Google, Walmart, Oracle, Microsoft, and other top global product companies—along with high‑growth startups and strong Tier‑2 product firms. The exact target list is customised based on your skills, current experience, and preferred locations, so we are not just applying randomly but aligning with where you realistically have a strong chance of converting.",
    },
    {
      q: "How does the process work from start to finish?",
      a: "We begin with a detailed consultation call where we understand your background, constraints, and target timelines. From there, we collect the necessary details to build your ATS‑optimised resume and profiles, usually within 5–7 working days. Once that foundation is ready, we move into structured, high‑volume applications, track responses, and help you prioritise assessments and interviews. Throughout the engagement, we continue to tweak your targeting and messaging based on what the market is responding to.",
    },
    {
      q: "How many applications will be made on my behalf?",
      a: "Our internal marketing team typically drives 1,000–1,500 targeted applications per month, depending on your profile and the kinds of companies you want to prioritise. The goal is not just volume for the sake of it—we focus on roles where your skills match the requirements and where there is a real chance of getting to interviews. This keeps a steady pipeline of assessments and conversations coming in, instead of you facing long dry spells.",
    },
    {
      q: "Is SurelyPlaced a placement guarantee or pay‑after‑placement service?",
      a: "No. SurelyPlaced is not a placement guarantee or pay‑after‑placement model, and we do not promise a specific job title, company, or compensation. What we commit to is a structured process: stronger positioning through better resumes and profiles, a significantly higher volume of relevant applications, and honest feedback on where you stand. This approach maximises your chances of landing interviews and offers, without making unrealistic promises.",
    },
    {
      q: "Do you only work with FAANG/MAANG companies?",
      a: "FAANG/MAANG and similar Tier‑1 product companies are a major focus because many candidates aspire to those brands. At the same time, we actively include strong Tier‑2 product firms, fast‑growing startups, and other global tech companies where the work, team, and growth curve may be even better for your stage. This mix keeps your options open instead of forcing your search into a very narrow set of logos.",
    },
    {
      q: "Can I continue my own job search while working with you?",
      a: "Absolutely. In fact, we encourage it. Many candidates combine our structured, high‑volume application engine with their own networking, referrals, and alumni connects. When you do both in parallel, you dramatically increase the number of serious opportunities in your pipeline, while also ensuring that you are not missing out on hidden roles that come through personal connections.",
    },
    {
      q: "What do you expect from me during the engagement?",
      a: "We expect you to share accurate information about your academics and work history, be responsive on email and WhatsApp, and complete online assessments and coding tests within the given timelines. We also ask you to keep us updated on every interview or recruiter touchpoint so we can refine your targeting and preparation. When we both treat this like a serious project, the results are consistently stronger.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-14 sm:py-18 scroll-mt-24">
      <div className="container-narrow">
        <Reveal className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">
              FAQ
            </p>
            <h2 className="mt-1 font-display text-2xl text-slate-900 sm:text-3xl">
              Answers to common questions.
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-600">
            Still curious? Share your context in the form below and we&apos;ll
            respond with specifics, not templates.
          </p>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Reveal key={item.q} delay={idx * 60}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex((current) => (current === idx ? null : idx))
                  }
                  className="group flex w-full flex-col rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-soft transition hover:border-teal/60 hover:shadow-elevated sm:px-5 sm:py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900 sm:text-base">
                      {item.q}
                    </p>
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold transition ${
                        isOpen
                          ? "border-teal bg-teal text-slate-900"
                          : "border-slate-300 bg-slate-50 text-slate-500"
                      }`}
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                  <div
                    className={`mt-1 overflow-hidden text-sm text-slate-600 transition-all duration-200 ${
                      isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="pt-2">{item.a}</p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

