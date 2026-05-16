import type { CapacitorConfig } from '@capacitor/cli';

// Hybrid-läge:
// - Default: appen laddar webben live från https://homechef.nu
//   → Ändringar går ut direkt vid "Publicera", ingen ny store-version behövs.
// - Sätt CAP_USE_REMOTE=false vid build (t.ex. i Codemagic) för en "frusen"
//   store-version som laddar inbyggd dist/ istället. Används när du ändå skickar
//   in en ny version till App Store / Google Play, eller vill ha offline-stöd.
const useRemote = process.env.CAP_USE_REMOTE !== 'false';

const config: CapacitorConfig = {
  appId: 'se.homechef.nu',
  appName: 'Homechef',
  webDir: 'dist',
  ...(useRemote && {
    server: {
      url: 'https://homechef.nu',
      cleartext: false,
    },
  }),
};

export default config;
