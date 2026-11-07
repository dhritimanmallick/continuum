import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initNative } from './native';
import { isNativeApp } from './services/apiBase';

// Web: service worker for offline resilience & PWA install. The Android app bundles its files, so it skips this.
if (!isNativeApp() && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('SW registration note:', err);
    });
  });
}

initNative();
createRoot(document.getElementById('root')!).render(<App />);
