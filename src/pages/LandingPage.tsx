import { Suspense, lazy } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";

const SocialProof = lazy(() =>
  import("../components/sections/SocialProof").then((m) => ({ default: m.SocialProof })),
);
const Benefits = lazy(() =>
  import("../components/sections/Benefits").then((m) => ({ default: m.Benefits })),
);
const Programs = lazy(() =>
  import("../components/sections/Programs").then((m) => ({ default: m.Programs })),
);
const Testimonials = lazy(() =>
  import("../components/sections/Testimonials").then((m) => ({ default: m.Testimonials })),
);
const Faq = lazy(() => import("../components/sections/Faq").then((m) => ({ default: m.Faq })));

type Props = {
  heroForm: import("../models/lead").LeadFormValues;
  heroSubmitting: boolean;
  heroOnChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  heroOnCountryCodeChange: (value: string) => void;
  heroOnWhatsappCountryCodeChange: (value: string) => void;
  heroOnSubmit: (e: React.FormEvent) => void;
};

export function LandingPage({
  heroForm,
  heroSubmitting,
  heroOnChange,
  heroOnCountryCodeChange,
  heroOnWhatsappCountryCodeChange,
  heroOnSubmit,
}: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface via-white to-surface">
      <Header />
      <main>
        <Hero
          form={heroForm}
          submitting={heroSubmitting}
          onChange={heroOnChange}
          onCountryCodeChange={heroOnCountryCodeChange}
          onWhatsappCountryCodeChange={heroOnWhatsappCountryCodeChange}
          onSubmit={heroOnSubmit}
        />
        <Suspense fallback={null}>
          <SocialProof />
          <Benefits />
          <Programs />
          <Testimonials />
          <Faq />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

