import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.homechef.app',
  appName: 'Homechef',
  webDir: 'dist',
  bundledWebRuntime: false,
  
  // IMPORTANT: Remove or comment out 'server' config for production builds
  // The server config below is only for development with hot-reload
  // server: {
  //   url: 'https://211e56d1-e9f5-433c-89dc-4ce2d7998096.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
};

export default config;