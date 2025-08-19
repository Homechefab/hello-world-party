import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.211e56d1e9f5433c89dc4ce2d7998096',
  appName: 'hello-world-party',
  webDir: 'dist',
  server: {
    url: 'https://211e56d1-e9f5-433c-89dc-4ce2d7998096.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;