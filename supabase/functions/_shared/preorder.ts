// Kockar som endast tar emot förbeställd mat (minst 24 timmar i förväg).
// Måste hållas i synk med src/lib/preorder.ts på frontend.
export const PREORDER_ONLY_CHEF_IDS: string[] = [
  "1494423e-1a15-4238-9f4d-493b4343b0d2", // Daniel Gwantmiri / La Flamme
];

export const isPreorderOnlyChef = (chefId?: string | null): boolean =>
  !!chefId && PREORDER_ONLY_CHEF_IDS.includes(chefId);
