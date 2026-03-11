import { useState } from "react";
import { Reveal } from "../Reveal";

export function Faq() {
  const faqs = [
    {
      q: "What does SurelyPlaced help me with?",
      a: "We support students and early‑career engineers across the full job‑search cycle—from building an ATS‑optimised resume and LinkedIn profile to identifying the right target roles, tailoring your story, and running high‑volume, targeted applications on your behalf.",
    },
    {
      q: "What kind of roles and companies do you target?",
      a: "We focus primarily on full‑time software and data roles at reputed organisations—such as Amazon, Google, Walmart, Oracle, Microsoft, and other top global product companies—along with high‑growth startups and strong Tier‑2 product firms.",
    },
    {
      q: "How does the process work from start to finish?",
      a: "We begin with a detailed consultation call, build your ATS‑optimised resume and profiles, and then move into structured, high‑volume applications plus support on assessments and interviews.",
    },
    {
      q: "How many applications will be made on my behalf?",
      a: "Our internal marketing team typically drives 1,000–1,500 targeted applications per month, focusing on roles where your skills match the requirements and there is a real chance of getting interviews.",
    },
    {
      q: "Is SurelyPlaced a placement guarantee or pay‑after‑placement service?",
      a: "No. SurelyPlaced is not a placement guarantee or pay‑after‑placement model; instead, we provide a structured process, stronger positioning, and a higher volume of relevant applications to maximise your chances of landing offers.",
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

