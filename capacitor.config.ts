import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Android app ("Vyuhaa Continuum"). The UI is bundled into the app; it talks to the hosted
 * Continuum API set by VITE_API_BASE at build time (see .github/workflows/android.yml).
 */
const config: CapacitorConfig = {
  appId: 'com.vyuhaa.continuum',
  appName: 'Vyuhaa Continuum',
  webDir: 'dist',
  android: {
    // Release builds must not allow plain-HTTP traffic or WebView debugging
    allowMixedContent: false,
  },
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: false,
      backgroundColor: '#ffffff',
      showSpinner: false,
      androidScaleType: 'CENTER_INSIDE',
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#ffffff',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
