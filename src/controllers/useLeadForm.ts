import { useState, ChangeEvent, FormEvent } from "react";
import { clearStoredUtmSource, getUtmSourceForSubmit } from "../lib/utm";
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.targetedRole) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          current_role: form.currentRole,
          targeted_role: form.targetedRole,
          utm_source: getUtmSourceForSubmit(),
        }),
      });

      if (!res.ok) {
        await res.text();
        options?.onError?.({
          id: Date.now(),
          type: "error",
          message:
            "Something went wrong while submitting your details. Please try again.",
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

  return { form, submitting, submitted, handleChange, handleSubmit, reset };
}

