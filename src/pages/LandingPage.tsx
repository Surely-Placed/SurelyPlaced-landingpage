import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { SocialProof } from "../components/sections/SocialProof";
import { Benefits } from "../components/sections/Benefits";
import { Programs } from "../components/sections/Programs";
import { Testimonials } from "../components/sections/Testimonials";
import { Faq } from "../components/sections/Faq";
import { LeadSection } from "../components/sections/LeadSection";

type Props = {
  heroForm: import("../models/lead").LeadFormValues;
  heroSubmitting: boolean;
  heroOnChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  heroOnSubmit: (e: React.FormEvent) => void;
  leadForm: import("../models/lead").LeadFormValues;
  leadSubmitting: boolean;
  leadOnChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  leadOnSubmit: (e: React.FormEvent) => void;
};

export function LandingPage({
  heroForm,
  heroSubmitting,
  heroOnChange,
  heroOnSubmit,
  leadForm,
  leadSubmitting,
  leadOnChange,
  leadOnSubmit,
}: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface via-white to-surface">
      <Header />
      <main>
        <Hero
          form={heroForm}
          submitting={heroSubmitting}
          onChange={heroOnChange}
          onSubmit={heroOnSubmit}
        />
        <SocialProof />
        <Benefits />
        <Programs />
        <Testimonials />
        <Faq />
        <LeadSection
          form={leadForm}
          submitting={leadSubmitting}
          onChange={leadOnChange}
          onSubmit={leadOnSubmit}
        />
      </main>
      <Footer />
    </div>
  );
}

