import { useState, ChangeEvent, FormEvent } from "react";
import { clearStoredUtmSource, getUtmFieldsForSubmit } from "../lib/utm";
import { LeadFormValues, initialLeadFormValues } from "../models/lead";

export type Toast = {
  id: number;
  type: "success" | "error";
  message: string;
};

type UseLeadFormOptions = {
  onSuccess?: (toast: Toast) => void;
  onError?: (toast: Toast) => void;
};

export function useLeadForm(options?: UseLeadFormOptions) {
  const [form, setForm] = useState<LeadFormValues>(initialLeadFormValues);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const normalizePhone10Digits = (raw: string, countryCode: string) => {
    let digits = String(raw || "").replace(/\D/g, "");
    const ccDigits = String(countryCode || "").replace(/\D/g, "");
    // If user pastes full number with selected country code, keep local 10 digits.
    if (
      ccDigits &&
      digits.length === ccDigits.length + 10 &&
      digits.startsWith(ccDigits)
    ) {
      digits = digits.slice(ccDigits.length);
    }
    return digits.slice(0, 10);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm((prev) => ({
        ...prev,
        phone: normalizePhone10Digits(value, prev.countryCode),
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryCodeChange = (countryCode: string) => {
    setForm((prev) => ({
      ...prev,
      countryCode,
      phone: normalizePhone10Digits(prev.phone, countryCode),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const phoneDigits = normalizePhone10Digits(form.phone, form.countryCode);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      country_code: form.countryCode.trim(),
      phone: phoneDigits,
      company: form.company.trim(),
      current_role: form.currentRole.trim(),
      targeted_role: form.targetedRole.trim(),
      ...getUtmFieldsForSubmit(),
    };

    if (payload.name.length < 2) {
      options?.onError?.({
        id: Date.now(),
        type: "error",
        message: "Please enter a valid name.",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      options?.onError?.({
        id: Date.now(),
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }
    if (payload.phone.length !== 10) {
      options?.onError?.({
        id: Date.now(),
        type: "error",
        message: "Please enter a valid 10-digit phone number.",
      });
      return;
    }
    if (payload.company.length < 2) {
      options?.onError?.({
        id: Date.now(),
        type: "error",
        message: "Please enter your college / university.",
      });
      return;
    }
    if (payload.current_role.length < 2) {
      options?.onError?.({
        id: Date.now(),
        type: "error",
        message: "Please enter your current role.",
      });
      return;
    }
    if (payload.targeted_role.length < 2) {
      options?.onError?.({
        id: Date.now(),
        type: "error",
        message: "Please describe the roles you're targeting.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const errorMessage =
          (body && (body.error || body.detail)) ||
          "Something went wrong while submitting your details. Please try again.";
        options?.onError?.({
          id: Date.now(),
          type: "error",
          message: String(errorMessage),
        });
        return;
      }

      clearStoredUtmSource();
      setSubmitted(true);
      options?.onSuccess?.({
        id: Date.now(),
        type: "success",
        message: "Thanks! Your details have been submitted successfully.",
      });
    } catch {
      options?.onError?.({
        id: Date.now(),
        type: "error",
        message:
          "We couldn't submit your details due to a network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setForm(initialLeadFormValues);
  };

  return {
    form,
    submitting,
    submitted,
    handleChange,
    handleCountryCodeChange,
    handleSubmit,
    reset,
  };
}


