// Kockens egna service-etiketter ("Sälj ...") översätts till kundvänliga ("Köp ...")
// när de visas på publika kockprofiler/kort.
export const relabelSpecialtyForCustomer = (s: string): string => {
  if (!s) return s;
  return s
    .replace(/^Sälj din mat/i, "Köp min mat")
    .replace(/^Sälj färdiglagade matlådor/i, "Köp färdiglagade maträtter");
};
