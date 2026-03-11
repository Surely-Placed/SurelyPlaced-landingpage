import type { LeadFormValues } from "../../models/lead";
import { initialLeadFormValues } from "../../models/lead";
import { Reveal } from "../Reveal";

type Props = {
  form?: LeadFormValues;
  submitting?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
};

export function LeadSection(props: Props) {
  const {
    form = initialLeadFormValues,
    submitting = false,
    onChange = () => {},
    onSubmit = () => {},
  } = props ?? {};
  return (
    <section id="lead" className="bg-slate-900 py-14 sm:py-18 scroll-mt-24">
      <Reveal className="container-narrow grid gap-10 lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:items-center">
        <div className="space-y-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal">
            Contact Us
          </p>
          <h2 className="font-display text-2xl sm:text-3xl">
            Ready to aim for FAANG / MAANG?
          </h2>
          <p className="max-w-md text-sm text-slate-300">
            Share a few details and we&apos;ll walk you through a structured roadmap
            from resume and profile creation to applications, assessments, and interviews.
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal" />
              <span>We respond within one working day.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal" />
              <span>No obligation, purely exploratory.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal" />
              <span>Context‑rich conversation, not a generic sales pitch.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white/5 p-5 shadow-soft">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-100">
                  Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-slate-600/60 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-100">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-slate-600/60 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                  placeholder="you@university.edu"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-100">
                Phone number*
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-600/60 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                placeholder="+1 555 123 4567"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-100">
                College / University*
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-600/60 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                placeholder="Your college or university"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-100">
                Current Designation*
              </label>
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-600/60 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                // placeholder="3rd year B.Tech, recent graduate, etc."
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-100">
                What are your target roles and timelines?*
              </label>
              <textarea
                name="hiringNeed"
                value={form.hiringNeed}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-600/60 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                rows={3}
                placeholder="e.g. SDE / Data Engineer roles in FAANG/MAANG over the next 6–12 months."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-soft transition hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {submitting && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-900/40 border-t-slate-900" />
              )}
              <span>
                {submitting ? "Submitting..." : "Book Your Call Today"}
              </span>
            </button>
            <p className="text-[11px] text-slate-400">
              By submitting, you agree to be contacted regarding this request. We
              do not share your details with third parties.
            </p>
          </form>
        </div>
      </Reveal>
    </section>
  );
}

