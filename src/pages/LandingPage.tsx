import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { SocialProof } from "../components/sections/SocialProof";
import { Benefits } from "../components/sections/Benefits";
import { Programs } from "../components/sections/Programs";
import { Testimonials } from "../components/sections/Testimonials";
import { Faq } from "../components/sections/Faq";

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
        <SocialProof />
        <Benefits />
        <Programs />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

