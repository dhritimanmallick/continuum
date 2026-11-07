# Vyuhaa Continuum: Android app, Play Store and WhatsApp go-live

One Android app (`com.vyuhaa.continuum`) with two entry points: **"I'm a mother or family member"** and **"I work at an OPD"**. Doctor, lab, pharmacy and admin profiles sit behind "Doctor, lab, pharmacy or admin?".

The app is free. WhatsApp messaging is the only paid part: each OPD gets **₹1,000 of starter credit, usable for 3 months**. After that it tops up a prepaid balance, at a flat fee per message (default **₹0.35**).

---

## 1. How the app is built

| Piece | Where |
|---|---|
| Native shell | Capacitor 8 (`capacitor.config.ts`, `android/`). Targets Android 16 (API 36), minimum Android 7 (API 24), JDK 21 |
| App UI | Same React app as the web. Built with `VITE_APP_MODE=android` (two-entry home) and `VITE_API_BASE` = the hosted server |
| Native behaviour | `src/native.ts`: status bar and splash screen. The Android back button closes the open pop-up, then returns to the home screen, then exits |
| Server API for the app | `server.ts` accepts calls from the app (CORS for `https://localhost`) |
| Icons, splash | `android/app/src/main/res/` (generated from the Vyuhaa logo) |

### Build locally (Android Studio or command line)
```bash
npm ci
VITE_APP_MODE=android VITE_API_BASE=https://continuummcp.ai.studio npx vite build
npx cap sync android
cd android && ./gradlew assembleDebug            # app/build/outputs/apk/debug/app-debug.apk
```
Or open the `android/` folder in Android Studio and press Run with a phone connected.

### Build on GitHub (recommended)
`.github/workflows/android.yml` runs on GitHub Actions:
- **Every push to `main`:** a debug APK, under the run's *Artifacts*.
- **Actions → Android app → Run workflow**, or a tag such as `v1.0.1`: a signed **AAB for Play** plus a signed APK.

For signed builds, add these repository secrets (*Settings → Secrets and variables → Actions*):

| Secret | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | output of `base64 -w0 continuum-upload.jks` (on Windows PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("continuum-upload.jks"))`) |
| `ANDROID_KEYSTORE_PASSWORD` | from `upload-key-credentials.txt` |
| `ANDROID_KEY_ALIAS` | `continuum-upload` |
| `ANDROID_KEY_PASSWORD` | from `upload-key-credentials.txt` |

Optional repository *variable*: `CONTINUUM_API_BASE`, if the server moves from `https://continuummcp.ai.studio`.

The CI version code is 100 + run number, so it is always higher than the first upload (version code 1).

### The upload key
`continuum-upload.jks` signs what you upload to Play. Google re-signs the app with its own app-signing key (Play App Signing).
- **Keep it and its password safe**: a password manager plus one offline copy. Never commit it to git.
- If it is lost or leaked, Play Console can reset the upload key (*Setup → App signing → Request upload key reset*). The app itself is not lost.

---

## 2. Publish on Google Play

### Account
- **Use an Organization account for Vyuhaa Med Data Pvt Ltd.** It needs a D-U-N-S number and a one-time $25 fee.
- Organization accounts skip the rule that new **personal** accounts (created after 13 Nov 2023) must run a closed test with **12 testers for 14 continuous days** before production.

### Steps
1. **Before any upload:** merge the PR and redeploy the web app, so the app's server has the new API and CORS. Set the WhatsApp variables in section 3.
2. **Create the app:** Play Console → *Create app* → name **Vyuhaa Continuum**, app, free, default language English (India).
3. **App signing:** keep **Play App Signing** on (the default). Upload `vyuhaa-continuum-1.0.0.aab`.
4. **Internal testing first:** *Testing → Internal testing → Create release*, upload the AAB, and add your team's Gmail addresses. Install from the opt-in link and check:
   - home screen and both entry points;
   - back button behaviour;
   - camera on "Scan slip";
   - Call and WhatsApp buttons;
   - WhatsApp credit balance loads.
5. **App content** (*Policy → App content*): see the form answers below.
6. **Store listing:** use the text and images in `docs/play-store/`.
7. **Release:** promote from internal testing to closed testing or production, then send for review. First reviews usually take a few days. Health apps are reviewed more closely.

### Store listing

| Field | Text |
|---|---|
| App name (≤30) | Vyuhaa Continuum |
| Short description (≤80) | Pregnancy & baby care: check-ups, doctors, costs and records, with your OPD. |
| Category | Medical |
| Contact email | dhritiman@vyuhaadata.com |
| Website | https://vyuhaadata.com |
| Privacy policy | https://continuummcp.ai.studio/privacy.html (also linked inside the app) |
| App icon | `docs/play-store/icon-512.png` |
| Feature graphic | `docs/play-store/feature-graphic-1024x500.png` |
| Phone screenshots | `docs/play-store/screenshots/` (1080×1920) |

**Full description:**

> Vyuhaa Continuum keeps one record for a mother and her baby, from pregnancy to the child's vaccinations, and connects it with the hospital OPD that cares for her.
>
> **For mothers and families**
> • See your next check-ups, tests and scans for your stage of pregnancy, with fasting instructions
> • Short videos recommended by obstetricians for your stage
> • Find doctors and labs across nearby hospitals, with fees and test prices shown up front
> • Ask for a 5-minute call with a doctor when you are worried
> • Keep your reports in your ABHA health locker and decide which hospital can see them
> • Add your husband, mother or mother-in-law to your Family Circle, and get labour updates on WhatsApp
> • Track your baby's vaccinations from birth
>
> **For hospital OPDs**
> • Register patients with their mobile number and ABHA; photograph paper prescriptions
> • Today's queue as simple cards, with Call and WhatsApp in one tap
> • Care gaps: see which mothers are due or overdue for tests, scans, medicines or visits, based on a doctor-approved care schedule
> • Send reminders on WhatsApp in the patient's language
>
> Continuum is free. OPDs pay only for WhatsApp messages, from a prepaid credit. Every OPD starts with ₹1,000 of credit for 3 months.
>
> **Important:** Vyuhaa Continuum is not a medical device and does not diagnose, treat, cure or prevent any medical condition. Always consult a qualified healthcare professional for medical advice, diagnosis or treatment. In an emergency, call 108.
>
> Made in India by Vyuhaa Med Data Pvt Ltd.

### App content answers

| Form | Answer |
|---|---|
| Privacy policy | https://continuummcp.ai.studio/privacy.html |
| Ads | No ads |
| App access | All functionality is available without special access. The demo opens on a profile choice with sample data. |
| Content rating | Questionnaire category *Reference, News or Educational*. No violence, sexual content, gambling or user-to-user chat with strangers. Expected rating: everyone or 3+ |
| Target audience | 18 and over (mothers, families, hospital staff). Not designed for children. |
| News app | No |
| Government app | No |
| Financial features | None in the Android app (credit is bought on the web dashboard) |
| **Health apps declaration** | Tick the features that apply: connecting patients with healthcare providers or healthcare services; medical/health records management; reproductive and maternal health (pregnancy tracking); and the clinic/OPD tools for healthcare providers. **Not** a regulated medical device. |
| **Data safety** | See below |

**Data safety form** (review against your final production set-up):

| Data type | Collected | Shared* | Purpose | Optional? |
|---|---|---|---|---|
| Name, phone number | Yes | No | App functionality, communications | No |
| Health info (pregnancy, records, tests, prescriptions) | Yes | No | App functionality | No |
| Photos (documents the user chooses to photograph) | Yes | No | App functionality | Yes |
| Messages (WhatsApp reminders and replies) | Yes | No | App functionality, communications | Yes |
| Approximate location (Nearby on Map, only if allowed) | Yes | No | App functionality | Yes |
| App activity and diagnostics | No | No | n/a | n/a |

\*Data sent to service providers that process it on Vyuhaa's behalf (hosting, Google Gemini, Gupshup/Meta for WhatsApp) does not count as "sharing" in Play's definition. It must be described in the privacy policy, which it is.

Further Data safety answers:
- Data is encrypted in transit: **Yes**.
- Users can request deletion: **Yes**, via dhritiman@vyuhaadata.com.
- Data collection is not required to use the app (demo profiles): answer as appropriate for the production version with real sign-in.

---

## 3. WhatsApp go-live (Gupshup)

The app already sends every outgoing WhatsApp message through `src/server/whatsapp.ts`. Until keys are set, it runs in **demo mode**: no real messages are sent, but credit is still deducted so the billing can be shown.

1. **Gupshup account and WhatsApp Business API app:** connect a dedicated phone number for Vyuhaa Continuum, and complete Meta Business verification for Vyuhaa Med Data.
2. **Register one utility template** in English, Hindi and Bengali (more languages later), with the name `continuum_update` and category **Utility**:
   > Hello {{1}}, an update from {{2}}: {{3}}

   Meta may ask for more specific wording. If so, register one template per message type and map them in `GupshupProvider`.
3. **Set these server environment variables** (AI Studio → Secrets / environment):

| Variable | Value |
|---|---|
| `GUPSHUP_API_KEY` | from Gupshup dashboard |
| `GUPSHUP_SOURCE` | business number, e.g. `91XXXXXXXXXX` |
| `GUPSHUP_APP_NAME` | Gupshup app name |
| `WA_TEMPLATE_UPDATE_ID` | template id of `continuum_update` |
| `WA_PRICE_PER_MESSAGE` | fee charged to OPDs, e.g. `0.35` |
| `WA_WEBHOOK_TOKEN` | any long random string |

4. **Set the Gupshup callback URL** to `https://continuummcp.ai.studio/api/whatsapp/webhook?token=<WA_WEBHOOK_TOKEN>`. This records delivery status, and patient replies open the 24-hour window for free-text messages.
5. **Collect WhatsApp opt-in at registration** (Meta requires it). The registration form already asks for the patient's WhatsApp number and language.

### Pricing logic (`src/services/whatsappPricing.ts`, `src/server/whatsapp.ts`)
- **Starter credit:** a new OPD gets ₹1,000, which expires 90 days after activation. Unused starter credit then lapses.
- **Charging:** each message accepted by Gupshup is charged the flat fee. Starter credit is used first, then the paid balance. Failed sends are refunded.
- **Credit runs out:** messages are held with a "credit used up, top up" note, and the front desk sees a Top up button.
- **Top-ups:** ₹500 / ₹1,000 / ₹2,000 / ₹5,000. These are bought on the web dashboard (Admin → WhatsApp & Billing). The Android app shows the balance but no buy button, because Google Play's payments policy would otherwise require Play Billing for in-app purchases of digital services.
- **Margin:** Meta charges per delivered template message and Gupshup adds its own fee. Check the current Meta India utility rate and your Gupshup plan, then set `WA_PRICE_PER_MESSAGE` to cover both plus your margin.

### Before real patients
- **Payment gateway:** replace the simulated top-up with Razorpay (or similar). Call `/api/whatsapp/topup` only from the gateway's verified payment webhook, and remove the open top-up route.
- **Database:** move the ledger from `data/whatsapp-ledger.json` to the production database. AI Studio's disk is not guaranteed to survive redeploys.
- **Security:** add real staff sign-in, and protect `/api/whatsapp/*` so only signed-in OPD staff can send or see balances.

Checks: `npm run test:whatsapp` (11 billing checks) and `npm run test:rules` (167 rule checks).
