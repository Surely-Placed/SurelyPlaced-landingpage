export type LeadFormValues = {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  company: string;
  currentRole: string;
  targetedRole: string;
};

export const initialLeadFormValues: LeadFormValues = {
  name: "",
  email: "",
  countryCode: "+1",
  phone: "",
  company: "",
  currentRole: "",
  targetedRole: "",
};

