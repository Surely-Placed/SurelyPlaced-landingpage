import type { LeadFormValues } from "../../models/lead";
import { initialLeadFormValues } from "../../models/lead";

type Props = {
  form?: LeadFormValues;
  submitting?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
};

export function Hero(props: Props) {
  const {
    form = initialLeadFormValues,
    submitting = false,
    onChange = () => {},
    onSubmit = () => {},
  } = props ?? {};
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-navy-deep/95 via-navy-medium/90 to-slate-900 text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.16),_transparent_55%)]" />
      <div className="container-narrow relative flex min-h-[calc(100vh-5rem)] flex-col gap-12 pt-28 pb-16 lg:flex-row lg:items-center lg:pt-32 lg:pb-20">
        <div className="flex-1 space-y-6 animate-fade-up">
        <p className="inline-flex rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal">
          Structured path to full‑time roles
        </p>
        <h1 className="font-display text-3xl leading-tight text-white sm:text-4xl lg:text-5xl text-balance">
          Move closer to{" "}
          <span className="text-primary">full‑time roles</span>{" "}
          at leading companies.
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
          SurelyPlaced helps students and early‑career engineers follow a structured,
          end‑to‑end path into full‑time roles at FAANG/MAANG and other top product
          companies—from ATS‑optimised resumes to targeted applications and interview
          opportunities.
        </p>
        <ul className="grid gap-3 text-sm text-slate-100 sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
              ✓
            </span>
            <span>$157M+ worth of offers secured across candidates</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
              ✓
            </span>
            <span>1,000–1,500 targeted applications handled every month</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
              ✓
            </span>
            <span>ATS‑optimised, market‑tested resumes and profiles</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
              ✓
            </span>
            <span>End‑to‑end support from resume to interviews</span>
          </li>
        </ul>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <div className="flex -space-x-2">
            <div className="h-7 w-7 rounded-full bg-primary/80" />
            <div className="h-7 w-7 rounded-full bg-teal/80" />
            <div className="h-7 w-7 rounded-full bg-slate-800" />
          </div>
          <span>
            Backing candidates targeting roles at Amazon, Google, Microsoft, and other
            leading global companies.
          </span>
        </div>
        </div>

        <div className="flex-1 animate-fade-up [animation-delay:120ms]">
          <div className="card bg-white/95 p-6 shadow-elevated sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal">
            Start with a 20‑minute consultation
          </p>
          <h2 className="mt-2 font-display text-xl text-slate-900 text-balance">
            Share your job search goals with us
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Tell us where you want to go next and we&apos;ll respond within one
            business day with the best path forward.
          </p>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="you@university.edu"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">
                Phone number*
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="+1 555 123 4567"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-700">
                  College / University*
                </label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your college or university"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Current Designation*
                </label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  // placeholder="3rd year B.Tech, recent graduate, etc."
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">
                What kind of roles are you targeting?*
              </label>
              <textarea
                name="hiringNeed"
                value={form.hiringNeed}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
                placeholder="e.g. SDE / Data Engineer in FAANG/MAANG within the next 6–12 months"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {submitting && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              <span>
                {submitting ? "Submitting..." : "Book Your Call Today"}
              </span>
            </button>
            <p className="text-[11px] text-slate-400">
              We only use your details to follow up on this request. No spam, ever.
            </p>
          </form>
        </div>
      </div>
      </div>
    </section>
  );
}

