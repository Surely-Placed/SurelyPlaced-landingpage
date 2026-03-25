import { SurelyPlacedLogo } from "@/components/Logo";

const companyLinks = [
  { label: "About Us", href: "#home" },
  { label: "Privacy Policy", href: "#/privacy" },
  { label: "Contact Us", href: "#home" },
] as const;

const serviceLinks = [
  { label: "Resume Creation", href: "#program-resume" },
  { label: "1:1 Technical Mentorship", href: "#program-mentorship" },
  { label: "Job Application Support", href: "#program-applications" },
] as const;

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-surface">
      <div className="container-narrow py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#home" className="inline-flex items-center gap-2.5">
              <SurelyPlacedLogo className="h-9 w-auto sm:h-10" />
            </a>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Talent That Sticks
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
              We help students and early‑career engineers follow a structured path into
              full‑time roles—from ATS‑optimised resumes to targeted applications and
              interview readiness.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900">Company</h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-600 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-600 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900">Contact</h3>
            <ul className="mt-4 space-y-3.5">
              <li>
                <a
                  href="mailto:hr@ssggetjob.com"
                  className="flex items-start gap-2.5 text-sm text-slate-600 transition-colors hover:text-primary"
                >
                  <MailIcon className="mt-0.5 shrink-0 text-teal" />
                  <span>hr@ssggetjob.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919987815794"
                  className="flex items-start gap-2.5 text-sm text-slate-600 transition-colors hover:text-primary"
                >
                  <PhoneIcon className="mt-0.5 shrink-0 text-teal" />
                  <span>+91 99878 15794</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-600">
                <MapPinIcon className="mt-0.5 shrink-0 text-teal" />
                <span>Gandhinagar, Gujarat, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} SurelyPlaced. All rights reserved.</p>
          <p className="text-center sm:text-right">Designed for high‑intent hiring journeys.</p>
        </div>
      </div>
    </footer>
  );
}
