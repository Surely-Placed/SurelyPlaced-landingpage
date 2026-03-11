import { SurelyPlacedLogo } from "@/components/Logo";

type Props = {
  onBack: () => void;
};

export function ThankYouPage({ onBack }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-narrow flex items-center justify-between py-4">
          <a href="#home" className="flex items-center gap-3">
            <SurelyPlacedLogo className="h-10 w-auto sm:h-10" />
            {/* <div className="hidden sm:block">
              <p className="font-display text-base tracking-tight text-white">
                SurelyPlaced
              </p>
              <p className="text-[11px] font-body text-slate-400">
                Talent That Sticks
              </p>
            </div> */}
          </a>
        </div>
      </header>
      <main className="flex flex-1 items-center bg-white">
        <div className="container-narrow py-16">
          <div className="mx-auto max-w-xl text-center">
            <p className="inline-flex rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal">
              Thank you
            </p>
            <h1 className="mt-4 font-display text-3xl text-slate-900 sm:text-4xl">
              We&apos;ve received your details.
            </h1>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Our team will review your details and reach out within one working day
              to schedule a discovery conversation. If your requirement is urgent,
              reply to our email and we&apos;ll prioritise it.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={onBack}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-slate-800 algin-items-center"
              >
                Back to SurelyPlaced
              </button>
              {/* <p className="text-[11px] text-slate-500">
                You can close this tab—no further action needed.
              </p> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

