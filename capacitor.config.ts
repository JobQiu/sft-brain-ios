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
    contentInset: 'never', // Handle safe areas in CSS for full control
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
