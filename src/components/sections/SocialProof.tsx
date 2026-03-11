import { useEffect, useRef, useState } from "react";
import { Reveal } from "../Reveal";

type CounterProps = {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;
};

function AnimatedCounter({
  from = 0,
  to,
  duration = 800,
  prefix = "",
  suffix = "",
  format,
}: CounterProps) {
  const [value, setValue] = useState(from);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = from;
    const end = to;
    const startTime = performance.now();

    const step = (time: number) => {
      const t = Math.min(1, (time - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = start + (end - start) * eased;
      setValue(next);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [from, to, duration]);

  const display = format
    ? format(value)
    : new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
      }).format(value);

  return (
    <span className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function SocialProof() {
  return (
    <section id="stats" className="bg-slate-900 py-6 text-white scroll-mt-24">
      <Reveal className="container-narrow grid gap-6 text-sm sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wide text-teal">
            Offers secured
          </p>
          <p className="font-display text-2xl">
            <AnimatedCounter
              to={157}
              prefix="$"
              suffix="M+"
              duration={900}
            />
          </p>
          <p className="text-xs text-slate-400">
            Total offer value secured by candidates supported through
            SurelyPlaced.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wide text-teal">
            Applications per month
          </p>
          <p className="font-display text-2xl">
            <AnimatedCounter to={1000} duration={700} />–
            <AnimatedCounter to={1500} duration={700} />
          </p>
          <p className="text-xs text-slate-400">
            High‑volume, targeted job applications executed consistently every
            month.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wide text-teal">
            Global opportunities
          </p>
          <p className="font-display text-2xl">
            Top<span className="text-teal"> companies</span>
          </p>
          <p className="text-xs text-slate-400">
            Candidates supported for full‑time roles at Amazon, Google, Walmart,
            Oracle, Microsoft, and other leading organisations.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

