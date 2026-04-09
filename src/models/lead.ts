export type LeadFormValues = {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  whatsappCountryCode: string;
  whatsapp: string;
  linkedin: string;
  company: string;
  currentRole: string;
  targetedRole: string;
};

export const initialLeadFormValues: LeadFormValues = {
  name: "",
  email: "",
  countryCode: "+1",
  phone: "",
  whatsappCountryCode: "+1",
  whatsapp: "",
  linkedin: "",
  company: "",
  currentRole: "",
  targetedRole: "",
};

