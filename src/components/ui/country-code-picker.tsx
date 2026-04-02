import { useMemo, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type CountryItem = {
  iso2: CountryCode;
  name: string;
  dialCode: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

function getFlagUrl(iso2: string): string {
  return `https://flagcdn.com/24x18/${iso2.toLowerCase()}.png`;
}

function buildCountries(): CountryItem[] {
  const display = new Intl.DisplayNames(["en"], { type: "region" });
  return getCountries()
    .map((iso2) => ({
      iso2,
      name: display.of(iso2) || iso2,
      dialCode: `+${getCountryCallingCode(iso2)}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function CountryCodePicker({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const countries = useMemo(buildCountries, []);

  const selected =
    countries.find((c) => c.dialCode === value && c.iso2 === "US") ||
    countries.find((c) => c.dialCode === value) || {
      iso2: "US" as CountryCode,
      name: "United States",
      dialCode: "+1",
    };

  const filtered = countries.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.iso2.toLowerCase().includes(q)
    );
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`w-32 justify-between rounded-lg px-2 text-slate-900 ${className ?? ""}`}
        >
          <span className="flex items-center gap-1.5 text-sm">
            <img
              src={getFlagUrl(selected.iso2)}
              alt={`${selected.name} flag`}
              className="h-[14px] w-[18px] rounded-[2px] object-cover"
              loading="lazy"
            />
            <span>{selected.dialCode}</span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search country or code..."
          className="mb-2 w-full rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-primary"
        />
        <div className="max-h-72 overflow-y-auto rounded-md border border-slate-100">
          {filtered.map((c) => (
            <button
              key={c.iso2}
              type="button"
              onClick={() => {
                onChange(c.dialCode);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-2.5 py-2 text-left text-sm hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <img
                  src={getFlagUrl(c.iso2)}
                  alt={`${c.name} flag`}
                  className="h-[14px] w-[18px] rounded-[2px] object-cover"
                  loading="lazy"
                />
                <span>{c.name}</span>
              </span>
              <span className="text-slate-500">{c.dialCode}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-2.5 py-3 text-sm text-slate-500">No countries found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
