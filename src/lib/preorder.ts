// Kockar som endast tar emot förbeställd mat (minst 24 timmar i förväg).
export const PREORDER_ONLY_CHEF_IDS: string[] = [
  "1494423e-1a15-4238-9f4d-493b4343b0d2", // Daniel Gwantmiri
];

export const PREORDER_LEAD_TIME_HOURS = 24;

export const isPreorderOnlyChef = (chefId?: string | null): boolean =>
  !!chefId && PREORDER_ONLY_CHEF_IDS.includes(chefId);

/** Tidigaste tillåtna förbeställningstid som `YYYY-MM-DDTHH:mm` för datetime-local-fält. */
export const getEarliestPreorderValue = (from: Date = new Date()): string => {
  const earliest = new Date(from.getTime() + PREORDER_LEAD_TIME_HOURS * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${earliest.getFullYear()}-${pad(earliest.getMonth() + 1)}-${pad(earliest.getDate())}T${pad(earliest.getHours())}:${pad(earliest.getMinutes())}`;
};

export const isValidPreorderValue = (value: string, from: Date = new Date()): boolean => {
  if (!value) return false;
  const chosen = new Date(value);
  if (Number.isNaN(chosen.getTime())) return false;
  return chosen.getTime() >= from.getTime() + PREORDER_LEAD_TIME_HOURS * 60 * 60 * 1000;
};

export const formatPreorderLabel = (value: string): string => {
  const chosen = new Date(value);
  if (Number.isNaN(chosen.getTime())) return value;
  return chosen.toLocaleString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
};
