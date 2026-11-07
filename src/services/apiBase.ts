/**
 * Where the Continuum API lives. On the web the app and API share an origin, so paths stay
 * relative. The Android app (Capacitor) serves the UI from https://localhost, so it is built with
 * VITE_API_BASE pointing at the hosted server, e.g. https://continuummcp.ai.studio
 */
const BASE = ((import.meta as any).env?.VITE_API_BASE || '').replace(/\/$/, '');
export const apiUrl = (path: string) => `${BASE}${path}`;
export const isNativeApp = () => !!(globalThis as any).Capacitor?.isNativePlatform?.();
