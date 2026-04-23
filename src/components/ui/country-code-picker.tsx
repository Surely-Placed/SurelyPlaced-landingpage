const COUNTRY_CODES = [
  { label: "US +1", dialCode: "+1" },
  { label: "IN +91", dialCode: "+91" },
  { label: "AE +971", dialCode: "+971" },
  { label: "SA +966", dialCode: "+966" },
  { label: "UK +44", dialCode: "+44" },
  { label: "AU +61", dialCode: "+61" },
  { label: "SG +65", dialCode: "+65" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function CountryCodePicker({ value, onChange, className }: Props) {
  const exists = COUNTRY_CODES.some((c) => c.dialCode === value);
  const selected = exists ? value : "+1";

  return (
    <div className="relative w-32 shrink-0">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Country code"
        className={`h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-2.5 pr-8 text-sm font-medium text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className ?? ""}`}
      >
        {COUNTRY_CODES.map((c, idx) => (
          <option key={`${c.label}-${idx}`} value={c.dialCode}>
            {c.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.1 1.02l-4.25 4.5a.75.75 0 0 1-1.1 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
        </svg>
      </span>
    </div>
  );
}
