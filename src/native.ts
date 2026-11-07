/**
 * Native (Android) behaviour when running inside the Capacitor app. No-op on the web.
 * - Status bar and splash screen
 * - Android back button: closes the open pop-up/drawer, else returns to the profile home,
 *   else exits the app from the home screen.
 */
import { isNativeApp } from './services/apiBase';

export const APP_BACK_EVENT = 'continuum:back';

export async function initNative() {
  if (!isNativeApp()) return;
  const [{ App }, { StatusBar, Style }, { SplashScreen }] = await Promise.all([
    import('@capacitor/app'), import('@capacitor/status-bar'), import('@capacitor/splash-screen'),
  ]);
  document.documentElement.classList.add('native-app');
  try {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
  } catch { /* older Android */ }
  setTimeout(() => SplashScreen.hide(), 300);

  App.addListener('backButton', () => {
    // 1. A pop-up or the menu drawer is open: close it (they all listen for Escape)
    const overlay = document.querySelector('[role="dialog"], .fixed.inset-0.z-50, .fixed.inset-0.z-\\[60\\]');
    if (overlay) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      const close = overlay.querySelector<HTMLButtonElement>('button[aria-label="Close menu"], button[aria-label="Close"], button[title="Close"]');
      close?.click();
      return;
    }
    // 2. Inside a profile: ask the app to go back to the profile home; 3. otherwise exit
    const handled = !window.dispatchEvent(new CustomEvent(APP_BACK_EVENT, { cancelable: true }));
    if (!handled) App.exitApp();
  });
}
