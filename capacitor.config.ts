import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sftbrain.mobile',
  appName: 'SFT Brain',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    // Remove contentInset to allow env(safe-area-inset-*) to work properly
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
    Preferences: {
      // Used for storing auth tokens securely
    },
  },
};

export default config;
