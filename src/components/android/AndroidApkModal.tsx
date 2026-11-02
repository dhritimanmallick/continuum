import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  ArrowRight,
  Radio,
  FileCode,
  Globe,
  QrCode,
  Terminal,
  HeartHandshake,
  X
} from 'lucide-react';

interface AndroidApkModalProps {
  onClose: () => void;
  onNavigateToPortal?: (portal: 'OPD' | 'LAB' | 'PHARMA' | 'VICINITY' | 'REVENUES', role?: 'DOCTOR' | 'RECEPTION') => void;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ onClose, onNavigateToPortal }) => {
  const [activeTab, setActiveTab] = useState<'methods' | 'build-guide' | 'pwa-status'>('methods');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-na7b77aqvjbk3fiwd77dk3-874587549476.asia-southeast1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopyCommand = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(id);
    setTimeout(() => setCopiedCommand(null), 2500);
  };

  const handleDownloadManifestPackage = () => {
    const packageData = {
      name: "Vyuhaa Continuum Care — OPD & Vicinity Health",
      version: "1.0.0",
      description: "Android OPD Base App with Vicinity Pathology & Pharmacy Revenue Network",
      start_url: appUrl,
      display: "standalone",
      orientation: "portrait-primary",
      theme_color: "#9f1239",
      background_color: "#ffffff",
      icons: [
        { src: `${appUrl}/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
        { src: `${appUrl}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
        { src: `${appUrl}/icon-maskable.png`, sizes: "512x512", type: "image/png", purpose: "maskable" }
      ],
      capacitor_config: {
        appId: "org.vyuhaa.continuum.opd",
        appName: "Vyuhaa OPD",
        webDir: "dist",
        bundledWebRuntime: false,
        server: {
          url: appUrl,
          cleartext: true
        }
      },
      cli_commands: [
        "npm install -g @bubblewrap/cli",
        `bubblewrap init --manifest=${appUrl}/manifest.json`,
        "bubblewrap build"
      ]
    };

    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vyuhaa-android-app-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-indigo-950 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 rounded-2xl bg-rose-600/30 border border-rose-400/40 text-rose-300">
              <Smartphone className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-300 tracking-wider uppercase bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-400/20">
                  Android Application Center
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-700/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  WebAPK / PWA Ready
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Where is the APK File &amp; How to Run on Android
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-2">
            The app is engineered with an <strong>Android-native PWA architecture</strong>. In cloud preview containers, raw <code>.apk</code> binaries cannot be compiled directly without a local Android SDK/Gradle setup, but you have <strong>three direct, immediate options</strong> to run and download it as an Android app.
          </p>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-5 border-b border-white/10 pb-1">
            <button
              onClick={() => setActiveTab('methods')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'methods'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span>3 Ways to Get Android App</span>
            </button>

            <button
              onClick={() => setActiveTab('build-guide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'build-guide'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-purple-600" />
              <span>1-Click APK Generator &amp; CLI</span>
            </button>

            <button
              onClick={() => setActiveTab('pwa-status')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pwa-status'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Android Manifest &amp; PWA Audit</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          
          {/* TAB 1: 3 Direct Methods */}
          {activeTab === 'methods' && (
            <div className="space-y-6">
              
              {/* Method 1: WebAPK (Instant) */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 shadow-xs relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      Method 1 • Fastest (Recommended)
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-emerald-950">
                      Direct Android WebAPK Install (No Side-loading Required)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                      Android Google Chrome and Samsung Internet package PWAs into native <strong>WebAPKs</strong> directly onto the phone. This gives you a native app icon in your app launcher drawer, full-screen standalone experience, notification support, and offline caching.
                    </p>
                    
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-700">How to install:</span>
                      <span className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-slate-800 font-medium">
                        1. Open URL on Android Chrome
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-slate-800 font-medium">
                        2. Tap &quot;Install app&quot; or ⋮ menu → &quot;Add to Home Screen&quot;
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold">
                        3. Android builds &amp; installs WebAPK
                      </span>
                    </div>
                  </div>

                  {/* QR & Share Box */}
                  <div className="bg-white p-3 rounded-2xl border border-emerald-200/90 shadow-xs flex flex-col items-center gap-2 shrink-0 sm:w-48 text-center">
                    <div className="w-24 h-24 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center text-white relative">
                      <QrCode className="w-16 h-16 text-emerald-400" />
                      <span className="text-[9px] font-bold text-slate-300 mt-0.5">Scan on Phone</span>
                    </div>
                    <button
                      onClick={handleCopyUrl}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl ? 'Copied URL!' : 'Copy App URL'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Method 2: PWABuilder (1-Click APK Generator) */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50/50 border border-indigo-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      Method 2 • Real Downloadable .APK &amp; .AAB
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-indigo-950">
                      Generate Signed .APK via PWABuilder (Google / Microsoft Official Tool)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      If your team needs a standalone <strong>.apk binary file</strong> to transfer via WhatsApp/USB or upload to an internal MDM or Google Play Console, PWABuilder packages this live app URL into a verified signed Android APK in 30 seconds.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={pwaBuilderUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Launch 1-Click APK Generator on PWABuilder</span>
                      </a>

                      <button
                        onClick={handleDownloadManifestPackage}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-300 text-indigo-900 font-bold text-xs transition cursor-pointer shadow-xs"
                      >
                        <Download className="w-4 h-4 text-indigo-600" />
                        <span>Download Android Package Config</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-indigo-950 text-indigo-100 p-4 rounded-2xl border border-indigo-800 text-xs shrink-0 sm:w-56 space-y-2">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Output Deliverables</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-indigo-200">
                      <li>• <code>app-release.apk</code> (Direct install)</li>
                      <li>• <code>app-release.aab</code> (Google Play)</li>
                      <li>• Trusted Web Activity (TWA) wrapper</li>
                      <li>• Chrome 72+ &amp; Android 5.0+ to 15</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Method 3: Local Android Studio Build (Bubblewrap / Capacitor) */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-700 text-white text-[10px] font-bold uppercase tracking-wider">
                      Method 3 • Developer CLI
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Build Locally with Google Bubblewrap or Capacitor CLI
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                      Google publishes the <code>@bubblewrap/cli</code> tool specifically to turn PWAs into production Android APKs from the command line:
                    </p>

                    <div className="mt-3 bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs relative group">
                      <div className="text-emerald-400 text-[11px] mb-1"># Run in your local terminal:</div>
                      <div>npm i -g @bubblewrap/cli</div>
                      <div>bubblewrap init --manifest={appUrl}/manifest.json</div>
                      <div>bubblewrap build</div>

                      <button
                        onClick={() => handleCopyCommand(`npm i -g @bubblewrap/cli\nbubblewrap init --manifest=${appUrl}/manifest.json\nbubblewrap build`, 'cmd-bubble')}
                        className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCommand === 'cmd-bubble' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCommand === 'cmd-bubble' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architecture Highlight: OPD Base + Vicinity Network */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950">
                <HeartHandshake className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-900">
                    Architectural Note: OPD Base App with Vicinity On-Demand Pathology &amp; Pharmacy
                  </div>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    The Android app is organized with <strong>OPD as the base clinical hub</strong>. When doctors prescribe tests or medication, the order triggers the <strong>Vicinity Radar</strong>, routing requests to nearby labs and chemists who have opted in. This creates an interconnected local healthcare economy where doctors build sustainable revenue for local vendors.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Step-by-Step Build Guide */}
          {activeTab === 'build-guide' && (
            <div className="space-y-5">
              <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-base text-white">Capacitor Android Build Instructions</h3>
                  </div>
                  <span className="text-[11px] bg-purple-950 border border-purple-800 text-purple-300 px-2 py-0.5 rounded-full font-mono">
                    Node.js + Android Studio
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  To build a standalone debug or signed release APK using Capacitor, clone or download this repo and run these 4 commands:
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500">1. Install Capacitor:</span>
                      <div className="text-emerald-400 mt-0.5">npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                    </div>
                    <button
                      onClick={() => handleCopyCommand('npm install @capacitor/core @capacitor/cli @capacitor/android', 'cap1')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCommand === 'cap1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500">2. Initialize &amp; Build:</span>
                      <div className="text-emerald-400 mt-0.5">npx cap init &quot;Vyuhaa OPD&quot; org.vyuhaa.continuum --web-dir dist &amp;&amp; npm run build</div>
                    </div>
                    <button
                      onClick={() => handleCopyCommand('npx cap init "Vyuhaa OPD" org.vyuhaa.continuum --web-dir dist && npm run build', 'cap2')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCommand === 'cap2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500">3. Add Android Platform:</span>
                      <div className="text-emerald-400 mt-0.5">npx cap add android &amp;&amp; npx cap sync</div>
                    </div>
                    <button
                      onClick={() => handleCopyCommand('npx cap add android && npx cap sync', 'cap3')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCommand === 'cap3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500">4. Compile APK directly:</span>
                      <div className="text-emerald-400 mt-0.5">cd android &amp;&amp; ./gradlew assembleDebug</div>
                    </div>
                    <button
                      onClick={() => handleCopyCommand('cd android && ./gradlew assembleDebug', 'cap4')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCommand === 'cap4' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-purple-950/60 border border-purple-800/80 text-[11px] text-purple-200">
                  <span className="font-bold text-white">APK File Output Location:</span> <code>android/app/build/outputs/apk/debug/app-debug.apk</code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PWA Manifest Audit */}
          {activeTab === 'pwa-status' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Item 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Web App Manifest (manifest.json)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Configured with <code>standalone</code> display, portrait lock, theme color <code>#9f1239</code>, and healthcare categories.
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Offline Service Worker (sw.js)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Caches static assets, logo, manifest, and icons for offline operation in clinic basements.
                    </div>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">High-Resolution Android Icons</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Included: <code>icon-192.png</code>, <code>icon-512.png</code>, and adaptive <code>icon-maskable.png</code>.
                    </div>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Touch &amp; Viewport Optimization</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <code>viewport-fit=cover</code>, mobile status bar meta tags, zero-zoom on tap inputs.
                    </div>
                  </div>
                </div>

              </div>

              {/* Raw Manifest Preview */}
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px]">public/manifest.json (Live Configuration)</span>
                  <button
                    onClick={handleDownloadManifestPackage}
                    className="text-xs text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
                <pre className="overflow-x-auto text-[11px] text-emerald-300 max-h-48 leading-relaxed">
{`{
  "name": "Vyuhaa Continuum Care — OPD & Vicinity Health",
  "short_name": "Vyuhaa OPD",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#9f1239",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}`}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Target OS: Android 5.0 through Android 15 (Pixel, Samsung, Xiaomi, OnePlus)</span>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToPortal && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToPortal('VICINITY');
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-rose-600" />
                <span>Open Vicinity Radar</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
